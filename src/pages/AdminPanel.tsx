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
  imageUrl?: string;
}

interface StockUpdate {
  productId: string;
  newQuantity: number;
  reason: string;
}

export default function AdminPanel() {
  const { userProfile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stockUpdate, setStockUpdate] = useState<StockUpdate | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Medicines',
    currentStock: 0,
    minStockLevel: 5,
    unitPrice: 0,
    imageUrl: ''
  });
  const [stockForm, setStockForm] = useState({ quantity: 0, reason: '' });

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

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'Medicines',
      currentStock: 0,
      minStockLevel: 5,
      unitPrice: 0,
      imageUrl: ''
    });
    setImageFile(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(f => ({ ...f, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(f => ({ ...f, imageUrl: '' }));
      setImageFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;
    try {
      if (editingProduct) {
        await productService.updateProduct(
          editingProduct.id,
          { ...formData },
          userProfile.uid
        );
        setEditingProduct(null);
      } else {
        await productService.addProduct(
          { ...formData },
          userProfile.uid
        );
        setShowAddForm(false);
      }
      // Refresh product list after successful add or update
      const updated = await productService.getAllProducts();
      setProducts(updated);
      resetForm();
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Error saving product. Please try again.');
    }
  };

  const handleEdit = (p: Product) => {
    setFormData({
      name: p.name,
      description: p.description,
      category: p.category,
      currentStock: p.currentStock,
      minStockLevel: p.minStockLevel,
      unitPrice: p.unitPrice,
      imageUrl: p.imageUrl || ''
    });
    setEditingProduct(p);
    setShowAddForm(true);
    setImageFile(null);
  };

  const openStockUpdate = (p: Product) => {
    setStockUpdate({ productId: p.id, newQuantity: p.currentStock, reason: '' });
    setStockForm({ quantity: p.currentStock, reason: '' });
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
      const updated = await productService.getAllProducts();
      setProducts(updated);
    } catch (err) {
      console.error('Error updating stock:', err);
      alert('Error updating stock. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await productService.deleteProduct(deleteConfirm.id);
      setDeleteConfirm(null);
      const updated = await productService.getAllProducts();
      setProducts(updated);
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Error deleting product. Please try again.');
    }
  };

  const lowStock = products.filter(p => p.currentStock <= p.minStockLevel);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-spin h-8 w-8 border-b-2 border-black mx-auto"></div>
        <p className="text-center mt-4">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Product Management
          </h1>
          <p className="text-gray-600">
            Manage your inventory and stock levels
          </p>
        </div>
        <button
          onClick={() => {
            if (showAddForm && editingProduct) {
              setEditingProduct(null);
              resetForm();
            }
            setShowAddForm(!showAddForm);
          }}
          className="
             px-4 py-2
             bg-black text-white
             rounded-lg
             hover:bg-gray-800
             focus:outline-none focus:ring-2 focus:ring-black
             transition
          "
        >
          {showAddForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {products.length === 0 && <SampleDataSeeder />}

      {lowStock.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-800 mb-2">
            ⚠️ Low Stock Alert ({lowStock.length} items)
          </h3>
          <div className="text-sm text-red-700 space-y-1">
            {lowStock.map(p => (
              <div key={p.id} className="flex justify-between">
                <span>{p.name}</span>
                <span>
                  {p.currentStock} remaining (min: {p.minStockLevel})
                </span>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                name="name"
                required
                value={formData.name}
                onChange={e =>
                  setFormData(f => ({ ...f, name: e.target.value }))
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={e =>
                  setFormData(f => ({ ...f, category: e.target.value }))
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option>Medicines</option>
                <option>Medical Equipment</option>
                <option>Surgical Instruments</option>
                <option>Personal Care</option>
                <option>First Aid</option>
                <option>Laboratory</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Stock
              </label>
              <input
                type="number"
                name="currentStock"
                min="0"
                value={formData.currentStock}
                onChange={e =>
                  setFormData(f => ({
                    ...f,
                    currentStock: parseInt(e.target.value, 10) || 0
                  }))
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Stock Level
              </label>
              <input
                type="number"
                name="minStockLevel"
                min="0"
                value={formData.minStockLevel}
                onChange={e =>
                  setFormData(f => ({
                    ...f,
                    minStockLevel: parseInt(e.target.value, 10) || 0
                  }))
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit Price ($)
              </label>
              <input
                type="number"
                name="unitPrice"
                min="0"
                step="0.01"
                value={formData.unitPrice}
                onChange={e =>
                  setFormData(f => ({
                    ...f,
                    unitPrice: parseFloat(e.target.value) || 0
                  }))
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={e =>
                  setFormData(f => ({ ...f, description: e.target.value }))
                }
                rows={3}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product description"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {formData.imageUrl && (
                <div className="mt-2">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded"
                  />
                </div>
              )}
            </div>
            <div className="md:col-span-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingProduct(null);
                  resetForm();
                }}
                className="
                  px-4 py-2 text-gray-600 border
                  rounded-lg hover:bg-gray-50
                  transition
                "
              >
                Cancel
              </button>
              <button
                type="submit"
                className="
                      px-4 py-2
                      bg-black text-white
                      rounded-lg
                      hover:bg-gray-800
                      focus:outline-none focus:ring-2 focus:ring-black
                      transition
                "
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{p.name}</div>
                      <div className="text-sm text-gray-500">{p.description}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{p.category}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          p.currentStock <= p.minStockLevel
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {p.currentStock} / {p.minStockLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ${p.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="text-[#0a1b5c] hover:text-[#0a1b5c] transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openStockUpdate(p)}
                        className="text-green-600 hover:text-green-900 transition"
                      >
                        Stock
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(p)}
                        className="text-red-500 hover:text-red-700 transition"
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
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Update Stock
              </h2>
              <form onSubmit={handleStockUpdate} className="space-y-4">
                {/* ... */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setStockUpdate(null)}
                    className="
                      px-4 py-2 text-gray-600 border
                      rounded-lg hover:bg-gray-50
                      transition
                    "
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="
                       px-4 py-2
                      bg-black text-white
                      rounded-lg
                      hover:bg-gray-800
                      focus:outline-none focus:ring-2 focus:ring-black
                      transition
                    "
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
              <h2 className="text-xl font-bold text-red-600 mb-4">
                ⚠️ Delete Product
              </h2>
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Are you sure you want to delete this product? This action cannot be undone.
                </p>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="font-medium text-gray-800">{deleteConfirm.name}</h3>
                  <p className="text-sm text-gray-600">{deleteConfirm.description}</p>
                  <p className="text-sm text-gray-600">
                    Current Stock: {deleteConfirm.currentStock}
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="
                    px-4 py-2 text-gray-600 border
                    rounded-lg hover:bg-gray-50
                    transition
                  "
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="
                    px-4 py-2 bg-red-500 text-white
                    rounded-lg hover:bg-red-600
                    focus:outline-none focus:ring-2 focus:ring-red-500
                    transition
                  "
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