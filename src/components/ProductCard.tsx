// src/components/ProductCard.tsx
import React from 'react';

type Props = { name: string; image: string; onClick(): void };

export default function ProductCard({ name, image, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl 
                 transform hover:scale-105 transition"
    >
      <img src={image} alt={name} className="w-full h-40 object-cover" />
      <div className="p-4 text-center font-medium text-bay-leaf-700">{name}</div>
    </div>
  );
}
