require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");
const seedProducts = require("./data/seedProducts");

const MONGODB_URI =
  process.env.MONGODB_URI && !process.env.MONGODB_URI.includes("<db_password>")
    ? process.env.MONGODB_URI
    : "mongodb://127.0.0.1:27017/shopease";

async function seedDatabase() {
  try {
    console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully.");

    await Product.deleteMany({});
    console.log("Cleared existing products.");

    const inserted = await Product.insertMany(seedProducts);
    console.log(`Successfully seeded ${inserted.length} products into MongoDB!`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
