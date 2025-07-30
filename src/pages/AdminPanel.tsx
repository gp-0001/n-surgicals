// src/pages/AdminPanel.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { productService } from '../services/productService';
import SampleDataSeeder from '../components/SampleDataSeeder';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  currentStock: number;
  minStockLevel: number;
  unitPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

interface StockUpdate {
  productId: string;
  newQuantity: number;
  reason: string;
}

export default function EnhancedAdminPanel() {
  const { userProfile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stockUpdate, setStockUpdate] = useState<StockUpdate | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Medicines',
    currentStock: 0,
    minStockLevel: 5,
    unitPrice: 0
  });

  // Stock update form
  const [stockForm, setStockForm] = useState({
    quantity: 0,
    reason: ''
  });

  useEffect(() => {
    loadProducts();
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

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'Medicines',
      currentStock: 0,
      minStockLevel: 5,
      unitPrice: 0
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;

    try {
      if (editingProduct) {
        // Update existing product
        await productService.updateProduct(editingProduct.id, {
          ...formData,
          imageUrl: ''
        }, userProfile.uid);
        setEditingProduct(null);
      } else {
        // Add new product
        await productService.addProduct({
          ...formData,
          imageUrl: ''
        }, userProfile.uid);
        setShowAddForm(false);
      }
      
      resetForm();
      await loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      currentStock: product.currentStock,
      minStockLevel: product.minStockLevel,
      unitPrice: product.unitPrice
    });
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleStockUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockUpdate || !userProfile || !stockForm.reason.trim()) {
      alert('Please provide a reason for the stock change.');
      return;
    }

    try {
      await productService.updateStock(
        stockUpdate.productId,
        stockForm.quantity,
        stockForm.reason,
        userProfile.uid
      );
      
      setStockUpdate(null);
      setStockForm({ quantity: 0, reason: '' });
      await loadProducts();
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Error updating stock. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    try {
      await productService.deleteProduct(deleteConfirm.id);
      setDeleteConfirm(null);
      await loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['currentStock', 'minStockLevel', 'unitPrice'].includes(name) 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const openStockUpdate = (product: Product) => {
    setStockUpdate({
      productId: product.id,
      newQuantity: product.currentStock,
      reason: ''
    });
    setStockForm({
      quantity: product.currentStock,
      reason: ''
    });
  };

  const lowStockProducts = products.filter(p => p.currentStock <= p.minStockLevel);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-center mt-4">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
          <p className="text-gray-600">Manage your inventory and stock levels</p>
        </div>
        <button
          onClick={() => {
            if (showAddForm && editingProduct) {
              setEditingProduct(null);
              resetForm();
            }
            setShowAddForm(!showAddForm);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showAddForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {/* Sample Data Seeder - only shows if no products */}
      {products.length === 0 && <SampleDataSeeder />}

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-800 mb-2">⚠️ Low Stock Alert ({lowStockProducts.length} items)</h3>
          <div className="text-sm text-red-700 space-y-1">
            {lowStockProducts.map(product => (
              <div key={product.id} className="flex justify-between">
                <span>{product.name}</span>
                <span>{product.currentStock} remaining (min: {product.minStockLevel})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Product Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Medicines">Medicines</option>
                <option value="Medical Equipment">Medical Equipment</option>
                <option value="Surgical Instruments">Surgical Instruments</option>
                <option value="Personal Care">Personal Care</option>
                <option value="First Aid">First Aid</option>
                <option value="Laboratory">Laboratory</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
              <input
                type="number"
                name="currentStock"
                min="0"
                value={formData.currentStock}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Stock Level</label>
              <input
                type="number"
                name="minStockLevel"
                min="0"
                value={formData.minStockLevel}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price ($)</label>
              <input
                type="number"
                name="unitPrice"
                min="0"
                step="0.01"
                value={formData.unitPrice}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product description"
              />
            </div>

            <div className="md:col-span-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingProduct(null);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Products ({products.length})</h2>
        </div>
        
        {products.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-4">📦</div>
            <p>No products yet. Add your first product!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{product.category}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.currentStock <= product.minStockLevel
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {product.currentStock} / {product.minStockLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">${product.unitPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openStockUpdate(product)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Stock
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(product)}
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
        )}
      </div>

      {/* Stock Update Modal */}
      {stockUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Update Stock</h2>
              
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-800">
                  {products.find(p => p.id === stockUpdate.productId)?.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Current Stock: {products.find(p => p.id === stockUpdate.productId)?.currentStock}
                </p>
              </div>

              <form onSubmit={handleStockUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={stockForm.quantity}
                    onChange={(e) => setStockForm(prev => ({...prev, quantity: parseInt(e.target.value) || 0}))}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="text-sm mt-1 text-gray-600">
                    Change: {stockForm.quantity - (products.find(p => p.id === stockUpdate.productId)?.currentStock || 0)} units
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                  <textarea
                    value={stockForm.reason}
                    onChange={(e) => setStockForm(prev => ({...prev, reason: e.target.value}))}
                    rows={3}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Received shipment, Damaged items removed..."
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setStockUpdate(null)}
                    className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Update Stock
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-red-600 mb-4">⚠️ Delete Product</h2>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Are you sure you want to delete this product? This action cannot be undone.
                </p>
                
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="font-medium text-gray-800">{deleteConfirm.name}</h3>
                  <p className="text-sm text-gray-600">{deleteConfirm.description}</p>
                  <p className="text-sm text-gray-600">Current Stock: {deleteConfirm.currentStock}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}