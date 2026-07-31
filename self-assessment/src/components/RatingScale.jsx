import { RATING_LABELS } from '../data/criteria';

export default function RatingScale({ value, onChange }) {
  return (
    <div className="rating-scale">
      <div className="rating-segmented" role="group" aria-label="اختر التقييم من 1 إلى 5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`rating-segment ${value === n ? 'selected' : ''}`}
            onClick={() => onChange(n)}
            aria-pressed={value === n}
            aria-label={`${n} — ${RATING_LABELS[n].label}`}
          >
            <span className="rating-segment-num">{n}</span>
            <span className="rating-segment-label">{RATING_LABELS[n].label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
