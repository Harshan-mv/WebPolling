const express = require("express");
const Poll = require("../models/Poll");
const router = express.Router();

// Create Poll
router.post("/", async (req, res) => {
  const { question, options } = req.body;
  const poll = new Poll({ question, options: options.map(text => ({ text, votes: 0 })) });

  try {
    await poll.save();
    res.status(201).json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Polls
router.get("/", async (req, res) => {
  const polls = await Poll.find();
  res.json(polls);
});

// Vote
router.put("/:id/vote", async (req, res) => {
  const { optionIndex } = req.body;
  const poll = await Poll.findById(req.params.id);
  
  if (!poll) return res.status(404).json({ message: "Poll not found" });

  poll.options[optionIndex].votes += 1;
  await poll.save();
  res.json(poll);
});

module.exports = router;
