import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api/orders';
import { toast } from 'react-toastify';
import { useUser } from './UserContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    toast.success(`${product.name} added to cart`);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
    toast.info('Item removed from cart');
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = async (orderData) => {
    try {
      setLoading(true);
      console.log('Placing order with data:', orderData);
      console.log('Cart items:', cart);

      if (!user || !user.id) {
        throw new Error('User not authenticated');
      }

      if (cart.length === 0) {
        throw new Error('Cart is empty');
      }

      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      }));
      
      console.log('Formatted order items:', orderItems);

      const orderPayload = {
        buyerName: orderData.buyerName,
        buyerContact: orderData.buyerContact,
        deliveryAddress: orderData.deliveryAddress,
        userId: user.id,
        items: orderItems,
        status: 'PENDING',
        totalAmount: getCartTotal()
      };

      console.log('Sending order payload:', orderPayload);

      const response = await createOrder(orderPayload);

      if (!response.data) {
        throw new Error('Invalid response from server');
      }

      clearCart();
      toast.success('Order placed successfully!');
      navigate('/order-confirmation', { 
        state: { 
          order: response.data,
          items: cart
        } 
      });
    } catch (err) {
      console.error('Order placement failed:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      toast.error(err.response?.data?.error || err.message || 'Failed to place order');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        placeOrder,
        getCartTotal,
        getCartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 