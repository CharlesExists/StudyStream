import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Materials.css";

/* upload cloud to match Figma */
const UploadCloud = () => (
  <svg className="ss-upload-ico" width="42" height="42" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 18a4 4 0 0 1 0-8c.3-2.8 2.6-5 5.5-5A5.5 5.5 0 0 1 18 10h1a4 4 0 0 1 0 8H7z" fill="#2466DB" opacity="0.15"/>
    <path d="M12 16V8m0 0l-3 3m3-3l3 3" stroke="#2466DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function CreateNotesScreen() {
  const nav = useNavigate();
  const inputRef = useRef(null);

  const openFile = () => inputRef.current?.click();

  return (
    <div className="ss-wrap">
      <div className="ss-inner ss-with-sidebar-offset">
        <div className="ss-create-page">
          <button className="ss-back-pill" onClick={()=>nav("/materials")}>
            Back to Materials
          </button>

          <div className="ss-upload-card">
            <div
              className="ss-dropzone"
              onClick={openFile}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openFile();
                }
            }}>
              <UploadCloud/>
              <h2 className="ss-upload-title">Upload sources</h2>
              <p className="ss-upload-sub">Supported file types: PDF, txt, docx</p>
              <div className="ss-drop-dashed" />
              <input
                ref={inputRef}
                id="file-input"
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                multiple
                style={{ display: "none" }}
                onChange={(e) => {
                  // hook up real upload logic later
                  const count = e.target.files?.length || 0;
                  alert(`${count} file${count === 1 ? "" : "s"} selected`);
                }}
              />
            </div>

            <div className="ss-upload-actions">
              <button className="ss-btn ss-btn-outline" onClick={openFile}>
                <span className="g-badge">G</span> Upload from Google Drive
              </button>
              <button className="ss-btn ss-btn-outline" onClick={() => alert("Paste text clicked")}>
                <span className="t-badge">T</span> Paste Text
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
