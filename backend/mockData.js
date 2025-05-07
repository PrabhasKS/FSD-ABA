// Mock data for development when database is not available
const products = [
  {
    _id: "product1",
    name: "Smartphone XYZ",
    description: "Latest smartphone with amazing camera and performance",
    price: 699.99,
    image: "/uploads/placeholder-phone.jpg",
    createdAt: new Date()
  },
  {
    _id: "product2",
    name: "Laptop Pro",
    description: "Powerful laptop for professionals and creatives",
    price: 1299.99,
    image: "/uploads/placeholder-laptop.jpg",
    createdAt: new Date()
  },
  {
    _id: "product3",
    name: "Wireless Headphones",
    description: "Noise cancelling wireless headphones with premium sound",
    price: 149.99,
    image: "/uploads/placeholder-headphones.jpg",
    createdAt: new Date()
  }
];

const reviews = [
  {
    _id: "review1",
    product: "product1",
    userName: "John Doe",
    rating: 4,
    comment: "Great phone! The camera is excellent.",
    createdAt: new Date()
  },
  {
    _id: "review2",
    product: "product1",
    userName: "Jane Smith",
    rating: 5,
    comment: "Best phone I've ever had. Battery life is amazing!",
    createdAt: new Date()
  },
  {
    _id: "review3",
    product: "product2",
    userName: "Mike Johnson",
    rating: 5,
    comment: "Perfect for my design work. Fast and reliable.",
    createdAt: new Date()
  }
];

module.exports = { products, reviews };
