// src/components/AdminUpload.tsx
import React, { useState } from 'react';

type Props = {
  onAdd(item: { name: string; image: string; qty: number }): void;
};

export default function AdminUpload({ onAdd }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [qty, setQty] = useState(1);

  const preview = file ? URL.createObjectURL(file) : '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file && name) {
      onAdd({ name, image: preview, qty });
      setFile(null);
      setName('');
      setQty(1);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-lg max-w-md space-y-4"
    >
      <h2 className="text-xl font-semibold text-bay-leaf-700">
        Add / Update Product
      </h2>
      {preview && (
        <img src={preview} alt="preview" className="w-full h-32 object-cover rounded" />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="w-full"
      />
      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg"
      />
      <input
        type="number"
        min={0}
        value={qty}
        onChange={(e) => setQty(+e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg"
      />
      <button
        type="submit"
        className="w-full py-2 bg-bay-leaf-600 text-white rounded-lg
                   hover:bg-bay-leaf-700 transition"
      >
        Save
      </button>
    </form>
  );
}
