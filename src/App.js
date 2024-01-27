import logo from './logo.svg';
import './App.css';
import Wordle from './wordle';

function App() {
  return (
    <div>
      <Wordle wordLength={5} maxGuesses={6} />
    </div>
  );
}

export default App;
