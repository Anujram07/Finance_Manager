const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

/*
|--------------------------------------------------------------------------
| Database Connection
|--------------------------------------------------------------------------
*/
connectDB();

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/
app.use(express.json());
app.use(cors());

/*
|--------------------------------------------------------------------------
| Gemini Setup
|--------------------------------------------------------------------------
*/
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/data", require("./routes/dataRoutes"));
app.use("/api/goals", require("./routes/goalRoutes"));
app.use("/api/finance", require("./routes/financeRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/insights", require("./routes/insightRoutes"));
app.use(
  "/api/loan",
  require("./routes/loanRoutes")
);


/*
|--------------------------------------------------------------------------
| Gemini Chat Route
|--------------------------------------------------------------------------
*/
app.post("/api/chat", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.status(200).json({
      success: true,
      reply: response.text,
    });
  } catch (error) {
    console.error("Gemini Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate response",
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Server Startup
|--------------------------------------------------------------------------
*/
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});