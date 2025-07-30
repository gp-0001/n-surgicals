// src/components/LoadingSpinner.tsx
export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bay-leaf-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bay-leaf-600 mx-auto"></div>
        <p className="mt-4 text-bay-leaf-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}