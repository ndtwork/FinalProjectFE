import React, { useEffect, useState } from 'react';
import {
  createCollection,
  deleteCollection,
  getActiveCollection,
  setActiveCollection,
  ingestFile,
} from '../api/admin';
import { useAuth } from '../context/AuthContext';

export default function AdminPage() {
  const { role } = useAuth();
  const [active, setActive] = useState('');
  const [name, setName] = useState('');
  const [documentType, setDocumentType] = useState('Regulation');

  useEffect(() => {
    if (role !== 'admin') return;
    (async () => {
      const data = await getActiveCollection();
      setActive(data.active_collection);
    })();
  }, [role]);

  const handleCreate = async () => {
    await createCollection(name);
    setName('');
    const d = await getActiveCollection();
    setActive(d.active_collection);
  };

  const handleDelete = async () => {
    await deleteCollection(name);
    setName('');
    const d = await getActiveCollection();
    setActive(d.active_collection);
  };

  const handleSetActive = async () => {
    await setActiveCollection(active);
  };

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = (e.currentTarget as any).file.files[0] as File;
    await ingestFile(active, documentType, file);
    alert('Upload thành công!');
  };

  if (role !== 'admin') return <p className="p-4">Bạn không có quyền truy cập.</p>;

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4">
      <h2 className="text-2xl">Admin Dashboard</h2>
      <div>
        <h3>Active Collection</h3>
        <input
          value={active}
          onChange={e => setActive(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <button onClick={handleSetActive} className="bg-blue-500 text-white p-2 rounded">
          Set Active
        </button>
      </div>
      <div>
        <h3>Tạo / Xóa Collection</h3>
        <input
          placeholder="Tên collection"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <button onClick={handleCreate} className="bg-green-500 text-white p-2 rounded mr-2">
          Create
        </button>
        <button onClick={handleDelete} className="bg-red-500 text-white p-2 rounded">
          Delete
        </button>
      </div>
      <form onSubmit={handleIngest} className="space-y-2">
        <h3>Ingest File</h3>
        <select
          value={documentType}
          onChange={e => setDocumentType(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="Regulation">Regulation</option>
          <option value="FAQ">FAQ</option>
          <option value="RelatedIssue">RelatedIssue</option>
        </select>
        <input type="file" name="file" required className="w-full" />
        <button type="submit" className="w-full bg-purple-500 text-white p-2 rounded">
          Upload
        </button>
      </form>
    </div>
  );
}
