const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5000;
const MONGO_URI = process.env.MONGO_URI;

console.log(`MongoDB URI: ${MONGO_URI}`);

mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000, // 10 seconds timeout
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

const db = mongoose.connection;

db.on('error', (error) => console.error('❌ MongoDB Error:', error));
db.once('open', () => console.log('✅ Database connection successful'));
// Poll Model
const pollSchema = new mongoose.Schema({
  movie: String,
  votes: { type: Number, default: 0 },
});

const Poll = mongoose.model("Poll", pollSchema);

// Initialize Polls (Run once)
const initializePolls = async () => {
  const existingPolls = await Poll.find();
  if (existingPolls.length === 0) {
    await Poll.insertMany([
      { movie: "Movie A", votes: 0 },
      { movie: "Movie B", votes: 0 },
      { movie: "Movie C", votes: 0 }
    ]);
    console.log("Polls Initialized");
  }
};
initializePolls();

// Get Poll Results
app.get("/api/polls", async (req, res) => {
  const polls = await Poll.find();
  res.json(polls);
});

// Vote for a Movie
app.post("/api/vote", async (req, res) => {
  const { movie } = req.body;
  const updatedPoll = await Poll.findOneAndUpdate(
    { movie },
    { $inc: { votes: 1 } },
    { new: true }
  );
  res.json(updatedPoll);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
