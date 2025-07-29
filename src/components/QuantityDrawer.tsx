// src/components/QuantityDrawer.tsx
import React from 'react';

type Props = {
  isOpen: boolean;
  onClose(): void;
  product: { name: string; image: string } | null;
};

export default function QuantityDrawer({ isOpen, onClose, product }: Props) {
  return (
    <div
      className={`fixed inset-0 z-40 bg-black bg-opacity-30 pointer-events-none
                  transition-opacity ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'
                  }`}
    >
      <div
        className={`absolute right-0 top-0 h-full w-80 bg-white p-6 shadow-2xl
                    transform transition-transform duration-300 ${
                      isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
      >
        <button
          onClick={onClose}
          className="mb-4 text-gray-500 hover:text-gray-700"
        >
          ✕ Close
        </button>
        {product && (
          <>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover rounded-md"
            />
            <h2 className="mt-4 text-xl font-semibold text-bay-leaf-700">
              {product.name}
            </h2>
            <label className="block mt-4 text-gray-600">Quantity</label>
            <input
              type="number"
              min={1}
              defaultValue={1}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
            />
            <button
              onClick={onClose}
              className="mt-6 w-full py-2 bg-bay-leaf-600 text-white rounded-lg
                         hover:bg-bay-leaf-700 transition"
            >
              Confirm
            </button>
          </>
        )}
      </div>
    </div>
  );
}
