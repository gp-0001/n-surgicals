// src/components/StockUpdateModal.tsx
import React, { useState } from 'react';
import type { Product } from '../types/Product';

interface StockUpdateModalProps {
  product: Product;
  onUpdate: (newQuantity: number, reason: string) => Promise<void>;
  onCancel: () => void;
}

export default function StockUpdateModal({ product, onUpdate, onCancel }: StockUpdateModalProps) {
  const [newQuantity, setNewQuantity] = useState(product.currentStock);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const quantityChange = newQuantity - product.currentStock;
  const changeType = quantityChange > 0 ? 'Add' : quantityChange < 0 ? 'Remove' : 'No change';
  const changeColor = quantityChange > 0 ? 'text-green-600' : quantityChange < 0 ? 'text-red-600' : 'text-gray-600';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Please provide a reason for the stock change');
      return;
    }

    setLoading(true);
    try {
      await onUpdate(newQuantity, reason);
    } catch (error) {
      console.error('Error updating stock:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Update Stock</h2>
          
          {/* Product Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-800">{product.name}</h3>
            <p className="text-sm text-gray-600">Current Stock: {product.currentStock}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Quantity
              </label>
              <input
                type="number"
                min="0"
                value={newQuantity}
                onChange={(e) => setNewQuantity(parseInt(e.target.value) || 0)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              
              {/* Change indicator */}
              <div className={`text-sm mt-1 ${changeColor}`}>
                {changeType}: {Math.abs(quantityChange)} units
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Change *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Received shipment, Damaged items removed, Inventory adjustment"
                disabled={loading}
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                disabled={loading || !reason.trim()}
              >
                {loading ? 'Updating...' : 'Update Stock'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}