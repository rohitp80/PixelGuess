import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { PixelCanvas } from './PixelCanvas';
import { GuessInput } from './GuessInput';
import { ArrowLeft, Clock, Target, Lightbulb } from 'lucide-react';

export function GameInterface() {
  const { state, dispatch } = useGame();
  const { currentImage, gameStatus, score, hintsUsed, timeElapsed } = state;

  // Timer effect
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const timer = setInterval(() => {
      dispatch({ type: 'UPDATE_TIME', payload: timeElapsed + 10 });
    }, 10);

    return () => clearInterval(timer);
  }, [gameStatus, timeElapsed, dispatch]);

  // Game timeout
  useEffect(() => {
    if (timeElapsed >= 120000 && gameStatus === 'playing') { // 2 minutes timeout (120000ms)
      dispatch({ type: 'COMPLETE_GAME', payload: { success: false } });
    }
  }, [timeElapsed, gameStatus, dispatch]);

  const handleBackToMenu = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const ms = Math.floor((milliseconds % 1000) / 10);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  if (!currentImage) {
    return null;
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={handleBackToMenu}>
            <ArrowLeft className="w-4 h-4" />
            Back to Menu
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold glow-text">PixelGuess</h1>
            <p className="text-sm text-muted-foreground capitalize">
              Category: {currentImage.category}
            </p>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Difficulty</p>
            <p className="font-medium capitalize">{currentImage.difficulty}</p>
          </div>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="game-card p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Score</span>
            </div>
            <p className="text-2xl font-bold text-primary">{score}</p>
          </Card>
          
          <Card className="game-card p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-secondary" />
              <span className="text-sm text-muted-foreground">Time</span>
            </div>
            <p className="text-2xl font-bold text-secondary">{formatTime(timeElapsed)}</p>
          </Card>
          
          <Card className="game-card p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-accent" />
              <span className="text-sm text-muted-foreground">Hints</span>
            </div>
            <p className="text-2xl font-bold text-accent">{hintsUsed}/3</p>
          </Card>
          
          <Card className="game-card p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-sm text-muted-foreground">Progress</span>
            </div>
            <p className="text-2xl font-bold">{Math.round(state.revealProgress)}%</p>
          </Card>
        </div>

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Canvas */}
          <div className="flex justify-center">
            <Card className="game-card p-6">
              <PixelCanvas size={400} />
            </Card>
          </div>
          
          {/* Guess Input */}
          <div className="space-y-4">
            <GuessInput />
            
            {/* Game Tips */}
            <Card className="game-card p-4">
              <h4 className="font-medium mb-3">Game Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Watch the pixels reveal gradually</li>
                <li>• Use hints wisely (they reduce your score)</li>
                <li>• Faster guesses earn more points</li>
                <li>• Pay attention to the category</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}