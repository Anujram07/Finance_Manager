const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));

// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ DB connected successfully"))
  .catch(err => console.error("❌ DB connection error:", err.message));

app.listen(5000, () => console.log("Server running on port 5000"));