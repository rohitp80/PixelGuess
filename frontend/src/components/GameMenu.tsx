import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { gameImages } from '@/data/gameImages';
import { Play } from 'lucide-react';

export function GameMenu() {
  const { dispatch } = useGame();

  const handleStartGame = () => {
    // Get all images from all categories
    const allImages = Object.values(gameImages).flat();
    if (allImages.length > 0) {
      const randomImage = allImages[Math.floor(Math.random() * allImages.length)];
      dispatch({ 
        type: 'START_GAME', 
        payload: { image: randomImage, category: randomImage.category } 
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold glow-text mb-4 bg-gradient-primary bg-clip-text text-transparent">
            PixelGuess
          </h1>
          <p className="text-xl text-muted-foreground">
            Guess the image as it reveals pixel by pixel!
          </p>
        </div>

        {/* Game Actions */}
        <div className="flex justify-center">
          <Button
            variant="game"
            size="lg"
            onClick={handleStartGame}
            className="h-16 text-lg px-8"
          >
            <Play className="w-6 h-6" />
            Start Game
          </Button>
        </div>
      </div>
    </div>
  );
}