import { useState } from 'react';
import SignPicker from './components/SignPicker';
import FinanceView from './components/FinanceView';
import './App.css';

export default function App() {
  const [sign, setSign] = useState(null);

  return (
    <div className="app">
      <nav className="app-nav">
        <span className="nav-dot" />
        <span className="app-name">Finance — Star</span>
      </nav>
      {sign
        ? <FinanceView signName={sign} onReset={() => setSign(null)} />
        : <SignPicker onSelect={setSign} />
      }
    </div>
  );
}
