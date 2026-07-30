import { RATING_LABELS } from '../data/criteria';

export default function RatingScale({ value, onChange }) {
  return (
    <div className="rating-scale">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`rating-btn ${value === n ? 'selected' : ''}`}
          onClick={() => onChange(n)}
          aria-pressed={value === n}
        >
          <span className="rating-num">{n}</span>
          <span className="rating-label">{RATING_LABELS[n].label}</span>
        </button>
      ))}
    </div>
  );
}
