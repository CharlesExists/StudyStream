import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Materials.css";

/* --- tiny inline SVGs --- */
const PlusOutline = () => (
  <svg className="ss-plus" width="46" height="46" viewBox="0 0 46 46" aria-hidden="true">
    <circle cx="23" cy="23" r="20" />
    <path d="M23 14 v18 M14 23 h18" />
  </svg>
);
const PaperFold = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className="ss-paper">
    <rect x="1" y="1" width="16" height="16" rx="3"/>
    <path d="M11 1 v6 h6" className="fold" />
  </svg>
);
const Pencil = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="ss-pencil">
    <path className="body" d="M3 17.25V21h3.75L19.81 7.94l-3.75-3.75L3 17.25z"/>
    <path className="tip" d="M14.06 4.19l3.75 3.75"/>
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
  return <div className={`ss-card ${className}`} {...props}>{children}</div>;
}
function CreateCard({ onClick }) {
  return (
    <CardShell
      className="ss-card-create"
      role="button"
      tabIndex={0}
      onClick={(e)=>{ e.preventDefault(); onClick?.(); }}
      onKeyDown={(e)=>{ if(e.key==="Enter"){ e.preventDefault(); onClick?.(); } }}
    >
      <div className="ss-create-icon"><PlusOutline /></div>
      <div className="ss-create-text">Create new notes</div>
    </CardShell>
  );
}

function MaterialCard({ item, isMenuOpen, onOpenMenu, onDelete }) {
  const menuRef = useRef(null);

  useEffect(() => {
    function onDocClick(e){
      if (!isMenuOpen) return;
      if (menuRef.current && !menuRef.current.contains(e.target)) onOpenMenu(null);
    }
    function onEsc(e){ if(e.key === "Escape") onOpenMenu(null); }
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
            <KebabIco/>
          </button>

          {isMenuOpen && (
            <div role="menu" className="ss-menu">
              <button
                role="menuitem"
                className="ss-menu-item ss-danger"
                onClick={() => { onDelete(item.id); onOpenMenu(null); }}
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
  const navigate = useNavigate();
  const [active, setActive] = useState("All");
  const [materials, setMaterials] = useState([
    { id: "create", type: "create" },
    { id: "calc", title: "Calculus I", date: "Oct 26, 2025", sub: "Shared by Sarah", icon: <PaperFold/> },
    { id: "chem", title: "Chemistry",  date: "Oct 21, 2025", icon: <Pencil/> },
  ]);
  const [openMenuId, setOpenMenuId] = useState(null);

  const items = active === "All"
    ? materials
    : materials.filter(m => m.id === "calc" || m.type === "create");

  const handleDelete = (id) => setMaterials(prev => prev.filter(m => m.id !== id));

  return (
    <div className="ss-wrap">
      <div className="ss-inner ss-with-sidebar-offset">
        {/* no header; only pills like Figma */}
        <div className="ss-tabs">
          <button className={`ss-pill ${active === "All" ? "is-active" : ""}`} onClick={()=>setActive("All")}>All</button>
          <button className={`ss-pill ${active === "Shared" ? "is-active" : ""}`} onClick={()=>setActive("Shared")}>Shared with Me</button>
        </div>

        <div className="ss-grid">
          {items.map((it) =>
            it.type === "create" ? (
              <CreateCard key={it.id} onClick={() => navigate("/materials/create")} />
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
    </div>
  );
}
