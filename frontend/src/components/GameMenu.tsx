import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { loadImagesFromFolder } from '@/data/gameImages';
import { PixelImage } from '@/contexts/GameContext';
import { Play } from 'lucide-react';
import { useState, useEffect } from 'react';

export function GameMenu() {
  const { dispatch } = useGame();
  const [availableImages, setAvailableImages] = useState<PixelImage[]>([]);

  useEffect(() => {
    // Load available images from public/images folder
    const loadImages = async () => {
      try {
        const imagesByCategory = await loadImagesFromFolder();
        const allImages = Object.values(imagesByCategory).flat();
        console.log('Loaded images:', allImages); // Debug log
        setAvailableImages(allImages);
      } catch (error) {
        console.error('Error loading images:', error);
        setAvailableImages([]);
      }
    };
    
    loadImages();
  }, []);

  const handleStartGame = () => {
    if (availableImages.length > 0) {
      const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)];
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
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-6xl font-bold glow-text mb-4 bg-gradient-primary bg-clip-text text-transparent">
            PixelGuess
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground px-4">
            Guess the image as it reveals pixel by pixel!
          </p>
        </div>

        {/* Game Actions */}
        <div className="flex justify-center">
          <Button
            variant="game"
            size="lg"
            onClick={handleStartGame}
            className="h-12 md:h-16 text-base md:text-lg px-6 md:px-8"
            disabled={availableImages.length === 0}
          >
            <Play className="w-5 h-5 md:w-6 md:h-6" />
            {availableImages.length > 0 ? 'Start Game' : 'Loading Images...'}
          </Button>
        </div>
      </div>
    </div>
  );
}