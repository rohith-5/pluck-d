import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Container, Typography } from '@mui/material';

const OrderConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.items) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5" color="error">Oops! No order data found.</Typography>
        <Button onClick={() => navigate('/')} sx={{ mt: 2 }} variant="contained">Back to Home</Button>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Order Placed Successfully!</Typography>
      <Typography>Name: {state.buyerName}</Typography>
      <Typography>Contact: {state.buyerContact}</Typography>
      <Typography>Address: {state.deliveryAddress}</Typography>
      <Typography>Status: {state.status}</Typography>
      <Typography sx={{ mt: 2 }}>Items:</Typography>
      {state.items.map((item, i) => (
        <Typography key={i}>• {item.product?.name || 'Unknown'} x {item.quantity}</Typography>
      ))}
      <Button onClick={() => navigate('/')} sx={{ mt: 3 }} variant="contained">Back to Home</Button>
    </Container>
  );
};

export default OrderConfirmation;
