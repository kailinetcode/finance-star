import { useState, useEffect } from 'react';
import { getFinancialReading } from '../data/financialHouses';
import FinancialTools from './FinancialTools';

const CATEGORIES = [
  { key: 'spending', label: 'Spending', symbol: '♀' },
  { key: 'saving', label: 'Saving', symbol: '♄' },
  { key: 'investing', label: 'Investing', symbol: '♃' },
  { key: 'debt', label: 'Debt & Obligation', symbol: '♏' },
  { key: 'income', label: 'Income & Earning', symbol: '☉' },
  { key: 'mindset', label: 'Money Mindset', symbol: '♆' },
];

function formatDate(date) {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
}

export default function FinanceView({ signName, onReset }) {
  const today = new Date();
  const staticReading = getFinancialReading(signName, today);
  const [reading, setReading] = useState(staticReading);

  useEffect(() => {
    fetch('/daily-readings.json')
      .then(r => r.json())
      .then(data => {
        const r = data?.readings?.[signName];
        if (!r) return;
        setReading(prev => ({ ...prev, ...r }));
      })
      .catch(() => {});
  }, [signName]);

  const { sign, market, daily, house2, house8, house11, goodFor, badFor, ...sections } = reading;

  return (
    <div className="reading-view">
      <button className="back-btn" onClick={onReset}>← All Signs</button>

      <header className="reading-header">
        <p className="reading-date">{formatDate(today)}</p>
        {sign.image
          ? <img
              src={sign.image}
              alt={sign.name}
              className="sign-hero-img"
              style={{ objectPosition: sign.imgPos }}
            />
          : <div className="sign-symbol-lg">{sign.symbol}</div>
        }
        <h1 className="reading-sign">{sign.name}</h1>
        <p className="reading-meta">{sign.element.toUpperCase()} · {sign.ruling.toUpperCase()} · {sign.dates.toUpperCase()}</p>
      </header>

      <hr className="divider" />

      <section className="daily-section">
        <p className="daily-headline">{daily}</p>
      </section>

      <hr className="divider" />

      <section className="moon-row">
        <span className="inline-symbol">{market.symbol}</span>
        <div>
          <p className="row-label">{market.name.toUpperCase()}</p>
          <p className="row-text">{market.influence}</p>
        </div>
      </section>

      <hr className="divider" />

      <section className="houses-block">
        {[house2, house8, house11].map(house => (
          <div key={house.label} className="house-row">
            <p className="row-label">{house.label.toUpperCase()}</p>
            <p className="row-text">{house.text}</p>
          </div>
        ))}
      </section>

      <hr className="divider" />

      {CATEGORIES.map(({ key, label, symbol }) => (
        <section key={key} className="category-section">
          <p className="category-symbol">{symbol}</p>
          <p className="category-label">{label.toUpperCase()}</p>
          <p className="category-text">{sections[key]}</p>
          <hr className="divider" />
        </section>
      ))}

      <FinancialTools />

      <section className="learn-avoid">
        <div className="la-col">
          <p className="la-label">Good day for</p>
          {goodFor.map(g => <p key={g} className="la-item">{g}</p>)}
        </div>
        <div className="la-col">
          <p className="la-label">Bad day for</p>
          {badFor.map(b => <p key={b} className="la-item">{b}</p>)}
        </div>
      </section>
    </div>
  );
}
