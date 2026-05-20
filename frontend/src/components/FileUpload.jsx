import { useRef, useState } from 'react';
import { parseResumeFile } from '../fileParser';

export default function FileUpload({ onParsed }) {
  const inputRef = useRef();
  const [status, setStatus] = useState(null); // null | 'loading' | 'done' | 'error'
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);

  async function handleFile(file) {
    if (!file) return;
    setStatus('loading');
    setError('');
    setFileName(file.name);
    try {
      const text = await parseResumeFile(file);
      if (!text.trim()) throw new Error('No text could be extracted from this file.');
      onParsed(text);
      setStatus('done');
    } catch (e) {
      setError(e.message);
      setStatus('error');
    }
  }

  function onInputChange(e) {
    handleFile(e.target.files[0]);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }

  function onDragOver(e) {
    e.preventDefault();
    setDragging(true);
  }

  function onDragLeave() {
    setDragging(false);
  }

  function handleRemove() {
    setStatus(null);
    setFileName('');
    setError('');
    onParsed('');
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className="file-upload-wrap">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        style={{ display: 'none' }}
        onChange={onInputChange}
      />

      {status === 'done' ? (
        <div className="file-done">
          <div className="file-done-info">
            <span className="file-icon">📄</span>
            <span className="file-name">{fileName}</span>
            <span className="file-ok">Parsed successfully</span>
          </div>
          <button className="file-remove-btn" onClick={handleRemove}>✕ Remove</button>
        </div>
      ) : (
        <div
          className={`drop-zone ${dragging ? 'dragging' : ''} ${status === 'error' ? 'drop-error' : ''}`}
          onClick={() => inputRef.current.click()}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        >
          {status === 'loading' ? (
            <div className="drop-loading">
              <span className="spinner" />
              <span>Parsing {fileName}…</span>
            </div>
          ) : (
            <>
              <span className="drop-icon">⬆</span>
              <p className="drop-main">Click to upload or drag & drop</p>
              <p className="drop-sub">PDF, DOCX, TXT supported</p>
            </>
          )}
        </div>
      )}

      {status === 'error' && (
        <p className="file-error">{error}</p>
      )}
    </div>
  );
}
