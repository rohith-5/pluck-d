import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Grid, Card, CardContent, Button, MenuItem, Select, Box
} from '@mui/material';
import { fetchOrders, updateOrderStatus } from '../api/orders';
import { getProducts, deleteProduct } from '../api/products'; // ✅ Correct import

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const loadDashboard = async () => {
    try {
      const orderRes = await fetchOrders();
      const productRes = await getProducts(); // ✅ Correct function call
      setOrders(orderRes.data);
      setProducts(productRes.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      setOrders(prev =>
        prev.map(order =>
          order.id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (err) {
      console.error('Failed to delete product', err);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Typography variant="h6" sx={{ mt: 3 }}>Orders</Typography>
      <Grid container spacing={2}>
        {orders.map((order) => (
          <Grid key={order.id} sx={{ width: { xs: '100%', md: '50%' } }}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">
                  {order.buyerName} ({order.buyerContact})
                </Typography>
                <Typography variant="body2">
                  Address: {order.deliveryAddress}
                </Typography>
                <Typography variant="body2">
                  Status: {order.status}
                </Typography>

                <Typography variant="body2" sx={{ mt: 1 }}>
                  Items:
                </Typography>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.product.name} — Qty: {item.quantity}
                    </li>
                  ))}
                </ul>

                <Box sx={{ mt: 1 }}>
                  <Select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    size="small"
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Processing">Processing</MenuItem>
                    <MenuItem value="Delivered">Delivered</MenuItem>
                  </Select>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" sx={{ mt: 4 }}>Products</Typography>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid key={product.id} sx={{ width: { xs: '100%', sm: '50%', md: '33.33%' } }}>
            <Card>
              <CardContent>
                <Typography>{product.name}</Typography>
                <Typography>₹ {product.price}</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  sx={{ mt: 1 }}
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
