import { useState } from 'react';
import { analyzeResume } from './analyzer';
import ScoreRing from './components/ScoreRing';
import KeywordCloud from './components/KeywordCloud';
import Suggestions from './components/Suggestions';
import FileUpload from './components/FileUpload';
import './App.css';

export default function App() {
  const [resume, setResume] = useState('');
  const [jd, setJd] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleAnalyze() {
    if (!resume.trim() || !jd.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setResult(analyzeResume(resume, jd));
      setLoading(false);
    }, 600);
  }

  function handleClear() {
    setResume('');
    setJd('');
    setResult(null);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div>
            <h1 className="app-title">Resume Matcher</h1>
            <p className="app-sub">Paste your resume and job description — instantly see how well you match.</p>
          </div>
          {result && (
            <button className="btn btn-outline" onClick={handlePrint}>
              Export PDF
            </button>
          )}
        </div>
      </header>

      <main className="main">
        <div className="input-grid">
          <div className="panel">
            <label className="panel-label">Your Resume</label>
            <FileUpload onParsed={setResume} />
            {resume && (
              <textarea
                className="textarea textarea-preview"
                value={resume}
                onChange={e => setResume(e.target.value)}
                placeholder="Extracted text will appear here. You can edit it."
              />
            )}
            {resume && <p className="char-count">{resume.length} chars extracted</p>}
          </div>
          <div className="panel">
            <label className="panel-label">Job Description</label>
            <textarea
              className="textarea"
              placeholder="Paste the job description here..."
              value={jd}
              onChange={e => setJd(e.target.value)}
            />
            <p className="char-count">{jd.length} chars</p>
          </div>
        </div>

        <div className="action-row">
          <button
            className="btn btn-primary"
            onClick={handleAnalyze}
            disabled={!resume.trim() || !jd.trim() || loading}
          >
            {loading ? 'Analyzing...' : 'Analyze Match'}
          </button>
          {result && (
            <button className="btn btn-ghost" onClick={handleClear}>
              Clear
            </button>
          )}
        </div>

        {result && (
          <div className="results" id="results">
            <div className="results-top">
              <ScoreRing score={result.overallScore} />
              <div className="score-breakdown">
                <h3 className="section-title">Score Breakdown</h3>
                <div className="breakdown-bars">
                  <BarRow label="Keyword Match" value={result.keywordScore} />
                  <BarRow label="Phrase Match" value={result.phraseScore} />
                </div>
                <p className="breakdown-note">
                  Analyzed <strong>{result.totalJdKeywords}</strong> keywords from the job description.
                </p>
              </div>
            </div>

            <KeywordCloud matched={result.matched} missing={result.missing} />

            {(result.matchedPhrases.length > 0 || result.missingPhrases.length > 0) && (
              <div className="phrases-section">
                <h3 className="section-title">Key Phrases</h3>
                <div className="phrase-rows">
                  {result.matchedPhrases.map(p => (
                    <span key={p} className="kw-tag matched">{p}</span>
                  ))}
                  {result.missingPhrases.map(p => (
                    <span key={p} className="kw-tag missing">{p}</span>
                  ))}
                </div>
              </div>
            )}

            <Suggestions suggestions={result.suggestions} />
          </div>
        )}
      </main>
    </div>
  );
}

function BarRow({ label, value }) {
  const color = value >= 70 ? '#22c55e' : value >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <div className="bar-row">
      <div className="bar-label-row">
        <span className="bar-label">{label}</span>
        <span className="bar-value" style={{ color }}>{value}%</span>
      </div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}
