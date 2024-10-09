const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log(`Mongo URI: ${process.env.MONGO_URI}`);
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.bold);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

module.exports = connectDB;
