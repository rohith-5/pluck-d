import React from 'react';
import {
  Container, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  CircularProgress,
  Paper,
  Box,
  Divider,
  IconButton
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const schema = yup.object({
  buyerName: yup.string().required('Name is required'),
  buyerContact: yup.string().required('Contact is required'),
  deliveryAddress: yup.string().required('Delivery address is required'),
});

const OrderForm = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    loading, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal, 
    placeOrder 
  } = useCart();

  const { handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      buyerName: '',
      buyerContact: '',
      deliveryAddress: '',
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (formData) => {
    try {
      await placeOrder(formData);
    } catch (err) {
      console.error('Order placement failed:', err);
      toast.error(err.response?.data?.error || 'Failed to place order. Please try again.');
    }
  };

  if (cart.length === 0) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Add some products to your cart before placing an order
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/')}
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Place Order
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            {cart.map((item) => (
              <Box key={item.product.id} sx={{ mb: 2 }}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      {item.product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ₹ {item.product.price} each
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      type="number"
                      size="small"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                  <Grid item xs={2} sx={{ textAlign: 'right' }}>
                    <Typography variant="body1">
                      ₹ {item.product.price * item.quantity}
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Total Amount</Typography>
              <Typography variant="h6">₹ {getCartTotal()}</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Delivery Details
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Controller
                    name="buyerName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Name"
                        fullWidth
                        error={!!errors.buyerName}
                        helperText={errors.buyerName?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="buyerContact"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Contact"
                        fullWidth
                        error={!!errors.buyerContact}
                        helperText={errors.buyerContact?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="deliveryAddress"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Delivery Address"
                        fullWidth
                        multiline
                        rows={3}
                        error={!!errors.deliveryAddress}
                        helperText={errors.deliveryAddress?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{ mt: 2 }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Place Order'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderForm;
