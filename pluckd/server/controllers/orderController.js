const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendOrderConfirmationEmail, sendStatusUpdateEmail } = require('../services/emailService');

exports.createOrder = async (req, res) => {
  const { buyerName, buyerContact, deliveryAddress, items, status = 'PENDING', userId } = req.body;
  
  try {
    console.log('Received order data:', {
      buyerName,
      buyerContact,
      deliveryAddress,
      items,
      status,
      userId
    });

    // Validate required fields
    if (!buyerName || !buyerContact || !deliveryAddress || !items || !Array.isArray(items)) {
      console.error('Validation failed:', {
        buyerName: !!buyerName,
        buyerContact: !!buyerContact,
        deliveryAddress: !!deliveryAddress,
        items: items && Array.isArray(items)
      });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // If userId is provided, verify the user exists
    let userConnect = {};
    let userEmail = null;
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) }
      });
      
      if (user) {
        userConnect = { user: { connect: { id: parseInt(userId) } } };
        userEmail = user.email;
      } else {
        console.warn(`User with ID ${userId} not found, creating order without user association`);
      }
    }

    // Create the order with items
    const order = await prisma.order.create({
      data: {
        buyerName,
        buyerContact,
        deliveryAddress,
        status,
        ...userConnect,
        items: {
          create: items.map((item) => ({
            quantity: item.quantity || 1,
            price: item.price || 0,
            product: {
              connect: { id: item.productId },
            },
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    console.log('Order created successfully:', order);

    // Send order confirmation email if user email is available
    if (userEmail) {
      try {
        await sendOrderConfirmationEmail(order, userEmail);
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError);
        // Don't fail the order creation if email fails
      }
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('CREATE ORDER ERROR:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
    res.status(500).json({ 
      error: 'Failed to create order',
      details: error.message,
      code: error.code
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: { product: true }, 
        },
      },
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

exports.getUserOrders = async (req, res) => {
  const { userId } = req.params;
  const {
    status,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    startDate,
    endDate
  } = req.query;

  try {
    if (!userId || userId === 'undefined') {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const parsedUserId = parseInt(userId, 10);
    if (isNaN(parsedUserId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const allowedSortFields = ['createdAt', 'totalAmount']; // Only use fields that exist
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const orderDirection = sortOrder === 'asc' ? 'asc' : 'desc';

    const where = { userId: parsedUserId };

    if (status) {
      where.status = status;
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start) || isNaN(end)) {
        return res.status(400).json({ error: 'Invalid date format' });
      }

      where.createdAt = {
        gte: start,
        lte: end
      };
    }

    // Log for debugging
    console.log('Fetching user orders with filter:', {
      where,
      orderBy: { [safeSortBy]: orderDirection }
    });

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: safeSortBy === 'totalAmount' ? undefined : { [safeSortBy]: orderDirection },
    });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
};



exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: {
        items: {
          include: { product: true }, 
        },
      },
    });
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get order' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Validate status
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: {
        user: true
      }
    });

    if (!existingOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: { status },
      include: {
        items: {
          include: { product: true }
        },
        user: true
      }
    });

    // Send status update email if user email is available
    if (existingOrder.user?.email) {
      try {
        await sendStatusUpdateEmail(updatedOrder, existingOrder.user.email);
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError);
        // Don't fail the status update if email fails
      }
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ 
      error: 'Failed to update order status',
      details: error.message
    });
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.order.delete({ where: { id: Number(id) } });
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
};
