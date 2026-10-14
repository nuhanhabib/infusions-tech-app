export default function Stars({ value = 0 }) {
  return (
    <span className="pt-stars" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= value ? "on" : ""}>
          ★
        </span>
      ))}
    </span>
  );
}
