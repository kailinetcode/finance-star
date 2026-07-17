import { SIGNS } from '../data/financialHouses';

const RADIUS = 162;
const SIZE = 400;
const CENTER = SIZE / 2;

const ARC = 'M 5,31 A 26,26 0 0,1 57,31';

export default function SignPicker({ onSelect }) {
  return (
    <div className="sign-picker">
      <p className="picker-subtitle">select your sun sign</p>
      <div className="wheel-container" style={{ width: SIZE, height: SIZE }}>
        <div className="wheel-ring" />

        {SIGNS.map((sign, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x = CENTER + RADIUS * Math.cos(angle);
          const y = CENTER + RADIUS * Math.sin(angle);
          const arcId = `arc-f-${i}`;
          return (
            <button
              key={sign.name}
              className="wheel-sign"
              style={{ left: x, top: y }}
              onClick={() => onSelect(sign.name)}
            >
              <div className="wheel-badge">
                <div className="wheel-img-wrap">
                  {sign.image
                    ? <img
                        src={sign.image}
                        alt={sign.name}
                        className="wheel-img"
                        style={{ objectPosition: sign.imgPos }}
                      />
                    : <span className="wheel-symbol">{sign.symbol}</span>
                  }
                </div>
                <svg className="wheel-text-svg" viewBox="0 0 62 62">
                  <defs>
                    <path id={arcId} d={ARC} />
                  </defs>
                  <text className="wheel-text-arc">
                    <textPath href={`#${arcId}`} startOffset="50%" textAnchor="middle">
                      {sign.name.toUpperCase()}
                    </textPath>
                  </text>
                </svg>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
