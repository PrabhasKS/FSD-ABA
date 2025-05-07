import React, { useState, useEffect } from 'react';
import './ProductList.css';
import ProductItem from './ProductItem';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch products from the backend
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('Attempting to fetch products from server...');
      const response = await fetch('http://localhost:5000/api/products', {
        headers: {
          'Accept': 'application/json',
        },
        // Adding a longer timeout for slow connections
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server responded with error:', response.status, errorText);
        throw new Error(`Server error: ${response.status} ${errorText || response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Products fetched successfully:', data);
      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(`${err.message}. Please check if the server is running at http://localhost:5000`);
      setLoading(false);
    }
  };

  // Handle product deletion
  const handleProductDelete = (productId) => {
    setProducts(products.filter(product => product._id !== productId));
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (products.length === 0) {
    return <div className="no-products">No products found. Add a new product!</div>;
  }

  return (
    <div className="product-list">
      <h2>Products</h2>
      <div className="products-grid">
        {products.map(product => (
          <ProductItem key={product._id} product={product} onDelete={handleProductDelete} />
        ))}
      </div>
    </div>
  );
}

export default ProductList;
