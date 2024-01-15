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
import { Cart } from 'src/components/models';

export const useStripeStore = defineStore('stripeStore', () => {
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
    } catch (error) {
      console.error('Erro ao buscar os produtos:', error);
    } finally {
      loadingObj.value.isLoading = false;
    }
  };

  const createCheckoutSession = async (userId: string, cart: Cart) => {
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
          line_items: cart.map((item) => {
            return {
              price: item.priceId,
              quantity: item.quantity,
            };
          }),
          mode: 'payment',
          success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/cancel`,
        },
        { merge: true }
      );

      onSnapshot(checkoutSessionRef, (snap) => {
        const { error, url } = snap.data();
        if (error) {
          alert(`An error occurred
          : ${error.message}`);
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
