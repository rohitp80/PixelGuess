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
  bestScore: number;
  hintsUsed: number;
  timeElapsed: number;
  guesses: string[];
  currentGuess: string;
  revealProgress: number;
  selectedCategory: string;
  autoRevealCount: { threePixel: number; twoPixel: number };
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
  | { type: 'UPDATE_REVEAL_PROGRESS'; payload: number }
  | { type: 'AUTO_REVEAL_PIXELS' };

const initialState: GameState = {
  currentImage: null,
  revealedPixels: [],
  gameStatus: 'menu',
  score: 0,
  bestScore: 0,
  hintsUsed: 0,
  timeElapsed: 0,
  guesses: [],
  currentGuess: '',
  revealProgress: 0,
  selectedCategory: 'animals',
  autoRevealCount: { threePixel: 0, twoPixel: 0 },
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
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
        autoRevealCount: { threePixel: 0, twoPixel: 0 },
      };
    }

    case 'REVEAL_PIXEL': {
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
    }

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

    case 'COMPLETE_GAME': {
      const baseScore = state.currentImage?.difficulty === 'hard' ? 100 : 
                       state.currentImage?.difficulty === 'medium' ? 75 : 50;
      const timeBonus = Math.max(0, Math.floor((60000 - state.timeElapsed) / 1000)); // Convert ms to seconds for bonus
      const hintPenalty = state.hintsUsed * 10;
      const finalScore = action.payload.success ? Math.max(10, baseScore + timeBonus - hintPenalty) : 0;
      const newBestScore = Math.max(state.bestScore, finalScore);

      return {
        ...state,
        gameStatus: action.payload.success ? 'completed' : 'failed',
        score: finalScore,
        bestScore: newBestScore,
      };
    }

    case 'RESET_GAME':
      return {
        ...initialState,
        bestScore: state.bestScore, // Preserve best score
      };

    case 'SET_CATEGORY':
      return {
        ...state,
        selectedCategory: action.payload,
      };

    case 'AUTO_REVEAL_PIXELS': {
      if (!state.currentImage) return state;
      
      const { threePixel, twoPixel } = state.autoRevealCount;
      const pixelsToReveal = threePixel < 16 ? 12 : 8;
      const newAutoRevealCount = pixelsToReveal === 12 
        ? { ...state.autoRevealCount, threePixel: threePixel + 1 }
        : { ...state.autoRevealCount, twoPixel: twoPixel + 1 };
      
      const currentRevealedPixels = [...state.revealedPixels];
      const gridSize = state.currentImage.gridSize;
      const unrevealedPositions: { row: number; col: number }[] = [];
      
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          if (!currentRevealedPixels[row][col]) {
            unrevealedPositions.push({ row, col });
          }
        }
      }
      
      const actualPixelsToReveal = Math.min(pixelsToReveal, unrevealedPositions.length);
      for (let i = 0; i < actualPixelsToReveal; i++) {
        const randomIndex = Math.floor(Math.random() * unrevealedPositions.length);
        const { row, col } = unrevealedPositions.splice(randomIndex, 1)[0];
        currentRevealedPixels[row][col] = true;
      }
      
      const totalPixels = gridSize * gridSize;
      const revealedCount = currentRevealedPixels.flat().filter(Boolean).length;
      const newProgress = (revealedCount / totalPixels) * 100;
      
      return {
        ...state,
        revealedPixels: currentRevealedPixels,
        revealProgress: newProgress,
        autoRevealCount: newAutoRevealCount,
      };
    }

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