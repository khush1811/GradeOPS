import React, { useState, useEffect, useRef } from "react";

const API = "http://127.0.0.1:8000";

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,300&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #0f0e0d;
    --paper: #f5f2ed;
    --cream: #ede8e0;
    --accent: #c84b2f;
    --accent-muted: #e8d5cf;
    --green: #2d6a4f;
    --green-muted: #d0e8dc;
    --amber: #b45309;
    --amber-muted: #fde9c4;
    --muted: #8a8078;
    --border: #d6cfc4;
    --card: #faf8f5;
  }

  body {
    background: var(--paper);
    font-family: 'DM Sans', sans-serif;
    color: var(--ink);
  }

  .ta-root { min-height: 100vh; background: var(--paper); }

  /* ── TOPBAR ── */
  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    height: 58px;
    border-bottom: 1px solid var(--border);
    background: var(--card);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .topbar-left { display: flex; align-items: center; gap: 32px; }
  .topbar-logo { display: flex; align-items: baseline; gap: 8px; }
  .topbar-title {
    font-family: 'Fraunces', serif;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: -0.5px;
    color: var(--ink);
  }
  .topbar-sub {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: var(--muted);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  /* ── NAV TABS ── */
  .nav-tabs { display: flex; align-items: center; gap: 2px; }
  .nav-tab {
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
    color: var(--muted);
    cursor: pointer;
    border: none;
    background: transparent;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .nav-tab:hover { background: var(--cream); color: var(--ink); }
  .nav-tab.active {
    background: var(--ink);
    color: var(--paper);
    font-weight: 500;
  }
  .nav-tab .tab-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--accent);
    display: none;
  }
  .nav-tab.active .tab-dot { display: block; }

  .topbar-right { display: flex; align-items: center; gap: 12px; }

  /* ── UPLOAD PAGE ── */
  .upload-page {
    max-width: 600px;
    margin: 0 auto;
    padding: 48px 40px;
  }
  .upload-page-header { margin-bottom: 36px; }
  .upload-page-header h1 {
    font-family: 'Fraunces', serif;
    font-size: 30px;
    font-weight: 300;
    color: var(--ink);
    margin-bottom: 6px;
  }
  .upload-page-header p {
    font-size: 14px;
    color: var(--muted);
  }

  .upload-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 28px;
    box-shadow: 0 2px 16px rgba(15,14,13,0.06);
  }
  .upload-section-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--muted);
    margin-bottom: 10px;
  }

  .drop-zone {
    border: 1.5px dashed var(--border);
    border-radius: 10px;
    background: var(--paper);
    padding: 28px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    margin-bottom: 12px;
  }
  .drop-zone:hover, .drop-zone.drag-over {
    border-color: var(--accent);
    background: var(--accent-muted);
  }
  .drop-zone-icon { font-size: 26px; margin-bottom: 8px; }
  .drop-zone-main { font-size: 14px; font-weight: 500; color: var(--ink); margin-bottom: 3px; }
  .drop-zone-sub { font-size: 12px; color: var(--muted); }

  .file-list { display: flex; flex-direction: column; gap: 6px; margin-top: 4px; }
  .file-chip {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 10px;
    background: var(--paper);
    border: 1px solid var(--border);
    border-radius: 7px;
    font-size: 13px;
  }
  .file-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--ink); }
  .file-size { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--muted); white-space: nowrap; }
  .file-remove {
    background: none; border: none; cursor: pointer;
    color: var(--muted); font-size: 14px; padding: 0 2px; line-height: 1;
    transition: color 0.15s;
  }
  .file-remove:hover { color: var(--accent); }

  .file-badge {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    padding: 3px 9px;
    border-radius: 20px;
    background: var(--accent-muted);
    color: var(--accent);
    border: 1px solid #e0b9b0;
    white-space: nowrap;
  }

  .rubric-textarea {
    width: 100%;
    box-sizing: border-box;
    padding: 10px 12px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    color: var(--ink);
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--paper);
    resize: vertical;
    min-height: 110px;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .rubric-textarea:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(200,75,47,0.08);
  }
  .rubric-textarea::placeholder { color: var(--border); }

  .upload-divider { height: 1px; background: var(--border); margin: 22px 0; }

  .upload-progress-row {
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 7px;
  }
  .upload-progress-label { font-size: 13px; color: var(--muted); }
  .upload-progress-pct { font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 500; color: var(--ink); }
  .upload-progress-track {
    height: 5px; border-radius: 99px;
    background: var(--cream); overflow: hidden;
  }
  .upload-progress-fill {
    height: 100%; border-radius: 99px;
    background: var(--green);
    transition: width 0.3s ease;
  }

  .upload-actions { display: flex; gap: 10px; margin-top: 20px; }
  .btn-upload-primary {
    flex: 1; padding: 11px;
    background: var(--ink); color: var(--paper);
    border: none; border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    display: flex; align-items: center; justify-content: center; gap: 7px;
  }
  .btn-upload-primary:hover:not(:disabled) { background: #2a2825; transform: translateY(-1px); }
  .btn-upload-primary:disabled { opacity: 0.38; cursor: not-allowed; }
  .btn-upload-secondary {
    padding: 11px 18px;
    background: var(--cream);
    color: var(--ink);
    border: 1px solid var(--border);
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 400;
    cursor: pointer;
    transition: all 0.15s;
  }
  .btn-upload-secondary:hover { background: var(--border); transform: translateY(-1px); }

  /* ── DASHBOARD ── */
  .dashboard-page {
    max-width: 1100px;
    margin: 0 auto;
    padding: 36px 40px;
  }
  .session-select-wrap { display: flex; align-items: center; gap: 8px; }
  .session-label {
    font-size: 11px;
    font-family: 'DM Mono', monospace;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--muted);
  }
  .session-select {
    appearance: none;
    background: var(--paper);
    border: 1px solid var(--border);
    padding: 5px 26px 5px 10px;
    border-radius: 6px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: var(--ink);
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238a8078' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 7px center;
    outline: none;
    transition: border-color 0.15s;
  }
  .session-select:focus { border-color: var(--accent); }
  .counter-pill {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: var(--muted);
    background: var(--cream);
    padding: 4px 10px;
    border-radius: 20px;
    border: 1px solid var(--border);
  }

  .card {
    display: grid;
    grid-template-columns: 320px 1fr;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 2px 16px rgba(15,14,13,0.07);
  }
  .image-panel {
    background: var(--cream);
    border-right: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    min-height: 460px;
    position: relative;
  }
  .answer-img { width: 100%; height: 400px; object-fit: contain; border-radius: 8px; display: block; }
  .img-label {
    position: absolute;
    top: 14px; left: 14px;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--muted);
    background: var(--cream);
    padding: 3px 8px;
    border-radius: 4px;
    border: 1px solid var(--border);
  }
  .content-panel {
    padding: 30px 32px;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }
  .status-row { display: flex; align-items: center; justify-content: space-between; }
  .status-badge {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 4px;
    font-weight: 500;
  }
  .status-reviewed { background: var(--green-muted); color: var(--green); border: 1px solid #a8d5bf; }
  .status-pending { background: var(--amber-muted); color: var(--amber); border: 1px solid #f6d49a; }
  .score-display { display: flex; align-items: baseline; gap: 4px; }
  .score-num {
    font-family: 'Fraunces', serif;
    font-size: 42px; font-weight: 300; line-height: 1;
    color: var(--ink); font-variant-numeric: tabular-nums;
  }
  .score-sep { font-family: 'DM Mono', monospace; font-size: 18px; color: var(--border); margin: 0 2px; }
  .score-max { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 300; color: var(--muted); }
  .divider { height: 1px; background: var(--border); }
  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px; text-transform: uppercase;
    letter-spacing: 0.12em; color: var(--muted);
    margin-bottom: 6px;
  }
  .text-box {
    background: var(--paper);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px 14px;
    font-size: 14px; line-height: 1.6; color: #3a3530;
    max-height: 130px; overflow-y: auto;
    scrollbar-width: thin; scrollbar-color: var(--border) transparent;
  }
  .reason-text { font-size: 14px; line-height: 1.65; color: #4a4540; }
  .actions { display: flex; align-items: center; gap: 8px; margin-top: auto; padding-top: 4px; }
  .score-input {
    width: 90px; padding: 9px 12px;
    border: 1px solid var(--border); border-radius: 7px;
    background: var(--paper);
    font-family: 'DM Mono', monospace; font-size: 14px; color: var(--ink);
    outline: none; transition: border-color 0.15s, box-shadow 0.15s;
    text-align: center;
  }
  .score-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(200,75,47,0.1); }
  .score-input::placeholder { color: var(--border); }
  .btn { padding: 9px 18px; border: none; border-radius: 7px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s; }
  .btn-update { background: var(--ink); color: var(--paper); }
  .btn-update:hover { background: #2a2825; transform: translateY(-1px); }
  .btn-full { background: var(--green); color: white; }
  .btn-full:hover { background: #236052; transform: translateY(-1px); }
  .nav-controls { display: flex; align-items: center; justify-content: space-between; margin-top: 28px; }
  .nav-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 9px 16px;
    background: var(--card); border: 1px solid var(--border); border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--ink);
    cursor: pointer; transition: all 0.15s;
  }
  .nav-btn:hover:not(:disabled) { background: var(--cream); transform: translateY(-1px); }
  .nav-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .progress-bar-wrap { flex: 1; margin: 0 16px; height: 4px; background: var(--border); border-radius: 4px; overflow: hidden; }
  .progress-bar-fill { height: 100%; background: var(--accent); border-radius: 4px; transition: width 0.3s ease; }
  .kbd-hint { margin-top: 20px; display: flex; gap: 16px; flex-wrap: wrap; }
  .kbd-item { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--muted); }
  .kbd { font-family: 'DM Mono', monospace; background: var(--card); border: 1px solid var(--border); padding: 2px 6px; border-radius: 4px; font-size: 11px; color: var(--ink); }
  .empty { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 300px; gap: 10px; }
  .empty-icon { font-size: 40px; opacity: 0.3; }
  .empty-text { font-family: 'Fraunces', serif; font-size: 18px; color: var(--ink); }
  .empty-sub { font-size: 13px; color: var(--muted); }

  .empty-upload-cta {
    margin-top: 16px;
    padding: 10px 22px;
    background: var(--ink); color: var(--paper);
    border: none; border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.15s;
  }
  .empty-upload-cta:hover { background: #2a2825; transform: translateY(-1px); }

  /* ── SPINNER ── */
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(245,242,237,0.3);
    border-top-color: var(--paper);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  /* ── TOAST ── */
  .toast {
    position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
    background: var(--ink); color: var(--paper);
    font-size: 13px; font-family: 'DM Sans', sans-serif;
    padding: 10px 20px; border-radius: 8px;
    opacity: 0; transition: opacity 0.2s;
    pointer-events: none; z-index: 9999;
    white-space: nowrap;
  }
  .toast.show { opacity: 1; }
`;

// ─── UPLOAD PAGE ──────────────────────────────────────────────────────────────
const UploadPage = ({ onSwitchToDashboard }) => {
  const [files, setFiles] = useState([]);
  const [rubric, setRubric] = useState("");
  const [progress, setProgress] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [status, setStatus] = useState("idle");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();

  const addFiles = (incoming) => {
    const pdfs = Array.from(incoming).filter((f) => f.type === "application/pdf");
    setFiles((prev) => [...prev, ...pdfs]);
  };
  const removeFile = (i) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const formatSize = (b) => b < 1024 * 1024 ? (b / 1024).toFixed(0) + " KB" : (b / (1024 * 1024)).toFixed(1) + " MB";

  const handleUpload = async () => {
    if (!files.length) return;
    setStatus("processing"); setProgress(0); setDoneCount(0);
    let completed = 0;
    await Promise.all(files.map(async (file) => {
      const fd = new FormData();
      fd.append("file", file); fd.append("rubric", rubric);
      try { await fetch(`${API}/process/`, { method: "POST", body: fd }); } catch (e) {}
      completed++;
      setDoneCount(completed);
      setProgress(Math.round((completed / files.length) * 100));
    }));
    setStatus("done");
  };

  const reset = () => { setFiles([]); setRubric(""); setProgress(0); setDoneCount(0); setStatus("idle"); };

  const isProcessing = status === "processing";
  const isDone = status === "done";

  return (
    <div className="upload-page">
      <div className="upload-page-header">
        <h1>Upload exams</h1>
        <p>Add answer-sheet PDFs and a grading rubric, then let the system do the work.</p>
      </div>

      <div className="upload-card">
        {/* Drop Zone */}
        <p className="upload-section-label">Answer PDFs</p>
        <div
          className={`drop-zone${dragOver ? " drag-over" : ""}`}
          onClick={() => inputRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <div className="drop-zone-icon">☁</div>
          <p className="drop-zone-main">Drag & drop PDFs here</p>
          <p className="drop-zone-sub">or click to browse</p>
        </div>
        <input ref={inputRef} type="file" multiple accept=".pdf" style={{ display: "none" }}
          onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />

        {files.length > 0 && (
          <div className="file-list">
            {files.map((f, i) => (
              <div key={i} className="file-chip">
                <span>📕</span>
                <span className="file-name">{f.name}</span>
                <span className="file-size">{formatSize(f.size)}</span>
                {!isProcessing && (
                  <button className="file-remove" onClick={() => removeFile(i)} aria-label={`Remove ${f.name}`}>✕</button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="upload-divider" />

        {/* Rubric */}
        <p className="upload-section-label">Grading rubric</p>
        <textarea
          className="rubric-textarea"
          placeholder="Describe the grading criteria, point distribution, and expected answers…"
          value={rubric}
          onChange={(e) => setRubric(e.target.value)}
          disabled={isProcessing}
        />

        {/* Progress */}
        {(isProcessing || isDone) && (
          <div style={{ marginTop: "18px" }}>
            <div className="upload-progress-row">
              <span className="upload-progress-label">
                {isDone ? "All done!" : `Grading ${doneCount} of ${files.length}…`}
              </span>
              <span className="upload-progress-pct">{progress}%</span>
            </div>
            <div className="upload-progress-track">
              <div className="upload-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="upload-actions">
          {isDone ? (
            <>
              <button className="btn-upload-secondary" onClick={reset}>Upload more</button>
              <button className="btn-upload-primary" onClick={onSwitchToDashboard}>
                View results →
              </button>
            </>
          ) : (
            <button
              className="btn-upload-primary"
              onClick={handleUpload}
              disabled={files.length === 0 || isProcessing}
            >
              {isProcessing ? <><span className="spinner" />Processing…</> : "Upload & grade"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
const DashboardPage = ({ onSwitchToUpload }) => {
  const [answers, setAnswers] = useState([]);
  const [scores, setScores] = useState({});
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchAnswers = async () => {
    try {
      const res = await fetch(`${API}/answers`);
      const data = await res.json();
      const safe = Array.isArray(data) ? data : [];
      setAnswers(safe);
      setSessions([...new Set(safe.map((a) => a.session_id).filter(Boolean))]);
    } catch {
      setAnswers([]); setSessions([]);
    }
  };

  useEffect(() => { fetchAnswers(); }, []);
  useEffect(() => { setCurrentIndex(0); }, [selectedSession]);

  const handleReview = async (id, overrideScore) => {
    const newScore = overrideScore ?? scores[id];
    if (newScore === undefined || newScore === "") return;
    try {
      await fetch(`${API}/review/${id}?final_score=${newScore}`, { method: "POST" });
      fetchAnswers();
    } catch {}
  };

  const filtered = answers.filter(
    (a) => !selectedSession || String(a.session_id) === String(selectedSession)
  );
  const current = filtered[currentIndex];
  const progress = filtered.length > 0 ? ((currentIndex + 1) / filtered.length) * 100 : 0;

  useEffect(() => {
    const onKey = (e) => {
      if (!filtered.length) return;
      if (e.key === "1") handleReview(current.id);
      if (e.key === "ArrowRight") { e.preventDefault(); setCurrentIndex((p) => Math.min(p + 1, filtered.length - 1)); }
      if (e.key === "ArrowLeft") { e.preventDefault(); setCurrentIndex((p) => Math.max(p - 1, 0)); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filtered, currentIndex, scores]);

  return (
    <div className="dashboard-page">
      {!current ? (
        <div className="empty">
          <div className="empty-icon">◯</div>
          <div className="empty-text">No answers yet</div>
          <div className="empty-sub">Upload and grade some exams first</div>
          <button className="empty-upload-cta" onClick={onSwitchToUpload}>Go to upload →</button>
        </div>
      ) : (
        <>
          <div className="card">
            <div className="image-panel">
              <span className="img-label">Answer sheet</span>
              <img className="answer-img" src={`${API}/${current.image}`} alt="answer"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/300x400?text=No+Image"; }} />
            </div>
            <div className="content-panel">
              <div className="status-row">
                <div className="score-display">
                  <span className="score-num">{current.score}</span>
                  <span className="score-sep">/</span>
                  <span className="score-max">{current.max_score}</span>
                </div>
                <span className={`status-badge ${current.status === "REVIEWED" ? "status-reviewed" : "status-pending"}`}>
                  {current.status}
                </span>
              </div>
              <div className="divider" />
              <div>
                <div className="section-label">Extracted answer</div>
                <div className="text-box">{current.text || "No text detected"}</div>
              </div>
              <div>
                <div className="section-label">Reasoning</div>
                <p className="reason-text">{current.reason || "—"}</p>
              </div>
              <div className="divider" />
              <div className="actions">
                <input type="number" className="score-input" placeholder="Score"
                  value={scores[current.id] || ""}
                  onChange={(e) => setScores({ ...scores, [current.id]: e.target.value })} />
                <button className="btn btn-update" onClick={() => handleReview(current.id)}>Update</button>
                <button className="btn btn-full" onClick={() => {
                  setScores({ ...scores, [current.id]: current.max_score });
                  handleReview(current.id, current.max_score);
                }}>✓ Full marks</button>
              </div>
            </div>
          </div>

          <div className="nav-controls">
            <button className="nav-btn" disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((p) => Math.max(p - 1, 0))}>← Prev</button>
            <div className="progress-bar-wrap">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <button className="nav-btn" disabled={currentIndex === filtered.length - 1}
              onClick={() => setCurrentIndex((p) => Math.min(p + 1, filtered.length - 1))}>Next →</button>
          </div>

          <div className="kbd-hint">
            <div className="kbd-item"><span className="kbd">←</span><span className="kbd">→</span> Navigate</div>
            <div className="kbd-item"><span className="kbd">1</span> Quick grade</div>
          </div>
        </>
      )}
    </div>
  );
};

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
const App = () => {
  const [page, setPage] = useState("upload");
  const [answers, setAnswers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setToastVisible(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2500);
  };

  const fetchAnswers = async () => {
    try {
      const res = await fetch(`${API}/answers`);
      const data = await res.json();
      const safe = Array.isArray(data) ? data : [];
      setAnswers(safe);
      setSessions([...new Set(safe.map((a) => a.session_id).filter(Boolean))]);
    } catch {}
  };
  useEffect(() => { fetchAnswers(); }, [page]);

  const pendingCount = answers.filter((a) => a.status !== "REVIEWED").length;

  return (
    <div className="ta-root">
      <style>{globalStyle}</style>

      {/* TOPBAR */}
      <div className="topbar">
        <div className="topbar-left">
          <div className="topbar-logo">
            <span className="topbar-title">GradeMate</span>
            <span className="topbar-sub">TA Suite</span>
          </div>
          <div className="nav-tabs">
            <button className={`nav-tab${page === "upload" ? " active" : ""}`} onClick={() => setPage("upload")}>
              <span className="tab-dot" />
              Upload
            </button>
            <button className={`nav-tab${page === "dashboard" ? " active" : ""}`} onClick={() => setPage("dashboard")}>
              <span className="tab-dot" />
              Review
              {pendingCount > 0 && (
                <span style={{
                  marginLeft: 2,
                  fontSize: 10, fontFamily: "'DM Mono', monospace",
                  background: "var(--accent)", color: "var(--paper)",
                  padding: "1px 6px", borderRadius: 99
                }}>{pendingCount}</span>
              )}
            </button>
          </div>
        </div>

        <div className="topbar-right">
          {page === "dashboard" && sessions.length > 0 && (
            <div className="session-select-wrap">
              <span className="session-label">Session</span>
              <select className="session-select" value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}>
                <option value="">All</option>
                {sessions.map((s, i) => <option key={s} value={s}>Session {i + 1}</option>)}
              </select>
            </div>
          )}
          <span className="counter-pill">
            {answers.length} answer{answers.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* PAGE */}
      {page === "upload"
        ? <UploadPage onSwitchToDashboard={() => { fetchAnswers(); setPage("dashboard"); }} />
        : <DashboardPage onSwitchToUpload={() => setPage("upload")} selectedSession={selectedSession} />
      }

      {/* TOAST */}
      <div className={`toast${toastVisible ? " show" : ""}`}>{toastMsg}</div>
    </div>
  );
};

export default App;