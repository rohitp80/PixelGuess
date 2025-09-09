import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useGame } from '@/contexts/GameContext';
import { Send, Lightbulb, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export function GuessInput() {
  const { state, dispatch } = useGame();
  const [currentGuess, setCurrentGuess] = useState('');
  
  const { currentImage, guesses, hintsUsed, gameStatus } = state;

  const handleSubmitGuess = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentGuess.trim() || !currentImage) return;

    const guess = currentGuess.trim().toLowerCase();
    const correctAnswer = currentImage.name.toLowerCase();
    
    if (guess === correctAnswer) {
      dispatch({ type: 'COMPLETE_GAME', payload: { success: true } });
      toast.success('Correct! Well done!');
    } else {
      dispatch({ type: 'SUBMIT_GUESS', payload: currentGuess.trim() });
      toast.error('Not quite right, try again!');
    }
    
    setCurrentGuess('');
  };

  const handleUseHint = () => {
    if (!currentImage || hintsUsed >= 3) return;
    
    dispatch({ type: 'USE_HINT' });
    
    const hints = [
      `Category: ${currentImage.category}`,
      `First letter: ${currentImage.name[0].toUpperCase()}`,
      `Length: ${currentImage.name.length} letters`
    ];
    
    const hintIndex = Math.min(hintsUsed, hints.length - 1);
    toast.info(hints[hintIndex]);
  };

  const handleResetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  if (gameStatus !== 'playing') {
    return (
      <Card className="game-card p-6 text-center">
        <div className="space-y-4">
          {gameStatus === 'completed' && (
            <>
              <h3 className="text-2xl font-bold text-game-success">Game Complete!</h3>
              <p className="text-lg">Final Score: <span className="font-bold text-primary">{state.score}</span></p>
              <p className="text-muted-foreground">Time: {Math.floor(state.timeElapsed / 1000)}s | Hints: {hintsUsed}</p>
            </>
          )}
          
          {gameStatus === 'failed' && (
            <>
              <h3 className="text-2xl font-bold text-game-error">Time's Up!</h3>
              <p className="text-lg">The answer was: <span className="font-bold text-primary">{currentImage?.name}</span></p>
            </>
          )}
          
          <Button variant="game" onClick={handleResetGame} className="w-full">
            <RotateCcw className="w-4 h-4" />
            Play Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Guess Input */}
      <Card className="game-card p-6">
        <h3 className="text-lg font-semibold mb-4">What do you think it is?</h3>
        
        <form onSubmit={handleSubmitGuess} className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={currentGuess}
              onChange={(e) => setCurrentGuess(e.target.value)}
              placeholder="Enter your guess..."
              className="flex-1"
              disabled={gameStatus !== 'playing'}
            />
            <Button 
              type="submit" 
              variant="game"
              disabled={!currentGuess.trim() || gameStatus !== 'playing'}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleUseHint}
              disabled={hintsUsed >= 3}
              className="flex-1"
            >
              <Lightbulb className="w-4 h-4" />
              Hint ({hintsUsed}/3)
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleResetGame}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </Card>

      {/* Previous Guesses */}
      {guesses.length > 0 && (
        <Card className="game-card p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Previous Guesses</h4>
          <div className="space-y-2">
            {guesses.slice(-5).map((guess, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 text-sm p-2 bg-muted rounded"
              >
                <span className="text-game-error">✗</span>
                <span>{guess}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}