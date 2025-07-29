// src/pages/AdminPanel.tsx
import { useState } from 'react';
import AdminUpload from '../components/AdminUpload';

type Item = { name: string; image: string; qty: number };

export default function AdminPanel() {
  const [items, setItems] = useState<Item[]>([]);

  const addItem = (it: Item) => setItems((prev) => [...prev.filter(i => i.name !== it.name), it]);

  return (
    <div className="p-8 flex flex-col md:flex-row gap-8">
      <AdminUpload onAdd={addItem} />
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-bay-leaf-700 mb-4">Product List</h1>
        <ul className="space-y-4">
          {items.map((i) => (
            <li
              key={i.name}
              className="flex items-center bg-white p-4 rounded-xl shadow"
            >
              <img src={i.image} alt={i.name} className="w-16 h-16 object-cover rounded" />
              <div className="ml-4">
                <div className="font-medium text-bay-leaf-700">{i.name}</div>
                <div className="text-gray-600">Quantity: {i.qty}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
