export default function ResponseMetrics({ metrics }) {
  const items = [["List API", metrics.list], ["Upload API", metrics.upload], ["Download API", metrics.download]];
  return (
    <section className="metrics">
      <h2>Response Time - MS</h2>
      <div className="metric-grid">
        {items.map(([name, value]) => (
          <div className="metric" key={name}>
            <span>{name}</span>
            <strong>{value == null ? "--" : `${value.toFixed(2)} ms`}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}