// src/pages/AdminPage.tsx
import React, { useEffect, useState } from "react";
import {
  createCollection,
  deleteCollection,
  getActiveCollection,
  setActiveCollection,
  ingestFile,
} from "../api/admin";
import { useAuth } from "../context/AuthContext";

export default function AdminPage() {
  const { token, role } = useAuth();
  const [active, setActive] = useState("");
  const [name, setName] = useState("");
  const [documentType, setDocumentType] = useState("Regulation");

  useEffect(() => {
    getActiveCollection().then(data => setActive(data.active_collection));
  }, []);

  const handleCreate = async () => {
    await createCollection(name);
    // reload if needed
  };

  const handleDelete = async () => {
    await deleteCollection(name);
    // reload
  };

  const handleSetActive = async () => {
    await setActiveCollection(active);
  };

  const handleIngest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fileInput = (e.currentTarget.elements as any).file.files[0];
    await ingestFile(active, documentType, fileInput);
    alert("Uploaded!");
  };

  if (role !== "admin") return <p>Forbidden</p>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div>
        <h2>Active collection: {active}</h2>
        <button onClick={handleSetActive}>Set active</button>
      </div>
      <div>
        <h2>Create/Delete collection</h2>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
        <button onClick={handleCreate}>Create</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
      <form onSubmit={handleIngest}>
        <h2>Ingest file</nNote: Please verify indenting and TSX elements.
