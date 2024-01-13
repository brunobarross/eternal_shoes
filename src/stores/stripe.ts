import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db } from '../services/firebase';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import axios from 'axios';
import Stripe from 'stripe';

export const useStripeStore = defineStore('stripeStopre', () => {
  const products = ref([]);

  const fetchProducts = async () => {
    try {
      const productsCollection = collection(db, 'products');
      const productsSnapshot = await getDocs(productsCollection);

      const productsPromises = productsSnapshot.docs.map(async (productDoc) => {
        const productInfo = productDoc.data();

        // Fetch prices subcollection per product
        const pricesCollection = collection(productDoc.ref, 'prices');
        const priceQuerySnapshot = await getDocs(pricesCollection);

        // Assume there is only one price per product
        const priceDoc = priceQuerySnapshot.docs[0];
        productInfo['price'] = priceDoc.data().unit_amount;

        return {
          id: productDoc.id,
          ...productInfo,
        };
      });

      products.value = await Promise.all(productsPromises);
      console.log(products.value);
    } catch (error) {
      console.error('Erro ao buscar os produtos:', error);
    }
  };

  return {
    products,
    fetchProducts,
  };
});
