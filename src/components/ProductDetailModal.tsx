// src/components/ProductDetailModal.tsx
import React, { useState, useEffect } from 'react';
import type { Product, StockTransaction } from '../types/Product';
import type { UserRole } from '../contexts/AuthContext';
import { productService } from '../services/productService';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  userRole: UserRole;
}

export default function ProductDetailModal({ product, onClose, userRole }: ProductDetailModalProps) {
  const [stockHistory, setStockHistory] = useState<StockTransaction[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const isLowStock = product.currentStock <= product.minStockLevel;
  const isOutOfStock = product.currentStock === 0;

  useEffect(() => {
    if (showHistory && userRole === 'admin') {
      loadStockHistory();
    }
  }, [showHistory, userRole, product.id]);

  const loadStockHistory = async () => {
    setLoadingHistory(true);
    try {
      const history = await productService.getStockHistory(product.id);
      setStockHistory(history);
    } catch (error) {
      console.error('Error loading stock history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full mt-1">
                {product.category}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Product Image */}
          <div className="mb-6">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.jpg';
                }}
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-6xl mb-2">📦</div>
                  <div>No Image Available</div>
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Product Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-600">Description:</span>
                  <p className="text-gray-800">{product.description || 'No description available'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Price:</span>
                  <span className="text-xl font-bold text-blue-600 ml-2">
                    ${product.unitPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Stock Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Stock Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Stock:</span>
                  <span className={`font-semibold ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>
                    {product.currentStock} units
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Minimum Level:</span>
                  <span className="text-gray-800">{product.minStockLevel} units</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-semibold ${
                    isOutOfStock ? 'text-red-600' : isLowStock ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Admin-only sections */}
          {userRole === 'admin' && (
            <>
              {/* Timestamps */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Admin Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Created:</span>
                    <span className="text-gray-800 ml-2">{formatDate(product.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="text-gray-800 ml-2">{formatDate(product.updatedAt)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Product ID:</span>
                    <span className="text-gray-800 ml-2 font-mono text-xs">{product.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Created By:</span>
                    <span className="text-gray-800 ml-2 font-mono text-xs">{product.createdBy}</span>
                  </div>
                </div>
              </div>

              {/* Stock History */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Stock History</h3>
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {showHistory ? 'Hide History' : 'Show History'}
                  </button>
                </div>

                {showHistory && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    {loadingHistory ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-sm text-gray-600 mt-2">Loading history...</p>
                      </div>
                    ) : stockHistory.length === 0 ? (
                      <p className="text-gray-600 text-center py-4">No stock transactions found</p>
                    ) : (
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {stockHistory.map((transaction) => (
                          <div key={transaction.id} className="bg-white rounded p-3 text-sm">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                  transaction.type === 'ADD' ? 'bg-green-100 text-green-800' :
                                  transaction.type === 'REMOVE' ? 'bg-red-100 text-red-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {transaction.type}
                                </span>
                                <span className="ml-2 text-gray-600">
                                  {transaction.quantity} units
                                </span>
                              </div>
                              <span className="text-xs text-gray-500">
                                {formatDate(transaction.performedAt)}
                              </span>
                            </div>
                            <div className="mt-1 text-gray-600">
                              {transaction.previousStock} → {transaction.newStock} units
                            </div>
                            <div className="mt-1 text-gray-700">
                              Reason: {transaction.reason}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Close Button */}
          <div className="flex justify-end pt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}