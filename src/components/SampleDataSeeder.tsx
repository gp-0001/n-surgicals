// src/components/SampleDataSeeder.tsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { productService } from '../services/productService';

const sampleProducts = [
  {
    name: "Paracetamol 500mg",
    description: "Pain relief and fever reducer tablets",
    category: "Medicines",
    currentStock: 150,
    minStockLevel: 20,
    unitPrice: 5.99,
    imageUrl: ""
  },
  {
    name: "Digital Thermometer",
    description: "Fast and accurate temperature measurement",
    category: "Medical Equipment",
    currentStock: 25,
    minStockLevel: 5,
    unitPrice: 29.99,
    imageUrl: ""
  },
  {
    name: "Surgical Scissors",
    description: "High-quality stainless steel surgical scissors",
    category: "Surgical Instruments",
    currentStock: 8,
    minStockLevel: 10,
    unitPrice: 45.00,
    imageUrl: ""
  },
  {
    name: "Hand Sanitizer 500ml",
    description: "70% alcohol-based hand sanitizer",
    category: "Personal Care",
    currentStock: 200,
    minStockLevel: 50,
    unitPrice: 8.50,
    imageUrl: ""
  },
  {
    name: "First Aid Kit",
    description: "Complete first aid kit for emergency care",
    category: "First Aid",
    currentStock: 15,
    minStockLevel: 10,
    unitPrice: 35.99,
    imageUrl: ""
  },
  {
    name: "Blood Pressure Monitor",
    description: "Automatic digital blood pressure monitor",
    category: "Medical Equipment",
    currentStock: 12,
    minStockLevel: 5,
    unitPrice: 89.99,
    imageUrl: ""
  },
  {
    name: "Disposable Gloves (Box of 100)",
    description: "Latex-free disposable examination gloves",
    category: "Personal Care",
    currentStock: 3,
    minStockLevel: 15,
    unitPrice: 12.99,
    imageUrl: ""
  },
  {
    name: "Ibuprofen 200mg",
    description: "Anti-inflammatory pain relief tablets",
    category: "Medicines",
    currentStock: 80,
    minStockLevel: 25,
    unitPrice: 7.49,
    imageUrl: ""
  }
];

export default function SampleDataSeeder() {
  const { userProfile, hasRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [seeded, setSeeded] = useState(false);

  const seedData = async () => {
    if (!userProfile || !hasRole('admin')) {
      alert('Only admin users can seed sample data');
      return;
    }

    setLoading(true);
    try {
      console.log('Starting to seed sample data...');
      
      for (const product of sampleProducts) {
        await productService.addProduct(product, userProfile.uid);
        console.log(`Added: ${product.name}`);
      }
      
      setSeeded(true);
      alert(`Successfully added ${sampleProducts.length} sample products!`);
      
      // Refresh the page to show new products
      window.location.reload();
      
    } catch (error) {
      console.error('Error seeding data:', error);
      alert('Error adding sample data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Only show for admin users
  if (!hasRole('admin')) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h3 className="font-semibold text-blue-800 mb-2">🚀 Quick Start</h3>
      <p className="text-blue-700 text-sm mb-3">
        No products yet? Add sample products to get started quickly!
      </p>
      
      <button
        onClick={seedData}
        disabled={loading || seeded}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Adding Products...' : seeded ? 'Sample Data Added!' : 'Add Sample Products'}
      </button>
      
      {loading && (
        <div className="mt-3 text-sm text-blue-600">
          <div className="animate-spin inline-block w-4 h-4 border-2 border-current border-r-transparent rounded-full mr-2"></div>
          Adding {sampleProducts.length} sample products...
        </div>
      )}
    </div>
  );
}