// src/pages/Materials.jsx
import React, { useRef, useState } from "react";
import "./Materials.css";
import { useMaterials } from "../components/MaterialsContext";
import  DocumentViewer  from "../components/DocumentViewer";

/* === ICONS === */
const PlusOutline = () => (
  <svg className="ss-plus" width="46" height="46" viewBox="0 0 46 46">
    <circle cx="23" cy="23" r="20" />
    <path d="M23 14 v18 M14 23 h18" />
  </svg>
);

const PaperFold = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" className="ss-paper">
    <rect x="1" y="1" width="16" height="16" rx="3" />
    <path d="M11 1 v6 h6" className="fold" />
  </svg>
);

const Pencil = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" className="ss-pencil">
    <path className="body" d="M3 17.25V21h3.75L19.81 7.94l-3.75-3.75L3 17.25z" />
    <path className="tip" d="M14.06 4.19l3.75 3.75" />
  </svg>
);

const KebabIco = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" className="ss-kebab-ico">
    <circle cx="12" cy="5" r="1.7" />
    <circle cx="12" cy="12" r="1.7" />
    <circle cx="12" cy="19" r="1.7" />
  </svg>
);

/* --- UI CARD WRAPPER --- */
function CardShell({ children, className = "", ...props }) {
  return (
    <div className={`ss-card ${className}`} {...props}>
      {children}
    </div>
  );
}

function CreateCard({ onClick }) {
  return (
    <CardShell
      className="ss-card-create"
      role="button"
      onClick={onClick}
      tabIndex={0}
    >
      <div className="ss-create-icon">
        <PlusOutline />
      </div>
      <div className="ss-create-text">Create new notes</div>
    </CardShell>
  );
}

function MaterialCard({ item, isMenuOpen, onOpenMenu, onDelete, onOpen }) {
  return (
    <CardShell role="button" onClick={() => onOpen(item)}>
      <div className="ss-card-top">
        <div className="ss-card-title">
          {item.icon}
          <span className="ss-card-name">{item.title}</span>
        </div>

        <div className="ss-menu-wrap" onClick={(e) => e.stopPropagation()}>
          <button
            className="ss-kebab"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen ? "true" : "false"}
            onClick={() => onOpenMenu(isMenuOpen ? null : item.id)}
          >
            <KebabIco />
          </button>

          {isMenuOpen && (
            <div className="ss-menu" role="menu">
              <button
                role="menuitem"
                className="ss-menu-item ss-danger"
                onClick={() => onDelete(item.id)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="ss-card-meta">
        <span className="ss-date">{item.date}</span>
        {item.sub && <span className="ss-divider">|</span>}
        {item.sub && <span className="ss-sub">{item.sub}</span>}
      </div>
    </CardShell>
  );
}

export default function Materials() {
  const { materials, addMaterial, deleteMaterial } = useMaterials();

  const [active, setActive] = useState("All");
  const [openMenuId, setOpenMenuId] = useState(null);

  const fileInputRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  const [viewerFile, setViewerFile] = useState(null);

  /* === Create button === */
  const handleCreateClick = () => fileInputRef.current?.click();

  /* === Select file === */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPendingFile(file);
    setNewTitle(file.name.replace(/\.[^/.]+$/, ""));
    setShowModal(true);
    e.target.value = "";
  };

  const handleModalClose = () => {
    setShowModal(false);
    setPendingFile(null);
    setNewTitle("");
  };

  /* === Save material (calls backend through context) === */
  const handleSaveMaterial = async (share) => {
    if (!pendingFile || !newTitle.trim()) return;

    await addMaterial({
      file: pendingFile,
      title: newTitle.trim(),
      shared: share,
    });

    handleModalClose();
  };

  /* === Filtering === */
  const filtered =
    active === "All"
      ? materials
      : materials.filter((m) => m.shared === true);

  /* === Build items array === */
  const items = [
    { id: "create", type: "create" },
    ...filtered.map((m) => ({
      ...m,
      icon:
        m.iconType === "paper" ? (
          <PaperFold />
        ) : m.iconType === "pencil" ? (
          <Pencil />
        ) : null,
    })),
  ];

  return (
    <div className="ss-wrap">
      <div className="ss-inner ss-with-sidebar-offset">
        {/* Tabs */}
        <div className="ss-tabs">
          <button
            className={`ss-pill ${active === "All" ? "is-active" : ""}`}
            onClick={() => setActive("All")}
          >
            All
          </button>
          <button
            className={`ss-pill ${active === "Shared" ? "is-active" : ""}`}
            onClick={() => setActive("Shared")}
          >
            Shared
          </button>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {/* Grid */}
        <div className="ss-grid">
          {items.map((it) =>
            it.type === "create" ? (
              <CreateCard key={it.id} onClick={handleCreateClick} />
            ) : (
              <MaterialCard
                key={it.id}
                item={it}
                isMenuOpen={openMenuId === it.id}
                onOpenMenu={setOpenMenuId}
                onDelete={deleteMaterial}
                onOpen={(item) => setViewerFile(item.fileUrl)}
              />
            )
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="ss-modal-backdrop">
          <div className="ss-modal">
            <h2 className="ss-modal-title">Save your notes</h2>

            <label className="ss-modal-label">
              File name
              <input
                className="ss-modal-input"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </label>

            <p className="ss-modal-file-hint">
              File: <strong>{pendingFile?.name}</strong>
            </p>

            <div className="ss-modal-actions">
              <button
                className="ss-modal-btn ss-modal-cancel"
                onClick={handleModalClose}
              >
                Cancel
              </button>

              <button
                className="ss-modal-btn ss-modal-save"
                onClick={() => handleSaveMaterial(false)}
              >
                Save (just for me)
              </button>

              <button
                className="ss-modal-btn ss-modal-share"
                onClick={() => handleSaveMaterial(true)}
              >
                Save & share
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer */}
      {viewerFile && (
        <DocumentViewer fileUrl={viewerFile} onClose={() => setViewerFile(null)} />
      )}
    </div>
  );
}
