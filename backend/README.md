# PixelGuess Backend

Backend API for the PixelGuess game using Supabase as the database.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up Supabase:
   - Create a new project at https://supabase.com
   - Go to Settings > API to get your project URL and anon key
   - Run the SQL commands from `schema.sql` in the Supabase SQL editor

3. Configure environment variables:
   - Update `.env` with your Supabase credentials:
   ```
   PORT=3001
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the server:
```bash
npm run dev
```

## API Endpoints

- `POST /api/players` - Create or get player
- `POST /api/game-sessions` - Save game session
- `GET /api/players/:name` - Get player stats
