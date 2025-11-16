export default function ProgressReport({ report }) {
  return (
    <section className="card">
      <h2>Your Progress</h2>
      <div style={{lineHeight:2}}>
        <div>Easy: {report.Easy}%</div>
        <div>Medium: {report.Medium}%</div>
        <div>Hard: {report.Hard}%</div>
      </div>
    </section>
  );
}
