// src/components/MaterialsContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../firebase";

const MaterialsContext = createContext();

export function MaterialsProvider({ children }) {
  const [materials, setMaterials] = useState([]);

  const API = "http://localhost:3001";

  async function getAuthHeader() {
    const user = auth.currentUser;
    if (!user) throw new Error("Not logged in.");
    const token = await user.getIdToken();
    return { headers: { Authorization: `Bearer ${token}` } };
  }

  /* ------------------------------------------
     FETCH MATERIALS (GET /materials)
  -------------------------------------------*/
  async function fetchMaterials() {
    try {
      const header = await getAuthHeader();
      const res = await axios.get(`${API}/materials`, header);

      const parsed = res.data.materials.map((m) => {
        const created = m.createdAt?._seconds
          ? new Date(m.createdAt._seconds * 1000)
          : new Date();

        return {
          id: m.id,
          title: m.title,
          shared: m.shared || false,
          sub: m.shared ? "Shared" : "",
          iconType: m.type === "file" ? "paper" : "pencil",
          fileUrl: m.fileUrl || null,   
          type: m.type || "file",      

          date: created.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        };
      });

      setMaterials(parsed);
    } catch (err) {
      console.error("Failed to fetch materials:", err);
    }
  }

  /* ------------------------------------------
     ADD MATERIAL (POST /materials/create)
  -------------------------------------------*/
  async function addMaterial({ file, title, shared }) {
    try {
      const header = await getAuthHeader();

      const form = new FormData();
      form.append("type", "file");            // required
      form.append("title", title);
      form.append("shared", shared ? "true" : "false");
      form.append("file", file);


      console.log("UPLOAD TO:", `${API}/materials/create`);

      const res = await axios.post(`${API}/materials/create`, form, {

        ...header,
        headers: {
          ...header.headers,
          "Content-Type": "multipart/form-data",
        },
      });

      const m = res.data.material;

      const created = m.createdAt
        ? new Date(m.createdAt)
        : new Date();

      const newMaterial = {
        id: res.data.materialId,
        title: m.title,
        shared: m.shared,
        sub: m.shared ? "Shared" : "",
        iconType: "paper",
        fileUrl: m.fileUrl,
        date: created.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };

      setMaterials((prev) => [newMaterial, ...prev]);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  }

  /* ------------------------------------------
     DELETE MATERIAL (DELETE /materials/:id)
  -------------------------------------------*/
  async function deleteMaterial(id) {
    try {
      const header = await getAuthHeader();
      await axios.delete(`${API}/materials/${id}`, header);

      setMaterials((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  useEffect(() => {
    fetchMaterials();
  }, []);

  return (
    <MaterialsContext.Provider
      value={{ materials, addMaterial, deleteMaterial, fetchMaterials }}
    >
      {children}
    </MaterialsContext.Provider>
  );
}

export function useMaterials() {
  return useContext(MaterialsContext);
}
