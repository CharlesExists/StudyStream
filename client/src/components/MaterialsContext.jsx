// src/components/MaterialsContext.jsx
import React, { createContext, useContext, useState } from "react";

const MaterialsContext = createContext();

const initialMaterials = [
  {
    id: "calc",
    title: "Calculus I",
    date: "Oct 26, 2025",
    sub: "Shared by Sarah",
    shared: true,
    iconType: "paper",
  },
  {
    id: "chem",
    title: "Chemistry",
    date: "Oct 21, 2025",
    sub: "",
    shared: false,
    iconType: "pencil",
  },
];

export function MaterialsProvider({ children }) {
  const [materials, setMaterials] = useState(initialMaterials);

  function addMaterial(material) {
    setMaterials((prev) => [...prev, material]);
  }

  function deleteMaterial(id) {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  }

  const value = { materials, addMaterial, deleteMaterial };
  return (
    <MaterialsContext.Provider value={value}>
      {children}
    </MaterialsContext.Provider>
  );
}

export function useMaterials() {
  const ctx = useContext(MaterialsContext);
  if (!ctx) {
    throw new Error("useMaterials must be used inside MaterialsProvider");
  }
  return ctx;
}
