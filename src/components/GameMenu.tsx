import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGame } from '@/contexts/GameContext';
import { categories, gameImages } from '@/data/gameImages';
import { Play, Trophy, Settings } from 'lucide-react';

export function GameMenu() {
  const { state, dispatch } = useGame();
  const [selectedCategory, setSelectedCategory] = useState('animals');

  const handleStartGame = () => {
    const categoryImages = gameImages[selectedCategory];
    if (categoryImages && categoryImages.length > 0) {
      const randomImage = categoryImages[Math.floor(Math.random() * categoryImages.length)];
      dispatch({ 
        type: 'START_GAME', 
        payload: { image: randomImage, category: selectedCategory } 
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

        {/* Category Selection */}
        <Card className="game-card p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Choose a Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "game" : "outline"}
                size="lg"
                onClick={() => setSelectedCategory(category.id)}
                className="h-20 flex-col gap-2"
              >
                <span className="text-3xl">{category.icon}</span>
                <span>{category.name}</span>
              </Button>
            ))}
          </div>
        </Card>

        {/* Game Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="game"
            size="lg"
            onClick={handleStartGame}
            className="h-16 text-lg"
          >
            <Play className="w-6 h-6" />
            Start Game
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="h-16 text-lg"
          >
            <Trophy className="w-6 h-6" />
            Leaderboard
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="h-16 text-lg"
          >
            <Settings className="w-6 h-6" />
            Settings
          </Button>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <Card className="game-card p-4 text-center">
            <h3 className="text-sm text-muted-foreground mb-2">Best Score</h3>
            <p className="text-2xl font-bold text-primary">847</p>
          </Card>
          <Card className="game-card p-4 text-center">
            <h3 className="text-sm text-muted-foreground mb-2">Games Played</h3>
            <p className="text-2xl font-bold text-secondary">23</p>
          </Card>
          <Card className="game-card p-4 text-center">
            <h3 className="text-sm text-muted-foreground mb-2">Win Rate</h3>
            <p className="text-2xl font-bold text-accent">78%</p>
          </Card>
        </div>
      </div>
    </div>
  );
}