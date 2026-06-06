import React, { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000";

const style = `
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

  .ta-root {
    min-height: 100vh;
    background: var(--paper);
    font-family: 'DM Sans', sans-serif;
    color: var(--ink);
    padding: 0;
  }

  /* ---- TOPBAR ---- */
  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 40px;
    border-bottom: 1px solid var(--border);
    background: var(--card);
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .topbar-logo {
    display: flex;
    align-items: baseline;
    gap: 10px;
  }

  .topbar-title {
    font-family: 'Fraunces', serif;
    font-size: 22px;
    font-weight: 600;
    letter-spacing: -0.5px;
    color: var(--ink);
  }

  .topbar-sub {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .topbar-right {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .session-select-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
  }

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
    padding: 6px 28px 6px 10px;
    border-radius: 6px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: var(--ink);
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238a8078' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
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

  /* ---- MAIN LAYOUT ---- */
  .main {
    max-width: 1100px;
    margin: 0 auto;
    padding: 36px 40px;
  }

  /* ---- CARD ---- */
  .card {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 0;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 2px 16px rgba(15,14,13,0.07);
  }

  /* ---- IMAGE PANEL ---- */
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

  .answer-img {
    width: 100%;
    height: 400px;
    object-fit: contain;
    border-radius: 8px;
    display: block;
  }

  .img-label {
    position: absolute;
    top: 14px;
    left: 14px;
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

  /* ---- CONTENT PANEL ---- */
  .content-panel {
    padding: 30px 32px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  /* ---- STATUS ROW ---- */
  .status-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .status-badge {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 4px;
    font-weight: 500;
  }

  .status-reviewed {
    background: var(--green-muted);
    color: var(--green);
    border: 1px solid #a8d5bf;
  }

  .status-pending {
    background: var(--amber-muted);
    color: var(--amber);
    border: 1px solid #f6d49a;
  }

  .score-display {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }

  .score-num {
    font-family: 'Fraunces', serif;
    font-size: 42px;
    font-weight: 300;
    line-height: 1;
    color: var(--ink);
    font-variant-numeric: tabular-nums;
  }

  .score-sep {
    font-family: 'DM Mono', monospace;
    font-size: 18px;
    color: var(--border);
    margin: 0 2px;
  }

  .score-max {
    font-family: 'Fraunces', serif;
    font-size: 24px;
    font-weight: 300;
    color: var(--muted);
  }

  /* ---- DIVIDER ---- */
  .divider {
    height: 1px;
    background: var(--border);
  }

  /* ---- SECTIONS ---- */
  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--muted);
    margin-bottom: 6px;
  }

  .text-box {
    background: var(--paper);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px 14px;
    font-size: 14px;
    line-height: 1.6;
    color: #3a3530;
    max-height: 130px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
  }

  .reason-text {
    font-size: 14px;
    line-height: 1.65;
    color: #4a4540;
  }

  /* ---- ACTIONS ---- */
  .actions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: auto;
    padding-top: 4px;
  }

  .score-input {
    width: 90px;
    padding: 9px 12px;
    border: 1px solid var(--border);
    border-radius: 7px;
    background: var(--paper);
    font-family: 'DM Mono', monospace;
    font-size: 14px;
    color: var(--ink);
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    text-align: center;
  }
  .score-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(200,75,47,0.1);
  }
  .score-input::placeholder { color: var(--border); }

  .btn {
    padding: 9px 18px;
    border: none;
    border-radius: 7px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.01em;
  }

  .btn-update {
    background: var(--ink);
    color: var(--paper);
  }
  .btn-update:hover { background: #2a2825; transform: translateY(-1px); }
  .btn-update:active { transform: translateY(0); }

  .btn-full {
    background: var(--green);
    color: white;
  }
  .btn-full:hover { background: #236052; transform: translateY(-1px); }
  .btn-full:active { transform: translateY(0); }

  /* ---- NAV CONTROLS ---- */
  .nav-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 28px;
  }

  .nav-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 9px 16px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: var(--ink);
    cursor: pointer;
    transition: all 0.15s;
  }
  .nav-btn:hover:not(:disabled) { background: var(--cream); transform: translateY(-1px); }
  .nav-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  .progress-bar-wrap {
    flex: 1;
    margin: 0 16px;
    height: 4px;
    background: var(--border);
    border-radius: 4px;
    overflow: hidden;
  }
  .progress-bar-fill {
    height: 100%;
    background: var(--accent);
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  /* ---- KEYBOARD HINT ---- */
  .kbd-hint {
    margin-top: 20px;
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }
  .kbd-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    color: var(--muted);
  }
  .kbd {
    font-family: 'DM Mono', monospace;
    background: var(--card);
    border: 1px solid var(--border);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 11px;
    color: var(--ink);
  }

  /* ---- EMPTY STATE ---- */
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    gap: 10px;
    color: var(--muted);
  }
  .empty-icon {
    font-size: 40px;
    opacity: 0.4;
  }
  .empty-text {
    font-family: 'Fraunces', serif;
    font-size: 18px;
    color: var(--ink);
  }
  .empty-sub {
    font-size: 13px;
    color: var(--muted);
  }
`;

const Dashboard = () => {
  const [answers, setAnswers] = useState([]);
  const [scores, setScores] = useState({});
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchAnswers = async () => {
    try {
      const res = await fetch(`${API}/answers`);
      const data = await res.json();
      const safeData = Array.isArray(data) ? data : [];
      setAnswers(safeData);
      const uniqueSessions = [...new Set(safeData.map((a) => a.session_id).filter(Boolean))];
      setSessions(uniqueSessions);
    } catch (err) {
      console.error("Error fetching answers:", err);
      setAnswers([]);
      setSessions([]);
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
    } catch (err) {
      console.error("Review failed:", err);
    }
  };

  const filteredAnswers = answers.filter(
    (a) => !selectedSession || (a.session_id && String(a.session_id) === String(selectedSession))
  );
  const current = filteredAnswers[currentIndex];
  const progress = filteredAnswers.length > 0 ? ((currentIndex + 1) / filteredAnswers.length) * 100 : 0;

  useEffect(() => {
    const handleKey = (e) => {
      if (filteredAnswers.length === 0) return;
      if (e.key === "1") handleReview(current.id);
      if (e.key === "ArrowRight") { e.preventDefault(); setCurrentIndex((p) => Math.min(p + 1, filteredAnswers.length - 1)); }
      if (e.key === "ArrowLeft") { e.preventDefault(); setCurrentIndex((p) => Math.max(p - 1, 0)); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [filteredAnswers, currentIndex, scores]);

  return (
    <div className="ta-root">
      <style>{style}</style>

      {/* TOPBAR */}
      <div className="topbar">
        <div className="topbar-logo">
          <span className="topbar-title">TA Dashboard</span>
          <span className="topbar-sub">Grade Review</span>
        </div>
        <div className="topbar-right">
          <div className="session-select-wrap">
            <span className="session-label">Session</span>
            <select
              className="session-select"
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
            >
              <option value="">All</option>
              {sessions.map((s, i) => (
                <option key={s} value={s}>Session {i + 1}</option>
              ))}
            </select>
          </div>
          <span className="counter-pill">
            {filteredAnswers.length > 0 ? `${currentIndex + 1} / ${filteredAnswers.length}` : "0 / 0"}
          </span>
        </div>
      </div>

      {/* MAIN */}
      <div className="main">
        {!current ? (
          <div className="empty">
            <div className="empty-icon">○</div>
            <div className="empty-text">No answers here</div>
            <div className="empty-sub">Try selecting a different session</div>
          </div>
        ) : (
          <>
            <div className="card">
              {/* IMAGE */}
              <div className="image-panel">
                <span className="img-label">Answer Sheet</span>
                <img
                  className="answer-img"
                  src={`${API}/${current.image}`}
                  alt="answer"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300x400?text=No+Image";
                  }}
                />
              </div>

              {/* CONTENT */}
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
                  <div className="section-label">Extracted Answer</div>
                  <div className="text-box">{current.text || "No text detected"}</div>
                </div>

                <div>
                  <div className="section-label">Reasoning</div>
                  <p className="reason-text">{current.reason || "—"}</p>
                </div>

                <div>
                  <div className="section-label">Plagiarism Check</div>

                  <div
                    style={{
                      display: "inline-block",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      fontFamily: "DM Mono, monospace",
                      fontSize: "12px",
                      background: current.is_flagged ? "#fdecea" : "#e6f4ea",
                      color: current.is_flagged ? "#b91c1c" : "#2d6a4f",
                      border: "1px solid",
                      borderColor: current.is_flagged ? "#f5c2c7" : "#b7e4c7"
                    }}
                  >
                    {current.plagiarism_score ?? 0}
                    {current.is_flagged ? " ⚠️ Flagged" : " ✓ Clean"}
                  </div>
                </div>

                <div className="divider" />

                <div className="actions">
                  <input
                    type="number"
                    className="score-input"
                    placeholder="Score"
                    value={scores[current.id] || ""}
                    onChange={(e) => setScores({ ...scores, [current.id]: e.target.value })}
                  />
                  <button className="btn btn-update" onClick={() => handleReview(current.id)}>
                    Update
                  </button>
                  <button
                    className="btn btn-full"
                    onClick={() => {
                      setScores({ ...scores, [current.id]: current.max_score });
                      handleReview(current.id, current.max_score);
                    }}
                  >
                    ✓ Full Marks
                  </button>
                </div>
              </div>
            </div>

            {/* NAV */}
            <div className="nav-controls">
              <button
                className="nav-btn"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((p) => Math.max(p - 1, 0))}
              >
                ← Prev
              </button>
              <div className="progress-bar-wrap">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
              <button
                className="nav-btn"
                disabled={currentIndex === filteredAnswers.length - 1}
                onClick={() => setCurrentIndex((p) => Math.min(p + 1, filteredAnswers.length - 1))}
              >
                Next →
              </button>
            </div>

            {/* KEYBOARD HINTS */}
            <div className="kbd-hint">
              <div className="kbd-item"><span className="kbd">←</span><span className="kbd">→</span> Navigate</div>
              <div className="kbd-item"><span className="kbd">1</span> Quick grade</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;