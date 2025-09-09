const API_BASE_URL = 'http://localhost:3001/api';

export interface Player {
  _id: string;
  name: string;
  bestScore: number;
  gamesPlayed: number;
  gamesWon: number;
}

export interface GameSessionData {
  playerName: string;
  score: number;
  timeElapsed: number;
  hintsUsed: number;
  imageName: string;
  category: string;
  difficulty: string;
  completed: boolean;
}

export const api = {
  async getOrCreatePlayer(name: string): Promise<Player> {
    const response = await fetch(`${API_BASE_URL}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    return response.json();
  },

  async saveGameSession(sessionData: GameSessionData) {
    const response = await fetch(`${API_BASE_URL}/game-sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessionData)
    });
    return response.json();
  },

  async getTodayLeaderboard() {
    const response = await fetch(`${API_BASE_URL}/leaderboard/today`);
    return response.json();
  },

  async getPlayerStats(name: string): Promise<Player> {
    const response = await fetch(`${API_BASE_URL}/players/${name}`);
    return response.json();
  }
};
