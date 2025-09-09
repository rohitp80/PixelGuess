import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Player from './models/Player.js';
import GameSession from './models/GameSession.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Get or create player
app.post('/api/players', async (req, res) => {
  try {
    const { name } = req.body;
    let player = await Player.findOne({ name });
    
    if (!player) {
      player = new Player({ name });
      await player.save();
    }
    
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save game session
app.post('/api/game-sessions', async (req, res) => {
  try {
    const session = new GameSession(req.body);
    await session.save();
    
    // Update player stats
    const player = await Player.findOne({ name: req.body.playerName });
    if (player) {
      player.gamesPlayed += 1;
      if (req.body.completed) {
        player.gamesWon += 1;
        if (req.body.score > player.bestScore) {
          player.bestScore = req.body.score;
        }
      }
      await player.save();
    }
    
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get today's leaderboard
app.get('/api/leaderboard/today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sessions = await GameSession.find({
      completed: true,
      createdAt: { $gte: today }
    })
    .sort({ score: -1 })
    .limit(10);
    
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get player stats
app.get('/api/players/:name', async (req, res) => {
  try {
    const player = await Player.findOne({ name: req.params.name });
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
