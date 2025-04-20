const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty',
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

exports.getProducts = async (req, res) => {
  try {
    // Check database connection first
    await prisma.$connect();
    
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        image: true,
        category: true
      }
    });

    if (!products) {
      throw new Error('No products found');
    }

    // Add timestamps if they don't exist in the database
    const productsWithTimestamps = products.map(product => ({
      ...product,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    res.json(productsWithTimestamps);
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Handle specific Prisma errors
    if (error.code === 'P1001') {
      console.error('Database connection error:', error.message);
      res.status(503).json({ 
        error: 'Database connection error',
        message: 'Please try again later'
      });
    } else if (error.code === 'P2025') {
      console.error('Record not found:', error.message);
      res.status(404).json({ 
        error: 'No products found',
        message: 'The requested products could not be found'
      });
    } else {
      console.error('Unexpected error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch products',
        message: error.message || 'An unexpected error occurred'
      });
    }
  } finally {
    // Disconnect from the database
    await prisma.$disconnect();
  }
};

exports.addProduct = async (req, res) => {
    const { name, price, description, image } = req.body;
    try {
      const newProduct = await prisma.product.create({
        data: { name, price: parseFloat(price), description, image },
      });
      res.status(201).json(newProduct);
    } catch (err) {
      console.error("💥 Prisma Error:", err.meta || err.message || err);
      console.error("Product creation failed:", err); // 🔍 Log full error
      res.status(500).json({ error: 'Failed to create product' });
    }
  };
  

exports.updateProduct = async (req, res) => {
    const { name, price } = req.body; 
    const { id } = req.params;
    try {
      const product = await prisma.product.update({
        where: { id: parseInt(id)},
        data: { name, price: parseFloat(price)},
      });
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update product' });
    }
  };

  exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
      await prisma.product.delete({ where: { id: Number(id) } });
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  };
  
