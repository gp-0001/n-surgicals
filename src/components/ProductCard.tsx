// src/components/ProductCard.tsx
import React from 'react';
import type { Product } from '../types/Product';
import type { UserRole } from '../contexts/AuthContext';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  userRole: UserRole;
}

export default function ProductCard({
  product,
  onClick,
  userRole,
}: ProductCardProps) {
  const isLowStock = product.currentStock <= product.minStockLevel;
  const isOutOfStock = product.currentStock === 0;

  return (
    <div
      onClick={onClick}
      // apply Castellar for everything in this card
      style={{ fontFamily: 'Castellar, serif' }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.jpg';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">📦</div>
              <div className="text-sm">No Image</div>
            </div>
          </div>
        )}

        {/* Stock Status Badge */}
        <div className="absolute top-2 right-2">
          {isOutOfStock ? (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Low Stock
            </span>
          ) : (
            <span className="bg-bay-leaf-400 text-white px-2 py-1 rounded-full text-xs font-semibold">
              In Stock
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <div className="text-xs text-black font-semibold uppercase tracking-wide mb-1">
          {product.category}
        </div>

        {/* Name */}
        <h3 className="text-lg font-semibold text-black mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-gray-700 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Stock and Price */}
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <span className="text-gray-500">Stock: </span>
            <span
              className={`font-semibold ${
                isLowStock ? 'text-red-600' : 'text-bay-leaf-600'
              }`}
            >
              {product.currentStock}
            </span>
          </div>

          <div className="text-lg font-bold text-black">
            ${product.unitPrice.toFixed(2)}
          </div>
        </div>

        {/* Admin-only indicators */}
        {userRole === 'admin' && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Min Stock: {product.minStockLevel}</span>
              <span>ID: {product.id.substring(0, 8)}...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
