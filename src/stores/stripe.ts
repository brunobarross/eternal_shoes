import {
  collection,
  getDocs,
  setDoc,
  doc,
  where,
  query,
  onSnapshot,
} from 'firebase/firestore';
import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';
import { db } from '../services/firebase';
import { v4 as uuidv4 } from 'uuid';
import { Cart, Product } from 'src/components/models';
import { useStripeStore } from './stripe';

export const useStripeStore = defineStore('stripeStore', () => {
  const { cart } = storeToRefs(useStripeStore());
  const products = ref([]);

  interface LoadingObj {
    isLoading: boolean;
    isLoadingCheckoutSession: boolean;
  }

  const loadingObj = ref<LoadingObj>({
    isLoading: false,
    isLoadingCheckoutSession: false,
  });

  const fetchProducts = async () => {
    loadingObj.value.isLoading = true;
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
    } finally {
      loadingObj.value.isLoading = false;
    }
  };

  const createCheckoutSession = async (userId: string) => {
    loadingObj.value.isLoadingCheckoutSession = true;
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
          line_items: cart.value.map((item) => {
            return {
              price: item.priceId,
              quantity: item.quantity,
            };
          }),
          mode: 'payment',
          success_url: window.location.origin,
          cancel_url: window.location.origin,
        },
        { merge: true }
      );

      onSnapshot(checkoutSessionRef, (snap) => {
        const { error, url } = snap.data();
        if (error) {
          alert(`An error occurred: ${error.message}`);
        }
        if (url) {
          window.location.assign(url);
          loadingObj.value.isLoadingCheckoutSession = false;
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
    loadingObj,
  };
});
