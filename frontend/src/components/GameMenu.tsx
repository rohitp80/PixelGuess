import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { createPixelImageFromFile } from '@/data/gameImages';
import { Play } from 'lucide-react';
import { useState, useEffect } from 'react';

export function GameMenu() {
  const { dispatch } = useGame();
  const [availableImages, setAvailableImages] = useState<string[]>([]);

  useEffect(() => {
    // Load available images from image-list.json
    const loadImages = async () => {
      try {
        const response = await fetch('/images/image-list.json');
        const data = await response.json();
        setAvailableImages(data.images || []);
      } catch (error) {
        console.error('Error loading images:', error);
        setAvailableImages([]);
      }
    };
    
    loadImages();
  }, []);

  const handleStartGame = () => {
    if (availableImages.length > 0) {
      const randomFilename = availableImages[Math.floor(Math.random() * availableImages.length)];
      const randomImage = createPixelImageFromFile(randomFilename, 'animals', 'easy');
      dispatch({ 
        type: 'START_GAME', 
        payload: { image: randomImage, category: randomImage.category } 
      });
    } else {
      alert('No images found! Please add images to the public/images folder.');
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