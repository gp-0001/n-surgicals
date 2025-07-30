// src/components/AdminProductManagement.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { productService } from '../services/productService';
import type { Product, ProductFormData } from '../types/Product';
import ProductForm from './ProductForm';
import StockUpdateModal from './StockUpdateModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

export default function AdminProductManagement() {
  const { userProfile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stockUpdateProduct, setStockUpdateProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts();
    loadLowStockProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const productList = await productService.getAllProducts();
      setProducts(productList);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLowStockProducts = async () => {
    try {
      const lowStock = await productService.getLowStockProducts();
      setLowStockProducts(lowStock);
    } catch (error) {
      console.error('Error loading low stock products:', error);
    }
  };

  const handleAddProduct = async (productData: ProductFormData) => {
    try {
      if (!userProfile) return;
      await productService.addProduct(productData, userProfile.uid);
      await loadProducts();
      await loadLowStockProducts();
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleUpdateProduct = async (productData: ProductFormData) => {
    try {
      if (!editingProduct || !userProfile) return;
      await productService.updateProduct(editingProduct.id, productData, userProfile.uid);
      await loadProducts();
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      if (!deleteProduct) return;
      await productService.deleteProduct(deleteProduct.id);
      await loadProducts();
      await loadLowStockProducts();
      setDeleteProduct(null);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleStockUpdate = async (newQuantity: number, reason: string) => {
    try {
      if (!stockUpdateProduct || !userProfile) return;
      await productService.updateStock(stockUpdateProduct.id, newQuantity, reason, userProfile.uid);
      await loadProducts();
      await loadLowStockProducts();
      setStockUpdateProduct(null);
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          + Add Product
        </button>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-800 mb-2">⚠️ Low Stock Alert</h3>
          <div className="text-sm text-red-700">
            {lowStockProducts.map(product => (
              <div key={product.id} className="flex justify-between">
                <span>{product.name}</span>
                <span>{product.currentStock} remaining (min: {product.minStockLevel})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 rounded-lg object-cover"
                      src={product.imageUrl || '/placeholder.jpg'}
                      alt={product.name}
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    product.currentStock <= product.minStockLevel
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {product.currentStock}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${product.unitPrice.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setStockUpdateProduct(product)}
                    className="text-green-600 hover:text-green-900"
                  >
                    Stock
                  </button>
                  <button
                    onClick={() => setDeleteProduct(product)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showAddForm && (
        <ProductForm
          onSubmit={handleAddProduct}
          onCancel={() => setShowAddForm(false)}
          title="Add New Product"
        />
      )}

      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleUpdateProduct}
          onCancel={() => setEditingProduct(null)}
          title="Edit Product"
        />
      )}

      {stockUpdateProduct && (
        <StockUpdateModal
          product={stockUpdateProduct}
          onUpdate={handleStockUpdate}
          onCancel={() => setStockUpdateProduct(null)}
        />
      )}

      {deleteProduct && (
        <ConfirmDeleteModal
          product={deleteProduct}
          onConfirm={handleDeleteProduct}
          onCancel={() => setDeleteProduct(null)}
        />
      )}
    </div>
  );
}