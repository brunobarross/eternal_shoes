import {
  collection,
  getDocs,
  setDoc,
  doc,
  getDoc,
  where,
  query,
} from 'firebase/firestore';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db } from '../services/firebase';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import axios from 'axios';
import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

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

  const createCheckoutSession = async (
    userId: string,
    priceId: string,
    sessionId: string
  ) => {
    try {
      console.log(userId, priceId, sessionId);
      const checkoutSessionRef = doc(
        db,
        'customers',
        userId,
        'checkout_sessions',
        sessionId
      );

      await setDoc(
        checkoutSessionRef,
        {
          mode: 'payment',
          price: priceId,
          success_url: window.location.origin,
          cancel_url: window.location.origin,
        },
        { merge: true }
      );

      const snap = await getDoc(checkoutSessionRef);
      console.log(snap.data());
      const { sessionId: id } = snap.data() as { sessionId: string };
      const stripe = await loadStripe(process.env.STRIPE_PUBLIC_KEY as string);
      await stripe?.redirectToCheckout({ sessionId: id });
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
