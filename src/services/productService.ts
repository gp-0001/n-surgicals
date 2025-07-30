// src/services/productService.ts
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  where,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Product, StockTransaction, ProductFormData } from '../types/Product';

export class ProductService {
  private productsCollection = collection(db, 'products');
  private stockTransactionsCollection = collection(db, 'stockTransactions');

  // Get all products
  async getAllProducts(): Promise<Product[]> {
    try {
      const q = query(this.productsCollection, orderBy('name'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Product[];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Get single product
  async getProduct(id: string): Promise<Product | null> {
    try {
      const docRef = doc(this.productsCollection, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
        } as Product;
      }
      return null;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  // Add new product
  async addProduct(productData: ProductFormData, userId: string): Promise<string> {
    try {
      const newProduct = {
        ...productData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: userId,
      };

      const docRef = await addDoc(this.productsCollection, newProduct);
      
      // Log initial stock if > 0
      if (productData.currentStock > 0) {
        await this.logStockTransaction({
          productId: docRef.id,
          type: 'ADD',
          quantity: productData.currentStock,
          previousStock: 0,
          newStock: productData.currentStock,
          reason: 'Initial stock',
          performedBy: userId,
          performedAt: new Date()
        });
      }

      return docRef.id;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  }

  // Update product
  async updateProduct(id: string, productData: Partial<ProductFormData>, userId: string): Promise<void> {
    try {
      const docRef = doc(this.productsCollection, id);
      await updateDoc(docRef, {
        ...productData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Delete product
  async deleteProduct(id: string): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      // Delete product
      const productRef = doc(this.productsCollection, id);
      batch.delete(productRef);
      
      // Delete related stock transactions
      const transactionsQuery = query(
        this.stockTransactionsCollection, 
        where('productId', '==', id)
      );
      const transactionsSnapshot = await getDocs(transactionsQuery);
      
      transactionsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Update stock quantity
  async updateStock(
    productId: string, 
    newQuantity: number, 
    reason: string, 
    userId: string
  ): Promise<void> {
    try {
      // Get current product data
      const product = await this.getProduct(productId);
      if (!product) throw new Error('Product not found');

      const previousStock = product.currentStock;
      const quantityChange = newQuantity - previousStock;
      const transactionType: 'ADD' | 'REMOVE' | 'ADJUST' = 
        quantityChange > 0 ? 'ADD' : quantityChange < 0 ? 'REMOVE' : 'ADJUST';

      // Update product stock
      const productRef = doc(this.productsCollection, productId);
      await updateDoc(productRef, {
        currentStock: newQuantity,
        updatedAt: serverTimestamp(),
      });

      // Log stock transaction
      await this.logStockTransaction({
        productId,
        type: transactionType,
        quantity: Math.abs(quantityChange),
        previousStock,
        newStock: newQuantity,
        reason,
        performedBy: userId,
        performedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  }

  // Log stock transaction
  private async logStockTransaction(transaction: Omit<StockTransaction, 'id'>): Promise<void> {
    try {
      await addDoc(this.stockTransactionsCollection, {
        ...transaction,
        performedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error logging stock transaction:', error);
      throw error;
    }
  }

  // Get stock history for a product
  async getStockHistory(productId: string): Promise<StockTransaction[]> {
    try {
      const q = query(
        this.stockTransactionsCollection,
        where('productId', '==', productId),
        orderBy('performedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        performedAt: doc.data().performedAt?.toDate() || new Date(),
      })) as StockTransaction[];
    } catch (error) {
      console.error('Error fetching stock history:', error);
      throw error;
    }
  }

  // Get low stock products
  async getLowStockProducts(): Promise<Product[]> {
    try {
      const products = await this.getAllProducts();
      return products.filter(product => product.currentStock <= product.minStockLevel);
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      throw error;
    }
  }
}

export const productService = new ProductService();