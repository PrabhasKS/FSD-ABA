import React from 'react';
import './ReviewList.css';

function ReviewList({ reviews, onDeleteReview }) {
  if (reviews.length === 0) {
    return <div className="no-reviews">No reviews yet. Be the first to review!</div>;
  }

  // Helper function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'star filled' : 'star'}>
          {i <= rating ? '\u2605' : '\u2606'}
        </span>
      );
    }
    return stars;
  };

  // Format date to a readable string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle review deletion
  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Call the parent component's onDeleteReview function
        onDeleteReview(reviewId);
      } else {
        const error = await response.json();
        alert(`Failed to delete review: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review. Please try again.');
    }
  };

  return (
    <div className="review-list">
      <h3>Reviews ({reviews.length})</h3>
      {reviews.map(review => (
        <div key={review._id} className="review-item">
          <div className="review-header">
            <div className="user-info">
              <span className="user-name">{review.userName}</span>
              <span className="review-date">{formatDate(review.createdAt)}</span>
            </div>
            <div className="review-actions">
              <div className="review-rating">
                {renderStars(review.rating)}
              </div>
              <button 
                className="delete-review-btn" 
                onClick={() => handleDelete(review._id)}
                title="Delete Review"
              >
                ×
              </button>
            </div>
          </div>
          <p className="review-comment">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}

export default ReviewList;
