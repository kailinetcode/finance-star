import { useState, useEffect } from 'react';
import { getFinancialReading } from '../data/financialHouses';
import { InvestmentTool, DebtTool, SavingsTool } from './FinancialTools';

function formatDate(date) {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
}

export default function FinanceView({ signName, onReset }) {
  const today = new Date();
  const staticReading = getFinancialReading(signName, today);
  const [reading, setReading] = useState(staticReading);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}daily-readings.json`)
      .then(r => r.json())
      .then(data => {
        const r = data?.readings?.[signName];
        if (!r) return;
        setReading(prev => ({ ...prev, ...r }));
      })
      .catch(() => {});
  }, [signName]);

  const { sign, market, daily, house2, house8, house11, spending, saving, investing, debt, income, mindset, goodFor, badFor } = reading;

  return (
    <div className="reading-view">
      <button className="back-btn" onClick={onReset}>← All Signs</button>

      {/* Header */}
      <header className="reading-header">
        <p className="reading-date">{formatDate(today)}</p>
        {sign.image
          ? <img
              src={`${import.meta.env.BASE_URL}signs/${sign.name.toLowerCase()}.png`}
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

      {/* Daily */}
      <section className="daily-section">
        <p className="daily-headline">{daily}</p>
      </section>

      <hr className="divider" />

      {/* Market */}
      <section className="moon-row">
        <span className="inline-symbol">{market.symbol}</span>
        <div>
          <p className="row-label">{market.name.toUpperCase()}</p>
          <p className="row-text">{market.influence}</p>
        </div>
      </section>

      <hr className="divider" />

      {/* ── Spending ── */}
      <section className="themed-block">
        <p className="block-eyebrow">Spending</p>
        <div className="houses-block">
          <div className="house-row">
            <p className="row-label">{house2.label.toUpperCase()}</p>
            <p className="row-text">{house2.text}</p>
          </div>
        </div>
        <section className="category-section">
          <p className="category-symbol">♀</p>
          <p className="category-label">SPENDING</p>
          <p className="category-text">{spending}</p>
        </section>
        <section className="category-section">
          <p className="category-symbol">☉</p>
          <p className="category-label">INCOME & EARNING</p>
          <p className="category-text">{income}</p>
        </section>
      </section>

      <hr className="divider" />

      {/* ── Debt ── */}
      <section className="themed-block">
        <p className="block-eyebrow">Debt</p>
        <div className="houses-block">
          <div className="house-row">
            <p className="row-label">{house8.label.toUpperCase()}</p>
            <p className="row-text">{house8.text}</p>
          </div>
        </div>
        <section className="category-section">
          <p className="category-symbol">♏</p>
          <p className="category-label">DEBT & OBLIGATION</p>
          <p className="category-text">{debt}</p>
        </section>
        <DebtTool />
      </section>

      <hr className="divider" />

      {/* ── Savings & Investing ── */}
      <section className="themed-block">
        <p className="block-eyebrow">Savings & Investing</p>
        <div className="houses-block">
          <div className="house-row">
            <p className="row-label">{house11.label.toUpperCase()}</p>
            <p className="row-text">{house11.text}</p>
          </div>
        </div>
        <section className="category-section">
          <p className="category-symbol">♄</p>
          <p className="category-label">SAVING</p>
          <p className="category-text">{saving}</p>
        </section>
        <section className="category-section">
          <p className="category-symbol">♃</p>
          <p className="category-label">INVESTING</p>
          <p className="category-text">{investing}</p>
        </section>
        <SavingsTool />
        <InvestmentTool />
      </section>

      <hr className="divider" />

      {/* ── Mindset ── */}
      <section className="category-section">
        <p className="category-symbol">♆</p>
        <p className="category-label">MONEY MINDSET</p>
        <p className="category-text">{mindset}</p>
      </section>

      <hr className="divider" />

      {/* Good / Bad */}
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
