import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGame } from '@/contexts/GameContext';
import { gameImages } from '@/data/gameImages';
import { Play, Trophy, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function GameMenu() {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
            onClick={() => navigate('/leaderboard')}
          >
            <Trophy className="w-6 h-6" />
            Leaderboard today
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
        <div className="grid grid-cols-3 gap-4">
          <Card className="game-card p-4 text-center">
            <h3 className="text-sm text-muted-foreground mb-2">Best Score</h3>
            <p className="text-2xl font-bold text-primary">{state.bestScore}</p>
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