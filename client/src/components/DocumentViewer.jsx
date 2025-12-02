// src/components/DocumentViewer.jsx
import React from "react";
import "./DocumentViewer.css";

export default function DocumentViewer({ url, title, onClose }) {
  if (!url) return null;

  // Get file extension
  const ext = url.split("?")[0].split(".").pop().toLowerCase();

  const isPDF = ext === "pdf";
  const isImage = ["png", "jpg", "jpeg", "gif", "webp"].includes(ext);

  return (
    <div className="dv-backdrop" onClick={onClose}>
      <div className="dv-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dv-header">
          <span className="dv-title">{title}</span>
          <button className="dv-close" onClick={onClose}>✕</button>
        </div>

        <div className="dv-body">
          {isPDF ? (
            <iframe
              src={url}
              title={title}
              className="dv-frame"
            />
          ) : isImage ? (
            <img src={url} alt={title} className="dv-image" />
          ) : (
            <div className="dv-unsupported">
              <p>This file type cannot be previewed.</p>
              <a className="dv-download" href={url} target="_blank" rel="noopener noreferrer">
                Download File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
