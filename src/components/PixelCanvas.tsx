import { useEffect, useRef, useState } from 'react';
import { useGame } from '@/contexts/GameContext';

interface PixelCanvasProps {
  size?: number;
}

export function PixelCanvas({ size = 400 }: PixelCanvasProps) {
  const { state, dispatch } = useGame();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealTimer, setRevealTimer] = useState<NodeJS.Timeout | null>(null);

  const { currentImage, revealedPixels, gameStatus } = state;

  // Create a simple pattern for demonstration
  const generatePixelPattern = (gridSize: number) => {
    const pattern = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false));
    
    // Create a simple smiley face pattern for 8x8 grid
    if (gridSize === 8) {
      // Eyes
      pattern[2][2] = true;
      pattern[2][5] = true;
      // Nose
      pattern[4][3] = true;
      pattern[4][4] = true;
      // Mouth
      pattern[5][2] = true;
      pattern[6][3] = true;
      pattern[6][4] = true;
      pattern[5][5] = true;
    } else if (gridSize === 16) {
      // More complex pattern for 16x16
      for (let i = 4; i < 12; i++) {
        for (let j = 4; j < 12; j++) {
          if ((i === 6 && (j === 6 || j === 9)) || // Eyes
              (i === 9 && j >= 6 && j <= 9) || // Mouth
              (i === 7 && (j === 7 || j === 8))) { // Nose
            pattern[i][j] = true;
          }
        }
      }
    }
    
    return pattern;
  };

  // Draw the canvas
  useEffect(() => {
    if (!canvasRef.current || !currentImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gridSize = currentImage.gridSize;
    const pixelSize = size / gridSize;
    
    // Clear canvas
    ctx.clearRect(0, 0, size, size);
    
    // Get the actual image pattern
    const imagePattern = generatePixelPattern(gridSize);
    
    // Draw grid and pixels
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const x = col * pixelSize;
        const y = row * pixelSize;
        
        // Draw pixel background
        ctx.fillStyle = 'hsl(240, 5%, 15%)';
        ctx.fillRect(x, y, pixelSize, pixelSize);
        
        // Draw revealed pixels
        if (revealedPixels[row] && revealedPixels[row][col] && imagePattern[row][col]) {
          ctx.fillStyle = 'hsl(263, 70%, 50%)';
          ctx.fillRect(x + 1, y + 1, pixelSize - 2, pixelSize - 2);
        }
        
        // Draw grid lines
        ctx.strokeStyle = 'hsl(240, 5%, 25%)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, pixelSize, pixelSize);
      }
    }
  }, [currentImage, revealedPixels, size]);

  // Auto-reveal pixels over time
  useEffect(() => {
    if (gameStatus !== 'playing' || !currentImage) return;

    const timer = setInterval(() => {
      const gridSize = currentImage.gridSize;
      const unrevealedPixels: [number, number][] = [];
      
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          if (!revealedPixels[row]?.[col]) {
            unrevealedPixels.push([row, col]);
          }
        }
      }
      
      if (unrevealedPixels.length > 0) {
        const randomIndex = Math.floor(Math.random() * unrevealedPixels.length);
        const [row, col] = unrevealedPixels[randomIndex];
        dispatch({ type: 'REVEAL_PIXEL', payload: { row, col } });
      } else {
        // All pixels revealed, end game
        dispatch({ type: 'COMPLETE_GAME', payload: { success: false } });
      }
    }, 1000 + (currentImage.difficulty === 'hard' ? 500 : currentImage.difficulty === 'medium' ? 1000 : 1500));

    setRevealTimer(timer);
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameStatus, currentImage, revealedPixels, dispatch]);

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (revealTimer) clearInterval(revealTimer);
    };
  }, [revealTimer]);

  if (!currentImage) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p className="text-muted-foreground">No image loaded</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="pixel-grid border-2 border-primary rounded-lg shadow-glow"
          style={{ imageRendering: 'pixelated' }}
        />
        
        {/* Overlay for game status */}
        {gameStatus !== 'playing' && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
            <div className="text-center">
              {gameStatus === 'completed' && (
                <div className="text-game-success">
                  <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
                  <p>You guessed correctly!</p>
                </div>
              )}
              {gameStatus === 'failed' && (
                <div className="text-game-error">
                  <h3 className="text-2xl font-bold mb-2">Game Over!</h3>
                  <p>The image was: {currentImage.name}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Progress bar */}
      <div className="w-full max-w-md">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Reveal Progress</span>
          <span>{Math.round(state.revealProgress)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${state.revealProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
}