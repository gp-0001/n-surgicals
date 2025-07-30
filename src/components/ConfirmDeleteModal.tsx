// src/components/ConfirmDeleteModal.tsx
import React, { useState } from 'react';
import type { Product } from '../types/Product';

interface ConfirmDeleteModalProps {
  product: Product;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export default function ConfirmDeleteModal({ product, onConfirm, onCancel }: ConfirmDeleteModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-bold text-red-600 mb-4">⚠️ Delete Product</h2>
          
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-medium text-gray-800">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.description}</p>
              <p className="text-sm text-gray-600">Current Stock: {product.currentStock}</p>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete Product'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}