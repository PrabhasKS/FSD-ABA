import React, { useState, useEffect } from 'react';
import './ProductItem.css';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

function ProductItem({ product, onDelete }) {
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const toggleReviews = async () => {
    const newState = !showReviews;
    setShowReviews(newState);
    
    // Fetch reviews when showing reviews section
    if (newState && reviews.length === 0) {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/reviews/product/${product._id}`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Add a new review to the list
  const handleNewReview = (newReview) => {
    setReviews([newReview, ...reviews]);
  };

  // Handle review deletion
  const handleReviewDelete = (reviewId) => {
    setReviews(reviews.filter(review => review._id !== reviewId));
  };

  // Handle product deletion
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    setDeleting(true);
    try {
      const response = await fetch(`http://localhost:5000/api/products/${product._id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Call the parent component's onDelete function
        onDelete(product._id);
      } else {
        const error = await response.json();
        alert(`Failed to delete product: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="product-item">
      <div className="product-image">
        <img 
          src={`http://localhost:5000${product.image}`} 
          alt={product.name} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x200?text=Product+Image';
          }}
        />
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-price">${product.price.toFixed(2)}</p>
        <p className="product-description">{product.description}</p>
        <div className="product-actions">
          <button 
            className="delete-product-btn" 
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Product'}
          </button>
        </div>
      </div>
      
      <button className="review-toggle-btn" onClick={toggleReviews}>
        {showReviews ? 'Hide Reviews' : 'Show Reviews'}
      </button>
      
      {showReviews && (
        <div className="reviews-section">
          <ReviewForm productId={product._id} onReviewAdded={handleNewReview} />
          
          {loading ? (
            <p className="loading-reviews">Loading reviews...</p>
          ) : (
            <ReviewList reviews={reviews} onDeleteReview={handleReviewDelete} />
          )}
        </div>
      )}
    </div>
  );
}

export default ProductItem;
