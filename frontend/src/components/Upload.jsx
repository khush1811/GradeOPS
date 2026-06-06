import React, { useState, useRef } from "react";

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [rubric, setRubric] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | processing | done
  const [doneCount, setDoneCount] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();

  const addFiles = (incoming) => {
    const pdfs = Array.from(incoming).filter((f) => f.type === "application/pdf");
    setFiles((prev) => [...prev, ...pdfs]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setStatus("processing");
    setProgress(0);
    setDoneCount(0);

    let completed = 0;

    await Promise.all(
      files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("rubric", rubric);

        try {
          await fetch("http://127.0.0.1:8000/process/", {
            method: "POST",
            body: formData,
          });
        } catch (err) {
          console.error("Upload failed for", file.name, err);
        }

        completed++;
        setDoneCount(completed);
        setProgress(Math.round((completed / files.length) * 100));
      })
    );

    setStatus("done");
  };

  const reset = () => {
    setFiles([]);
    setRubric("");
    setProgress(0);
    setDoneCount(0);
    setStatus("idle");
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const isProcessing = status === "processing";
  const isDone = status === "done";

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Exam grader</h2>
            <p style={styles.subtitle}>Upload PDFs and enter a rubric to begin grading</p>
          </div>
          {files.length > 0 && (
            <span style={styles.badge}>
              {files.length} file{files.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Drop Zone */}
        <p style={styles.sectionLabel}>📄 Exam PDFs</p>
        <div
          style={{
            ...styles.dropZone,
            ...(dragOver ? styles.dropZoneActive : {}),
          }}
          onClick={() => inputRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <div style={styles.dropIcon}>☁️</div>
          <p style={styles.dropMain}>Drag & drop PDFs here</p>
          <p style={styles.dropSub}>or click to browse</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf"
          style={{ display: "none" }}
          onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
        />

        {/* File List */}
        {files.length > 0 && (
          <div style={styles.fileList}>
            {files.map((file, i) => (
              <div key={i} style={styles.fileChip}>
                <span style={styles.fileIcon}>📕</span>
                <span style={styles.fileName}>{file.name}</span>
                <span style={styles.fileSize}>{formatSize(file.size)}</span>
                {!isProcessing && (
                  <button
                    style={styles.removeBtn}
                    onClick={() => removeFile(i)}
                    aria-label={`Remove ${file.name}`}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Rubric */}
        <div style={{ marginTop: "1.5rem" }}>
          <p style={styles.sectionLabel}>📋 Grading rubric</p>
          <textarea
            style={styles.textarea}
            placeholder="Describe the grading criteria, point distribution, and expected answers…"
            value={rubric}
            onChange={(e) => setRubric(e.target.value)}
            rows={5}
            disabled={isProcessing}
          />
        </div>

        {/* Progress */}
        {(isProcessing || isDone) && (
          <div style={{ marginTop: "1.25rem" }}>
            <div style={styles.progressHeader}>
              <span style={styles.progressLabel}>
                {isDone
                  ? "All done!"
                  : `Grading ${doneCount} of ${files.length}…`}
              </span>
              <span style={styles.progressPct}>{progress}%</span>
            </div>
            <div style={styles.progressTrack}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${progress}%`,
                  backgroundColor: isDone ? "#16a34a" : "#2563eb",
                }}
              />
            </div>
          </div>
        )}

        {/* Button */}
        <div style={{ marginTop: "1.25rem", display: "flex", gap: "10px" }}>
          {isDone ? (
            <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={reset}>
              Upload more
            </button>
          ) : (
            <button
              style={{
                ...styles.button,
                ...(files.length === 0 || isProcessing ? styles.buttonDisabled : {}),
              }}
              onClick={handleUpload}
              disabled={files.length === 0 || isProcessing}
            >
              {isProcessing ? "Processing…" : "Upload & grade"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "2rem 1rem",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "2rem",
    width: "100%",
    maxWidth: "560px",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: "1.5rem",
  },
  title: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "600",
    color: "#111827",
  },
  subtitle: {
    margin: "4px 0 0",
    fontSize: "13px",
    color: "#6b7280",
  },
  badge: {
    fontSize: "11px",
    fontWeight: "600",
    padding: "3px 9px",
    borderRadius: "99px",
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    whiteSpace: "nowrap",
  },
  sectionLabel: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    margin: "0 0 8px",
  },
  dropZone: {
    border: "1.5px dashed #d1d5db",
    borderRadius: "12px",
    backgroundColor: "#f9fafb",
    padding: "2rem",
    textAlign: "center",
    cursor: "pointer",
    transition: "border-color 0.2s, background-color 0.2s",
  },
  dropZoneActive: {
    borderColor: "#3b82f6",
    backgroundColor: "#eff6ff",
  },
  dropIcon: {
    fontSize: "28px",
    marginBottom: "8px",
  },
  dropMain: {
    margin: "0 0 4px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
  },
  dropSub: {
    margin: 0,
    fontSize: "12px",
    color: "#9ca3af",
  },
  fileList: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginTop: "10px",
  },
  fileChip: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "7px 10px",
    backgroundColor: "#f9fafb",
    border: "0.5px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "13px",
  },
  fileIcon: {
    fontSize: "15px",
    flexShrink: 0,
  },
  fileName: {
    flex: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: "#374151",
  },
  fileSize: {
    color: "#9ca3af",
    fontSize: "11px",
    whiteSpace: "nowrap",
  },
  removeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#9ca3af",
    fontSize: "13px",
    padding: "0 2px",
    lineHeight: 1,
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    fontSize: "13px",
    color: "#374151",
    border: "0.5px solid #e5e7eb",
    borderRadius: "8px",
    backgroundColor: "#f9fafb",
    resize: "vertical",
    fontFamily: "system-ui, -apple-system, sans-serif",
    outline: "none",
  },
  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "6px",
  },
  progressLabel: {
    fontSize: "13px",
    color: "#6b7280",
  },
  progressPct: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#111827",
  },
  progressTrack: {
    height: "6px",
    borderRadius: "99px",
    backgroundColor: "#f3f4f6",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: "99px",
    transition: "width 0.3s ease, background-color 0.5s ease",
  },
  button: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#111827",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  buttonSecondary: {
    backgroundColor: "#f3f4f6",
    color: "#374151",
  },
  buttonDisabled: {
    opacity: 0.4,
    cursor: "not-allowed",
  },
};

export default Upload;