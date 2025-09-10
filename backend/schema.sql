-- Create players table
CREATE TABLE players (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  best_score INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  games_won INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create game_sessions table
CREATE TABLE game_sessions (
  id SERIAL PRIMARY KEY,
  player_name VARCHAR(255) NOT NULL,
  score INTEGER NOT NULL,
  time_elapsed INTEGER NOT NULL,
  hints_used INTEGER DEFAULT 0,
  image_name VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  difficulty VARCHAR(10) CHECK (difficulty IN ('easy', 'medium', 'hard')) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_players_name ON players(name);
CREATE INDEX idx_game_sessions_player_name ON game_sessions(player_name);
CREATE INDEX idx_game_sessions_created_at ON game_sessions(created_at);
CREATE INDEX idx_game_sessions_completed ON game_sessions(completed);

-- Enable Row Level Security (RLS)
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Allow all operations on players" ON players FOR ALL USING (true);
CREATE POLICY "Allow all operations on game_sessions" ON game_sessions FOR ALL USING (true);
