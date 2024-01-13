import {
  collection,
  getDocs,
  setDoc,
  doc,
  getDoc,
  where,
  query,
  onSnapshot,
} from 'firebase/firestore';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db } from '../services/firebase';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import axios from 'axios';
import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';
import { v4 as uuidv4 } from 'uuid';
export const useStripeStore = defineStore('stripeStopre', () => {
  const products = ref([]);

  const fetchProducts = async () => {
    try {
      const productsCollection = query(
        collection(db, 'products'),
        where('active', '==', true)
      );

      const productsSnapshot = await getDocs(productsCollection);

      const productsPromises = productsSnapshot.docs.map(async (productDoc) => {
        const productInfo = productDoc.data();

        // Fetch prices subcollection per product
        const pricesCollection = query(
          collection(productDoc.ref, 'prices'),
          where('active', '==', true)
        );

        const priceQuerySnapshot = await getDocs(pricesCollection);

        // Assume there is only one price per product
        const priceDoc = priceQuerySnapshot?.docs[0];
        productInfo['price'] = priceDoc.data().unit_amount;
        productInfo['priceId'] = priceDoc.id;

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

  const createCheckoutSession = async (userId: string, priceId: string) => {
    try {
      const uuid = uuidv4();
      const checkoutSessionRef = doc(
        db,
        'customers',
        userId,
        'checkout_sessions',
        uuid
      );

      await setDoc(
        checkoutSessionRef,
        {
          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          mode: 'payment',
          price: priceId,
          success_url: window.location.origin,
          cancel_url: window.location.origin,
        },
        { merge: true }
      );

      onSnapshot(checkoutSessionRef, (snap) => {
        const { error, url } = snap.data();
        console.log('url', url);
        if (error) {
          alert(`An error occurred: ${error.message}`);
        }
        if (url) {
          window.location.assign(url);
        }
      });
    } catch (err) {
      console.error('Erro ao criar sessão checkout:', err);
    }
  };

  return {
    products,
    fetchProducts,
    createCheckoutSession,
  };
});
