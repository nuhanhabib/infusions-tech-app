export default function Progress({ value = 0, label = true }) {
  const v = Math.max(0, Math.min(100, value || 0));
  return (
    <div className="pt-progress-wrap">
      <div className="pt-progress" role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}>
        <span style={{ width: `${v}%` }} />
      </div>
      {label && <b>{v}%</b>}
    </div>
  );
}
