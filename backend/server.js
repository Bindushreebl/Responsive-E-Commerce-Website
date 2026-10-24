const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");
const Order = require("./models/Order");
const seedProducts = require("./data/seedProducts");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI && !process.env.MONGODB_URI.includes("<db_password>")
    ? process.env.MONGODB_URI
    : "mongodb://127.0.0.1:27017/shopease";

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`Connected to MongoDB at: ${MONGODB_URI}`);

    // Auto-seed if database is empty
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log("No products found in DB. Auto-seeding initial catalog...");
      await Product.insertMany(seedProducts);
      console.log(`Seeded ${seedProducts.length} initial products.`);
    } else {
      console.log(`Database ready. ${count} products in catalog.`);
    }
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
}

connectDB();

// Root status
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to ShopEase API!",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    status: "Backend is running successfully",
  });
});

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    const productCount = isDbConnected ? await Product.countDocuments() : 0;
    const orderCount = isDbConnected ? await Order.countDocuments() : 0;

    res.json({
      status: "healthy",
      database: isDbConnected ? "connected" : "disconnected",
      stats: {
        products: productCount,
        orders: orderCount,
      },
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// GET all products with filtering, searching, and sorting
app.get("/api/products", async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort, badge } = req.query;
    const filter = {};

    if (category && category !== "All") {
      filter.category = category;
    }

    if (badge && badge !== "All") {
      filter.badge = badge;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { badge: searchRegex },
      ];
    }

    let query = Product.find(filter);

    // Sorting options
    if (sort === "price-asc") {
      query = query.sort({ price: 1 });
    } else if (sort === "price-desc") {
      query = query.sort({ price: -1 });
    } else if (sort === "rating") {
      query = query.sort({ rating: -1, reviewsCount: -1 });
    } else if (sort === "newest") {
      query = query.sort({ createdAt: -1 });
    } else {
      // Default: featured / highest rating
      query = query.sort({ rating: -1, _id: 1 });
    }

    const products = await query.exec();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET product categories with counts
app.get("/api/categories", async (req, res) => {
  try {
    const categoriesWithCount = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          sampleEmoji: { $first: "$emoji" },
          sampleColor: { $first: "$color" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const totalProducts = await Product.countDocuments();

    const formatted = [
      { name: "All", count: totalProducts, emoji: "✨" },
      ...categoriesWithCount.map((c) => ({
        name: c._id,
        count: c.count,
        emoji: c.sampleEmoji || "🏷️",
        color: c.sampleColor || "#ede9fe",
      })),
    ];

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// GET single product by ID
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Also get related products in same category
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(4);

    res.json({ product, related });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Invalid product ID or server error" });
  }
});

// POST create new order
app.post("/api/orders", async (req, res) => {
  try {
    const { customer, items, pricing, payment } = req.body;

    if (!customer || !customer.fullName || !customer.email || !customer.address) {
      return res.status(400).json({ error: "Incomplete customer details" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Generate unique Order ID e.g. ORD-68219-X
    const orderId = `SE-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder = new Order({
      orderId,
      customer,
      items,
      pricing,
      payment: {
        method: payment?.method || "card",
        status: payment?.method === "cod" ? "Cash on Delivery" : "Paid",
        transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      },
      status: "Confirmed",
    });

    const savedOrder = await newOrder.save();
    console.log(`Order ${savedOrder.orderId} placed successfully for ${customer.fullName}`);

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: error.message || "Failed to process order" });
  }
});

// GET all orders (recent first)
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(50);
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// GET single order by orderId
app.get("/api/orders/:orderId", async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// POST seed / reset catalog
app.post("/api/seed", async (req, res) => {
  try {
    await Product.deleteMany({});
    const inserted = await Product.insertMany(seedProducts);
    res.json({
      success: true,
      message: `Database successfully re-seeded with ${inserted.length} products.`,
    });
  } catch (error) {
    console.error("Error seeding:", error);
    res.status(500).json({ error: "Failed to re-seed catalog" });
  }
});

app.listen(PORT, () => {
  console.log(`ShopEase server running at http://localhost:${PORT}`);
});
