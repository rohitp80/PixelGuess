import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface PixelImage {
  id: string;
  name: string;
  category: string;
  imageData: string;
  gridSize: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GameState {
  currentImage: PixelImage | null;
  revealedPixels: boolean[][];
  gameStatus: 'menu' | 'playing' | 'paused' | 'completed' | 'failed';
  score: number;
  hintsUsed: number;
  timeElapsed: number;
  guesses: string[];
  currentGuess: string;
  revealProgress: number;
  selectedCategory: string;
}

type GameAction =
  | { type: 'START_GAME'; payload: { image: PixelImage; category: string } }
  | { type: 'REVEAL_PIXEL'; payload: { row: number; col: number } }
  | { type: 'SUBMIT_GUESS'; payload: string }
  | { type: 'USE_HINT' }
  | { type: 'UPDATE_TIME'; payload: number }
  | { type: 'COMPLETE_GAME'; payload: { success: boolean } }
  | { type: 'RESET_GAME' }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'UPDATE_REVEAL_PROGRESS'; payload: number };

const initialState: GameState = {
  currentImage: null,
  revealedPixels: [],
  gameStatus: 'menu',
  score: 0,
  hintsUsed: 0,
  timeElapsed: 0,
  guesses: [],
  currentGuess: '',
  revealProgress: 0,
  selectedCategory: 'animals',
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      const { image, category } = action.payload;
      return {
        ...state,
        currentImage: image,
        selectedCategory: category,
        gameStatus: 'playing',
        revealedPixels: Array(image.gridSize).fill(null).map(() => Array(image.gridSize).fill(false)),
        score: 0,
        hintsUsed: 0,
        timeElapsed: 0,
        guesses: [],
        currentGuess: '',
        revealProgress: 0,
      };

    case 'REVEAL_PIXEL':
      const { row, col } = action.payload;
      const newRevealedPixels = [...state.revealedPixels];
      newRevealedPixels[row][col] = true;
      
      const totalPixels = state.currentImage?.gridSize * state.currentImage?.gridSize || 1;
      const revealedCount = newRevealedPixels.flat().filter(Boolean).length;
      const newProgress = (revealedCount / totalPixels) * 100;

      return {
        ...state,
        revealedPixels: newRevealedPixels,
        revealProgress: newProgress,
      };

    case 'SUBMIT_GUESS':
      return {
        ...state,
        guesses: [...state.guesses, action.payload],
        currentGuess: '',
      };

    case 'USE_HINT':
      return {
        ...state,
        hintsUsed: state.hintsUsed + 1,
        score: Math.max(0, state.score - 10),
      };

    case 'UPDATE_TIME':
      return {
        ...state,
        timeElapsed: action.payload,
      };

    case 'COMPLETE_GAME':
      const baseScore = state.currentImage?.difficulty === 'hard' ? 100 : 
                       state.currentImage?.difficulty === 'medium' ? 75 : 50;
      const timeBonus = Math.max(0, 60 - state.timeElapsed);
      const hintPenalty = state.hintsUsed * 10;
      const finalScore = Math.max(0, baseScore + timeBonus - hintPenalty);

      return {
        ...state,
        gameStatus: action.payload.success ? 'completed' : 'failed',
        score: action.payload.success ? finalScore : 0,
      };

    case 'RESET_GAME':
      return initialState;

    case 'SET_CATEGORY':
      return {
        ...state,
        selectedCategory: action.payload,
      };

    case 'UPDATE_REVEAL_PROGRESS':
      return {
        ...state,
        revealProgress: action.payload,
      };

    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}