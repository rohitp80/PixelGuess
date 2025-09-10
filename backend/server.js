import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Get or create player
app.post('/api/players', async (req, res) => {
  try {
    const { name } = req.body;
    
    // Check if player exists
    const { data: existingPlayer } = await supabase
      .from('players')
      .select('*')
      .eq('name', name)
      .single();
    
    if (existingPlayer) {
      return res.json(existingPlayer);
    }
    
    // Create new player
    const { data: newPlayer, error } = await supabase
      .from('players')
      .insert([{ name }])
      .select()
      .single();
    
    if (error) throw error;
    res.json(newPlayer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save game session
app.post('/api/game-sessions', async (req, res) => {
  try {
    // Insert game session
    const { data: session, error: sessionError } = await supabase
      .from('game_sessions')
      .insert([req.body])
      .select()
      .single();
    
    if (sessionError) throw sessionError;
    
    // Update player stats
    const { playerName, completed, score } = req.body;
    
    const { data: player } = await supabase
      .from('players')
      .select('*')
      .eq('name', playerName)
      .single();
    
    if (player) {
      const updates = {
        games_played: player.games_played + 1,
        games_won: completed ? player.games_won + 1 : player.games_won,
        best_score: completed && score > player.best_score ? score : player.best_score
      };
      
      await supabase
        .from('players')
        .update(updates)
        .eq('name', playerName);
    }
    
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get player stats
app.get('/api/players/:name', async (req, res) => {
  try {
    const { data: player, error } = await supabase
      .from('players')
      .select('*')
      .eq('name', req.params.name)
      .single();
    
    if (error) {
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
