// src/pages/Catalog.tsx
import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import QuantityDrawer from '../components/QuantityDrawer';

const products = [
  { name: 'Paracetamol', image: '/images/paracetamol.jpg' },
  { name: 'Syringe', image: '/images/syringe.jpg' },
  { name: 'Mask', image: '/images/mask.jpg' },
  // …your real data later
];

export default function Catalog() {
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState<typeof products[0] | null>(null);

  const showDrawer = (p: typeof products[0]) => {
    setSel(p);
    setOpen(true);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-bay-leaf-700 mb-6">Catalog</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <ProductCard
            key={p.name}
            name={p.name}
            image={p.image}
            onClick={() => showDrawer(p)}
          />
        ))}
      </div>
      <QuantityDrawer
        isOpen={open}
        onClose={() => setOpen(false)}
        product={sel}
      />
    </div>
  );
}
