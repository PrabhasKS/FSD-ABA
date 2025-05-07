import React, { useState, useEffect } from 'react';
import './App.css';
import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';

function App() {
  const [theme, setTheme] = useState('light');
  const [showAddProduct, setShowAddProduct] = useState(false);
  
  // Toggle between light and dark mode
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Apply theme class to body element
  useEffect(() => {
    document.body.className = `${theme}-mode`;
  }, [theme]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Product Review System</h1>
        <div className="header-buttons">
          <button onClick={toggleTheme} className="theme-toggle-btn">
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
          <button 
            onClick={() => setShowAddProduct(!showAddProduct)}
            className="add-product-btn"
          >
            {showAddProduct ? 'Close Form' : 'Add New Product'}
          </button>
        </div>
      </header>

      <main className="app-content">
        {showAddProduct && (
          <AddProduct 
            onAddComplete={() => setShowAddProduct(false)}
          />
        )}
        
        <ProductList />
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 Product Review System</p>
      </footer>
    </div>
  );
}

export default App;
