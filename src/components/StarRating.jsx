export default function StarRating({ value, onChange, readonly = false }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`text-xl ${star <= value ? 'text-yellow-400' : 'text-slate-300'} ${readonly ? 'cursor-default' : 'hover:scale-110'}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
