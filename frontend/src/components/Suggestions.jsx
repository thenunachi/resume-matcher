const icons = {
  critical: '🚨',
  warning: '⚠️',
  info: '💡',
  success: '✅',
};

const colors = {
  critical: '#fef2f2',
  warning: '#fffbeb',
  info: '#eff6ff',
  success: '#f0fdf4',
};

const borders = {
  critical: '#fca5a5',
  warning: '#fcd34d',
  info: '#93c5fd',
  success: '#86efac',
};

export default function Suggestions({ suggestions }) {
  return (
    <div className="suggestions">
      <h3 className="section-title">Suggestions</h3>
      <div className="suggestion-list">
        {suggestions.map((s, i) => (
          <div
            key={i}
            className="suggestion-card"
            style={{ background: colors[s.type], borderLeft: `4px solid ${borders[s.type]}` }}
          >
            <p className="suggestion-title">{icons[s.type]} {s.title}</p>
            <p className="suggestion-body">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
