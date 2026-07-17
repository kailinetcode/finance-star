import { useState } from 'react';

// ── Investment growth ─────────────────────────────────────────────────────────
function InvestmentTool() {
  const [current, setCurrent] = useState('');
  const [monthly, setMonthly] = useState('');
  const [years, setYears] = useState('');

  function project() {
    const pv = parseFloat(current) || 0;
    const pmt = parseFloat(monthly) || 0;
    const n = (parseFloat(years) || 0) * 12;
    if (n === 0 || (pv === 0 && pmt === 0)) return null;
    const r = 0.07 / 12;
    const fv = pv * Math.pow(1 + r, n) + pmt * ((Math.pow(1 + r, n) - 1) / r);
    const contributed = pv + pmt * n;
    const growth = fv - contributed;
    return { fv, contributed, growth };
  }

  const result = project();

  return (
    <section className="tool-section">
      <p className="tool-symbol">♃</p>
      <p className="tool-label">INVESTMENT GROWTH</p>
      <p className="tool-subtext">At 7% average annual return.</p>
      <div className="tool-inputs">
        <label className="tool-field">
          <span className="field-label">Current balance</span>
          <div className="field-row">
            <span className="field-prefix">$</span>
            <input type="number" placeholder="0" value={current} onChange={e => setCurrent(e.target.value)} />
          </div>
        </label>
        <label className="tool-field">
          <span className="field-label">Monthly contribution</span>
          <div className="field-row">
            <span className="field-prefix">$</span>
            <input type="number" placeholder="0" value={monthly} onChange={e => setMonthly(e.target.value)} />
          </div>
        </label>
        <label className="tool-field">
          <span className="field-label">Time horizon</span>
          <div className="field-row">
            <input type="number" placeholder="0" value={years} onChange={e => setYears(e.target.value)} />
            <span className="field-suffix">years</span>
          </div>
        </label>
      </div>
      {result && (
        <div className="tool-result">
          <div className="result-row">
            <span className="result-label">Projected value</span>
            <span className="result-value">{fmt(result.fv)}</span>
          </div>
          <div className="result-row">
            <span className="result-label">You contributed</span>
            <span className="result-value muted">{fmt(result.contributed)}</span>
          </div>
          <div className="result-row">
            <span className="result-label">Market growth</span>
            <span className="result-value accent">{fmt(result.growth)}</span>
          </div>
        </div>
      )}
    </section>
  );
}

// ── Debt payoff ───────────────────────────────────────────────────────────────
function DebtTool() {
  const [balance, setBalance] = useState('');
  const [rate, setRate] = useState('');
  const [payment, setPayment] = useState('');
  const [extra, setExtra] = useState('');

  function calculate(pmt) {
    const b = parseFloat(balance) || 0;
    const r = (parseFloat(rate) || 0) / 100 / 12;
    if (b === 0 || pmt <= 0) return null;
    if (r === 0) {
      const months = Math.ceil(b / pmt);
      return { months, totalPaid: pmt * months, interest: 0 };
    }
    if (pmt <= b * r) return null; // payment too low to ever pay off
    const months = Math.ceil(-Math.log(1 - (r * b) / pmt) / Math.log(1 + r));
    const totalPaid = pmt * months;
    const interest = totalPaid - b;
    return { months, totalPaid, interest };
  }

  const base = calculate(parseFloat(payment) || 0);
  const boosted = (parseFloat(extra) || 0) > 0
    ? calculate((parseFloat(payment) || 0) + (parseFloat(extra) || 0))
    : null;

  return (
    <section className="tool-section">
      <p className="tool-symbol">♏</p>
      <p className="tool-label">DEBT PAYOFF</p>
      <p className="tool-subtext">See your payoff date. Then see what happens if you add more.</p>
      <div className="tool-inputs">
        <label className="tool-field">
          <span className="field-label">Balance owed</span>
          <div className="field-row">
            <span className="field-prefix">$</span>
            <input type="number" placeholder="0" value={balance} onChange={e => setBalance(e.target.value)} />
          </div>
        </label>
        <label className="tool-field">
          <span className="field-label">Interest rate (APR)</span>
          <div className="field-row">
            <input type="number" placeholder="0" value={rate} onChange={e => setRate(e.target.value)} />
            <span className="field-suffix">%</span>
          </div>
        </label>
        <label className="tool-field">
          <span className="field-label">Monthly payment</span>
          <div className="field-row">
            <span className="field-prefix">$</span>
            <input type="number" placeholder="0" value={payment} onChange={e => setPayment(e.target.value)} />
          </div>
        </label>
        <label className="tool-field">
          <span className="field-label">Extra each month (optional)</span>
          <div className="field-row">
            <span className="field-prefix">+$</span>
            <input type="number" placeholder="0" value={extra} onChange={e => setExtra(e.target.value)} />
          </div>
        </label>
      </div>
      {base && (
        <div className="tool-result">
          <div className="result-row">
            <span className="result-label">Debt-free in</span>
            <span className="result-value">{fmtMonths(base.months)}</span>
          </div>
          <div className="result-row">
            <span className="result-label">Total interest paid</span>
            <span className="result-value muted">{fmt(base.interest)}</span>
          </div>
          {boosted && (
            <>
              <div className="result-divider" />
              <div className="result-row">
                <span className="result-label">With extra payment</span>
                <span className="result-value accent">{fmtMonths(boosted.months)}</span>
              </div>
              <div className="result-row">
                <span className="result-label">Interest saved</span>
                <span className="result-value accent">{fmt(base.interest - boosted.interest)}</span>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}

// ── Savings milestone ─────────────────────────────────────────────────────────
const MILESTONES = ['House down payment', 'Emergency fund', 'Retirement', 'Wedding', 'Travel', 'Custom'];

function SavingsTool() {
  const [milestone, setMilestone] = useState('');
  const [goal, setGoal] = useState('');
  const [saved, setSaved] = useState('');
  const [monthly, setMonthly] = useState('');

  function calculate() {
    const g = parseFloat(goal) || 0;
    const s = parseFloat(saved) || 0;
    const pmt = parseFloat(monthly) || 0;
    if (g === 0 || pmt === 0) return null;
    const remaining = g - s;
    if (remaining <= 0) return { months: 0, remaining: 0 };
    // HYSA at ~4.5%
    const r = 0.045 / 12;
    const months = Math.ceil(Math.log(1 + (remaining * r) / pmt) / Math.log(1 + r));
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + months);
    return {
      months,
      remaining,
      targetDate: targetDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      percent: Math.min(100, Math.round((s / g) * 100)),
    };
  }

  const result = calculate();

  return (
    <section className="tool-section">
      <p className="tool-symbol">♄</p>
      <p className="tool-label">SAVINGS MILESTONE</p>
      <p className="tool-subtext">At 4.5% HYSA. Name your target.</p>
      <div className="tool-inputs">
        <label className="tool-field">
          <span className="field-label">Milestone</span>
          <div className="field-row field-row--select">
            <select value={milestone} onChange={e => setMilestone(e.target.value)}>
              <option value="">Select one</option>
              {MILESTONES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </label>
        <label className="tool-field">
          <span className="field-label">Goal amount</span>
          <div className="field-row">
            <span className="field-prefix">$</span>
            <input type="number" placeholder="0" value={goal} onChange={e => setGoal(e.target.value)} />
          </div>
        </label>
        <label className="tool-field">
          <span className="field-label">Already saved</span>
          <div className="field-row">
            <span className="field-prefix">$</span>
            <input type="number" placeholder="0" value={saved} onChange={e => setSaved(e.target.value)} />
          </div>
        </label>
        <label className="tool-field">
          <span className="field-label">Monthly savings</span>
          <div className="field-row">
            <span className="field-prefix">$</span>
            <input type="number" placeholder="0" value={monthly} onChange={e => setMonthly(e.target.value)} />
          </div>
        </label>
      </div>
      {result && (
        <div className="tool-result">
          {result.months === 0 ? (
            <div className="result-row">
              <span className="result-value accent">You've reached your goal.</span>
            </div>
          ) : (
            <>
              {result.percent > 0 && (
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${result.percent}%` }} />
                  <span className="progress-label">{result.percent}% there</span>
                </div>
              )}
              <div className="result-row">
                <span className="result-label">Reach goal by</span>
                <span className="result-value">{result.targetDate}</span>
              </div>
              <div className="result-row">
                <span className="result-label">Time remaining</span>
                <span className="result-value muted">{fmtMonths(result.months)}</span>
              </div>
              <div className="result-row">
                <span className="result-label">Still needed</span>
                <span className="result-value muted">{fmt(result.remaining)}</span>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

function fmtMonths(m) {
  if (m < 12) return `${m} month${m !== 1 ? 's' : ''}`;
  const y = Math.floor(m / 12);
  const mo = m % 12;
  return mo === 0 ? `${y} year${y !== 1 ? 's' : ''}` : `${y}y ${mo}mo`;
}

export default function FinancialTools() {
  return (
    <div className="financial-tools">
      <hr className="divider" />
      <div className="tools-header">
        <p className="tools-title">YOUR NUMBERS</p>
        <p className="tools-subtitle">Enter your figures. The math doesn't lie.</p>
      </div>
      <InvestmentTool />
      <hr className="divider" />
      <DebtTool />
      <hr className="divider" />
      <SavingsTool />
    </div>
  );
}
