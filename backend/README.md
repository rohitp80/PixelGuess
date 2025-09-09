# PixelGuess Backend

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start MongoDB (make sure MongoDB is running on your system)

3. Start the server:
```bash
npm run dev
```

## API Endpoints

- `POST /api/players` - Create/get player
- `POST /api/game-sessions` - Save game session
- `GET /api/leaderboard/today` - Get today's leaderboard
- `GET /api/players/:name` - Get player stats

## Environment Variables

- `PORT` - Server port (default: 3001)
- `MONGODB_URI` - MongoDB connection string
