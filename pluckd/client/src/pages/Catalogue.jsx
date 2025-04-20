import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CircularProgress,
  Box,
  Alert,
  TextField,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useCart } from '../context/CartContext';
import { getProducts } from '../api/products';
import { useUser } from '../context/UserContext';

const Catalogue = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();
  const { user, error: authError } = useUser();

  const fetchProductsWithRetry = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        setLoading(true);
        setError(null);
        const data = await getProducts();
        if (Array.isArray(data)) {
          setProducts(data);
          return;
        } else {
          throw new Error('Invalid data format received from server');
        }
      } catch (err) {
        console.error(`Attempt ${i + 1} failed:`, err);
        if (i === retries - 1) {
          setError(err.message || 'Failed to load products');
          setProducts([]);
        } else {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
      } finally {
        if (i === retries - 1) {
          setLoading(false);
        }
      }
    }
  };

  useEffect(() => {
    fetchProductsWithRetry();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || authError) {
    return (
      <Container>
        <Alert 
          severity="error" 
          sx={{ mt: 2 }}
          action={
            <Button color="inherit" size="small" onClick={() => fetchProductsWithRetry()}>
              Retry
            </Button>
          }
        >
          {error || authError}
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Our Products
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {filteredProducts.length === 0 ? (
        <Alert severity="info">
          No products found matching your search.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image || '/placeholder.png'}
                  alt={product.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {product.description}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                    ₹{product.price}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => addToCart(product)}
                    disabled={!user}
                  >
                    {user ? 'Add to Cart' : 'Login to Add to Cart'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Catalogue;
