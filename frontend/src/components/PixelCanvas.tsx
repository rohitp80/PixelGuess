import { useEffect, useRef, useState } from 'react';
import { useGame } from '@/contexts/GameContext';

interface PixelCanvasProps {
  size?: number;
}

export function PixelCanvas({ size }: PixelCanvasProps) {
  const { state } = useGame();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [canvasSize, setCanvasSize] = useState(300);

  const { currentImage, revealedPixels, gameStatus } = state;

  // Calculate responsive canvas size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const maxSize = Math.min(containerWidth - 32, 400); // 16px padding on each side
        const minSize = 250;
        const calculatedSize = Math.max(minSize, maxSize);
        setCanvasSize(size || calculatedSize);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [size]);

  // Load and process the actual image
  useEffect(() => {
    if (!currentImage?.imageData) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const gridSize = currentImage.gridSize;
      canvas.width = gridSize;
      canvas.height = gridSize;
      
      // Draw image scaled to grid size
      ctx.drawImage(img, 0, 0, gridSize, gridSize);
      
      // Get image data
      const data = ctx.getImageData(0, 0, gridSize, gridSize);
      setImageData(data);
    };

    img.onerror = () => {
      console.error('Failed to load image:', currentImage.imageData);
    };

    img.src = currentImage.imageData;
  }, [currentImage]);

  // Draw the canvas
  useEffect(() => {
    if (!canvasRef.current || !currentImage || !imageData) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gridSize = currentImage.gridSize;
    const pixelSize = canvasSize / gridSize;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    
    // Draw grid and pixels
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const x = col * pixelSize;
        const y = row * pixelSize;
        
        // Draw pixel background
        ctx.fillStyle = 'hsl(240, 5%, 15%)';
        ctx.fillRect(x, y, pixelSize, pixelSize);
        
        // Draw revealed pixels with actual image colors
        if (revealedPixels[row] && revealedPixels[row][col]) {
          const pixelIndex = (row * gridSize + col) * 4;
          const r = imageData.data[pixelIndex];
          const g = imageData.data[pixelIndex + 1];
          const b = imageData.data[pixelIndex + 2];
          const a = imageData.data[pixelIndex + 3];
          
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
          ctx.fillRect(x + 1, y + 1, pixelSize - 2, pixelSize - 2);
        }
        
        // Draw grid lines
        ctx.strokeStyle = 'hsl(240, 5%, 25%)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, pixelSize, pixelSize);
      }
    }
  }, [currentImage, revealedPixels, canvasSize, imageData]);

  if (!currentImage) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p className="text-muted-foreground">No image loaded</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-3 md:gap-4 w-full">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          className="pixel-grid border-2 border-primary rounded-lg shadow-glow max-w-full"
          style={{ imageRendering: 'pixelated' }}
        />
        
        {/* Overlay for game status */}
        {gameStatus !== 'playing' && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
            <div className="text-center p-4">
              {gameStatus === 'completed' && (
                <div className="text-game-success">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">Congratulations!</h3>
                  <p className="text-sm md:text-base">You guessed correctly!</p>
                </div>
              )}
              {gameStatus === 'failed' && (
                <div className="text-game-error">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">Game Over!</h3>
                  <p className="text-sm md:text-base">The image was: {currentImage.name}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Progress bar */}
      <div className="w-full max-w-md">
        <div className="flex justify-between text-xs md:text-sm text-muted-foreground mb-2">
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