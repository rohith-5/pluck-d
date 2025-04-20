import React, { useState } from 'react';
import {
  Container, Typography, TextField, Button, CircularProgress, Card, CardContent
} from '@mui/material';
import { fetchOrderById } from '../api/orders';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    try {
      setLoading(true);
      const { data } = await fetchOrderById(orderId);
      setOrder(data);
    } catch (err) {
      alert('Order not found');
      console.error(err);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Track Your Order
      </Typography>

      <TextField
        label="Enter Order ID"
        fullWidth
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button variant="contained" onClick={handleTrack}>Track</Button>

      {loading && <CircularProgress sx={{ mt: 2 }} />}

      {order && (
        <Card sx={{ transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
          <CardContent>
            <Typography variant="h6">Status: {order.status}</Typography>
            <Typography>Name: {order.buyer_name}</Typography>
            <Typography>Contact: {order.buyer_contact}</Typography>
            <Typography>Address: {order.delivery_address}</Typography>
            <Typography sx={{ mt: 1 }}>
              Items: {JSON.parse(order.items).join(', ')}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default TrackOrder;
