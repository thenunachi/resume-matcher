export default function KeywordCloud({ matched, missing }) {
  return (
    <div className="keyword-cloud">
      <div className="kw-section">
        <h4 className="kw-title matched-title">Found in your resume</h4>
        <div className="kw-tags">
          {matched.map(kw => (
            <span key={kw} className="kw-tag matched">{kw}</span>
          ))}
          {matched.length === 0 && <span className="kw-empty">None matched</span>}
        </div>
      </div>
      <div className="kw-section">
        <h4 className="kw-title missing-title">Missing from your resume</h4>
        <div className="kw-tags">
          {missing.map(kw => (
            <span key={kw} className="kw-tag missing">{kw}</span>
          ))}
          {missing.length === 0 && <span className="kw-empty">All covered!</span>}
        </div>
      </div>
    </div>
  );
}
