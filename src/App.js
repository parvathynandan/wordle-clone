import logo from './logo.svg';
import './App.css';
import Wordle from './wordle';
import ScrollDialog from './GameRuleDialog';

function App() {
  return (
    <div>
      <Wordle wordLength={5} maxGuesses={6} />
      {/* <ScrollDialog/> */}
    </div>
  );
}

export default App;
