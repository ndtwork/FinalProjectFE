// src/pages/AdminPage.tsx
import React, { useEffect, useState } from 'react';
import {
  getCollections,
  getActiveCollection,
  createCollection,
  deleteCollection,
  setActiveCollection,
  ingestFile,
} from '../api/admin';
import { useAuth } from '../context/AuthContext';

export default function AdminPage() {
  const { token, role } = useAuth();
  const [collections, setCollections] = useState<string[]>([]);
  const [active, setActive] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [documentType, setDocumentType] = useState<string>('Regulation');

  // 1. Load list + active
  const loadAll = async () => {
    if (!token) return;
    try {
      const cols = await getCollections(token);
      setCollections(cols);
      const { active_collection } = await getActiveCollection(token);
      setActive(active_collection);
    } catch (err) {
      console.error('Load collections thất bại', err);
    }
  };

  // 2. Chạy lần đầu & khi token/role thay đổi
  useEffect(() => {
    if (role !== 'admin') return;
    loadAll();
  }, [token, role]);

  // 3. Tạo mới
  const handleCreate = async () => {
    if (!token || !newName.trim()) return;
    try {
      await createCollection(token, newName.trim());
      setNewName('');
      await loadAll();
    } catch (err) {
      console.error('Create collection lỗi', err);
    }
  };

  // 4. Xóa
  const handleDelete = async (name: string) => {
    if (!token) return;
    try {
      await deleteCollection(token, name);
      await loadAll();
    } catch (err) {
      console.error('Delete collection lỗi', err);
    }
  };

  // 5. Set Active
  const handleSetActive = async () => {
    if (!token || !active) return;
    try {
      await setActiveCollection(token, active);
      await loadAll();
    } catch (err) {
      console.error('Set active lỗi', err);
    }
  };

  // 6. Ingest file
  const handleIngest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token || !active) return;
    const files = (e.currentTarget as any).file.files as FileList;
    if (!files.length) return alert('Chưa chọn file');
    try {
      await ingestFile(token, active, documentType, files[0]);
      alert('Upload thành công!');
    } catch (err) {
      console.error('Ingest lỗi', err);
    }
  };

  // Không phải admin thì chặn
  if (role !== 'admin') {
    return <p className="p-4">Bạn không có quyền truy cập.</p>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>

      {/* Danh sách Collections */}
      <div>
        <h3 className="font-semibold mb-2">Danh sách Collections</h3>
        <ul className="border rounded p-2 space-y-1 max-h-48 overflow-auto">
          {collections.length > 0 ? (
            collections.map((col) => (
              <li
                key={col}
                className="flex justify-between items-center hover:bg-gray-100 p-1 rounded"
              >
                <span
                  className={`cursor-pointer ${
                    col === active ? 'font-semibold text-blue-600' : ''
                  }`}
                  onClick={() => setActive(col)}
                >
                  {col}
                </span>
                <button
                  onClick={() => handleDelete(col)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Delete
                </button>
              </li>
            ))
          ) : (
            <li>Chưa có collection nào.</li>
          )}
        </ul>
      </div>

      {/* Active Collection */}
      <div>
        <h3 className="font-semibold mb-2">Active Collection</h3>
        <div className="flex space-x-2">
          <select
            value={active}
            onChange={(e) => setActive(e.target.value)}
            className="flex-1 border p-2 rounded"
          >
            <option value="">-- Chọn collection --</option>
            {collections.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
          <button
            onClick={handleSetActive}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Set Active
          </button>
        </div>
      </div>

      {/* Tạo Collection Mới */}
      <div>
        <h3 className="font-semibold mb-2">Tạo Collection Mới</h3>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Tên collection"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 border p-2 rounded"
          />
          <button
            onClick={handleCreate}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>
      </div>

      {/* Ingest file */}
      <form onSubmit={handleIngest} className="space-y-2">
        <h3 className="font-semibold mb-2">Ingest Tài liệu</h3>
        <div className="space-y-2">
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="Regulation">Regulation</option>
            <option value="FAQ">FAQ</option>
            <option value="RelatedIssue">RelatedIssue</option>
          </select>
          <input
            type="file"
            name="file"
            required
            className="w-full border p-2 rounded"
          />
          <button
            type="submit"
            className="w-full bg-purple-600 text-white px-4 py-2 rounded"
          >
            Upload
          </button>
        </div>
      </form>
    </div>
  );
}
