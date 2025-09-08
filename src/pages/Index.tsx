import { GameProvider, useGame } from '@/contexts/GameContext';
import { GameMenu } from '@/components/GameMenu';
import { GameInterface } from '@/components/GameInterface';

function GameApp() {
  const { state } = useGame();
  
  return (
    <>
      {state.gameStatus === 'menu' ? <GameMenu /> : <GameInterface />}
    </>
  );
}

const Index = () => {
  return (
    <GameProvider>
      <GameApp />
    </GameProvider>
  );
};

export default Index;
