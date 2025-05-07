const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error('Error fetching all reviews:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get reviews for a specific product
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error(`Error fetching reviews for product ${req.params.productId}:`, err);
    res.status(500).json({ message: err.message });
  }
});

// Create a new review
router.post('/', async (req, res) => {
  try {
    console.log('Received request to add review:', req.body);

    // Check if product exists
    const product = await Product.findById(req.body.product);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = new Review({
      product: req.body.product,
      userName: req.body.userName,
      rating: req.body.rating,
      comment: req.body.comment
    });

    console.log('Trying to save review:', review);
    const newReview = await review.save();
    console.log('Review saved successfully:', newReview);
    res.status(201).json(newReview);
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete a review
router.delete('/:id', async (req, res) => {
  try {
    console.log(`Attempting to delete review with ID: ${req.params.id}`);
    
    // Find the review before deletion to check if it exists
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Delete the review
    await Review.findByIdAndDelete(req.params.id);
    
    console.log(`Review deleted: ${req.params.id}`);
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error('Error deleting review:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
