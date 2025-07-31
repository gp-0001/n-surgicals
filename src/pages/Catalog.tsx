// src/pages/Catalog.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { productService } from '../services/productService';
import type { Product } from '../types/Product';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';

export default function Catalog() {
  const { userProfile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    'All',
    'Medicines',
    'Medical Equipment',
    'Surgical Instruments',
    'Personal Care',
    'First Aid',
    'Laboratory'
  ];

  useEffect(() => {
    (async () => {
      try {
        const list = await productService.getAllProducts();
        setProducts(list);
      } catch (err) {
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    let result = products;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }

    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto" />
          <p className="mt-4 text-black/60">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-6">
        {/* Search & Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="flex-1 p-3 border border-black rounded-lg focus:ring-2 focus:ring-black"
            />
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="md:w-64 p-3 border border-black rounded-lg focus:ring-2 focus:ring-black"
            >
              {categories.map(cat => (
                <option key={cat} value={cat === 'All' ? '' : cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid or Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-black/40 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-black/70 mb-2">
              No products found
            </h3>
            <p className="text-black/60">
              {searchTerm || selectedCategory
                ? 'Try adjusting your search or filter criteria.'
                : 'No products are currently available.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => setSelectedProduct(product)}
                userRole={userProfile?.role || 'pharmacist'}
              />
            ))}
          </div>
        )}

        {/* Results Count */}
        <div className="mt-6 text-center text-black/60">
          Showing {filteredProducts.length} of {products.length} products
        </div>

        {/* Detail Modal */}
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            userRole={userProfile?.role || 'pharmacist'}
          />
        )}
      </div>
    </div>
  );
}
