import { useGameStore } from './store/gameStore';
import { CharacterSelectScreen } from './components/screens/CharacterSelectScreen';
import { MapScreen } from './components/screens/MapScreen';
import { BattleScreen } from './components/battle/BattleScreen';
import { BattleRewardScreen } from './components/screens/BattleRewardScreen';
import { RestScreen } from './components/screens/RestScreen';
import { EventScreen } from './components/screens/EventScreen';
import { ShopScreen } from './components/screens/ShopScreen';
import { GameOverScreen } from './components/screens/GameOverScreen';
import { VictoryScreen } from './components/screens/VictoryScreen';

function App() {
  const screen = useGameStore(s => s.screen);

  switch (screen) {
    case 'CHARACTER_SELECT':
      return <CharacterSelectScreen />;
    case 'MAP':
      return <MapScreen />;
    case 'BATTLE':
      return <BattleScreen />;
    case 'BATTLE_REWARD':
      return <BattleRewardScreen />;
    case 'REST':
      return <RestScreen />;
    case 'EVENT':
      return <EventScreen />;
    case 'SHOP':
      return <ShopScreen />;
    case 'GAME_OVER':
      return <GameOverScreen />;
    case 'VICTORY':
      return <VictoryScreen />;
    default:
      return <CharacterSelectScreen />;
  }
}

export default App;
