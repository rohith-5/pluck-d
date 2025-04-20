import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  CardContent
} from '@mui/material';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../api/products';
import { toast } from 'react-toastify';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    image: ''
  });

  const loadProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (error) {
      toast.error('Failed to load products!');
    }
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await updateProduct(editing.id, form);
        toast.success('Product Updated!');
      } else {
        await createProduct(form);
        toast.success('Product Added!');
      }
      setForm({ name: '', price: '', description: '', image: '' });
      setEditing(null);
      loadProducts();
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      toast.success('Product Deleted!');
      if (editing && editing.id === id) {
        setForm({ name: '', price: '', description: '', image: '' });
        setEditing(null);
      }
      loadProducts();
    } catch (error) {
      toast.error('Failed to delete product!');
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Products
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            fullWidth
            sx={{ height: '100%' }}
            disabled={!form.name || !form.price}
          >
            {editing ? 'Update Product' : 'Add Product'}
          </Button>
        </Grid>
      </Grid>

      <Typography variant="h6">All Products</Typography>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography>₹ {product.price}</Typography>
                <Typography variant="body2" color="text.secondary">{product.description}</Typography>
                <Button
                  size="small"
                  onClick={() => {
                    setEditing(product);
                    setForm({
                      name: product.name,
                      price: product.price,
                      description: product.description,
                      image: product.image
                    });
                  }}
                  sx={{ mt: 1 }}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDelete(product.id)}
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

export default ManageProducts;
