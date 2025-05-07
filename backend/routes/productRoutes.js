const express = require('express');
const router = express.Router();
const multer = require('multer');
const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');
const Review = require('../models/Review'); // Assuming Review model is defined in this file

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Make sure uploads directory exists
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)){
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB file size limit
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('Error in GET /products', err);
    res.status(500).json({ message: err.message });
  }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new product
router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('Received request to add product:', req.body);
    console.log('File info:', req.file);
    
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    // Create the product using the data from request
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      // Store the relative path to the image that will be accessible via /uploads
      image: `/uploads/${path.basename(req.file.path)}`
    });

    console.log('Trying to save product:', product);
    const newProduct = await product.save();
    console.log('Product saved successfully:', newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    console.log(`Attempting to delete product with ID: ${req.params.id}`);
    
    // Find the product to get the image path before deletion
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete the product from the database
    const result = await Product.findByIdAndDelete(req.params.id);
    
    // Delete associated reviews
    await Review.deleteMany({ product: req.params.id });
    
    // Try to delete the image file if it exists
    if (product.image) {
      try {
        const imagePath = path.join(__dirname, '..', product.image.replace('/uploads/', 'uploads/'));
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log(`Deleted image file: ${imagePath}`);
        }
      } catch (fileErr) {
        console.error('Error deleting image file:', fileErr);
        // Continue even if image deletion fails
      }
    }
    
    console.log(`Product deleted: ${req.params.id}`);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
