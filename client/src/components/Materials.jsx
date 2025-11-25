import React, { useEffect, useRef, useState } from "react";
import "./Materials.css";
import { useMaterials } from "../components/MaterialsContext";
import { auth } from "../firebase";


/* --- tiny inline SVGs --- */
const PlusOutline = () => (
  <svg className="ss-plus" width="46" height="46" viewBox="0 0 46 46" aria-hidden="true">
    <circle cx="23" cy="23" r="20" />
    <path d="M23 14 v18 M14 23 h18" />
  </svg>
);
const PaperFold = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className="ss-paper">
    <rect x="1" y="1" width="16" height="16" rx="3" />
    <path d="M11 1 v6 h6" className="fold" />
  </svg>
);
const Pencil = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="ss-pencil">
    <path className="body" d="M3 17.25V21h3.75L19.81 7.94l-3.75-3.75L3 17.25z" />
    <path className="tip" d="M14.06 4.19l3.75 3.75" />
  </svg>
);
const KebabIco = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="ss-kebab-ico">
    <circle cx="12" cy="5" r="1.7" />
    <circle cx="12" cy="12" r="1.7" />
    <circle cx="12" cy="19" r="1.7" />
  </svg>
);

/* building blocks */
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
      tabIndex={0}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className="ss-create-icon">
        <PlusOutline />
      </div>
      <div className="ss-create-text">Create new notes</div>
    </CardShell>
  );
}

function MaterialCard({ item, isMenuOpen, onOpenMenu, onDelete }) {
  const menuRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (!isMenuOpen) return;
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onOpenMenu(null);
      }
    }
    function onEsc(e) {
      if (e.key === "Escape") onOpenMenu(null);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [isMenuOpen, onOpenMenu]);

  return (
    <CardShell>
      <div className="ss-card-top">
        <div className="ss-card-title">
          <span className="ss-card-icon">{item.icon}</span>
          <span className="ss-card-name">{item.title}</span>
        </div>

        <div className="ss-menu-wrap" ref={menuRef}>
          <button
            className="ss-kebab"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen ? "true" : "false"}
            aria-label={`More actions for ${item.title}`}
            onClick={() => onOpenMenu(isMenuOpen ? null : item.id)}
          >
            <KebabIco />
          </button>

          {isMenuOpen && (
            <div role="menu" className="ss-menu">
              <button
                role="menuitem"
                className="ss-menu-item ss-danger"
                onClick={() => {
                  onDelete(item.id);
                  onOpenMenu(null);
                }}
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

/* === Materials page === */
export default function Materials() {
  const { materials, addMaterial, deleteMaterial } = useMaterials(); // 👈 shared list
  const [active, setActive] = useState("All");
  const [openMenuId, setOpenMenuId] = useState(null);

  // upload + modal state
  const fileInputRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  // open OS file picker when "Create new notes" clicked
  const handleCreateClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPendingFile(file);
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    setNewTitle(baseName);
    setShowModal(true);

    // allow re-selecting same file later
    e.target.value = "";
  };

  const handleModalClose = () => {
    setShowModal(false);
    setPendingFile(null);
    setNewTitle("");
  };

  // backend connection


  const handleSaveMaterial = async (e, share) => {
  e.preventDefault();
  if (!newTitle.trim() || !pendingFile) return;

  try {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to upload.");
      return;
    }

    const idToken = await user.getIdToken();

    const formData = new FormData();
    formData.append("file", pendingFile);          //  matches upload.single("file")
    formData.append("title", newTitle.trim());     // for title
    formData.append("isShared", share ? "true" : "false"); // saved to groups or not

    const res = await fetch("http://localhost:5000/materials/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      body: formData,
      mode: "cors",   
    });
    

    const data = await res.json();

    if (!res.ok) {
      console.error("Upload failed:", data);
      alert(data.error || "Upload failed.");
      return;
    }

    // data.material is what your backend sends back
    const material = data.material;

    // Format date for display (using createdAt from backend if you want)
    const now = new Date(material.createdAt || Date.now());
    const dateStr = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    // Push into frontend state via context
    addMaterial({
      id: data.id, // Firestore doc id from backend
      title: material.title,
      date: dateStr,
      sub: material.isShared ? "Shared" : "",
      shared: material.isShared,
      iconType: "paper",
      // you could also keep fileUrl, sizeKB, etc in context if needed
    });

    handleModalClose();
  } catch (err) {
    console.error("Upload error:", err);
    alert(err.message || "Something went wrong during upload.");
  }
};


  // Filter based on tab
  const filteredMaterials =
    active === "All" ? materials : materials.filter((m) => m.shared);

  // Add the "Create new notes" card at the front
  const items = [{ id: "create", type: "create" }, ...filteredMaterials];

  // map iconType → actual icon component
  const withIcons = items.map((it) =>
    it.type === "create"
      ? it
      : {
          ...it,
          icon:
            it.iconType === "paper" ? (
              <PaperFold />
            ) : it.iconType === "pencil" ? (
              <Pencil />
            ) : null,
        }
  );

  const handleDelete = (id) => deleteMaterial(id);

  // Debug: see what this page sees
  console.log("Materials page sees materials:", materials);

  return (
    <div className="ss-wrap">
      <div className="ss-inner ss-with-sidebar-offset">
        {/* Pills like Figma */}
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
            Shared with Me
          </button>
        </div>

        {/* Hidden file input for upload */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <div className="ss-grid">
          {withIcons.map((it) =>
            it.type === "create" ? (
              <CreateCard key={it.id} onClick={handleCreateClick} />
            ) : (
              <MaterialCard
                key={it.id}
                item={it}
                isMenuOpen={openMenuId === it.id}
                onOpenMenu={setOpenMenuId}
                onDelete={handleDelete}
              />
            )
          )}
        </div>
      </div>

      {/* Modal: name file + choose share option */}
      {showModal && (
        <div className="ss-modal-backdrop">
          <div className="ss-modal">
            <h2 className="ss-modal-title">Save your notes</h2>

            <div className="ss-modal-form">
              <label className="ss-modal-label">
                File name
                <input
                  className="ss-modal-input"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Calculus I – Chapter 3"
                />
              </label>

              {pendingFile && (
                <p className="ss-modal-file-hint">
                  File: <strong>{pendingFile.name}</strong>
                </p>
              )}

              <div className="ss-modal-actions">
                <button
                  type="button"
                  className="ss-modal-btn ss-modal-cancel"
                  onClick={handleModalClose}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="ss-modal-btn ss-modal-save"
                  onClick={(e) => handleSaveMaterial(e, false)}
                >
                  Save (just for me)
                </button>

                <button
                  type="button"
                  className="ss-modal-btn ss-modal-share"
                  onClick={(e) => handleSaveMaterial(e, true)}
                >
                  Save & share with friends
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
