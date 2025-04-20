import API from './api';

export const createOrder = async (orderData) => {
  const response = await API.post('/orders', orderData);
  return response;
};

export const fetchOrders = async () => {
  const response = await API.get('/orders');
  return response;
};

export const fetchUserOrders = async (userId) => {
  const response = await API.get(`/orders/user/${userId}`);
  return response;
};

export const fetchOrderById = async (orderId) => {
  const response = await API.get(`/orders/${orderId}`);
  return response;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await API.patch(`/orders/${orderId}/status`, { status });
  return response;
};

export const deleteOrder = async (orderId) => {
  const response = await API.delete(`/orders/${orderId}`);
  return response;
};