import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';
import { Cart, Product } from 'src/components/models';
import { useStripeStore } from './stripe';

export const useCartStore = defineStore('cartStore', () => {
  const cart = ref<Cart[]>([]);

  const { products } = storeToRefs(useStripeStore());

  const addToCart = (priceId: string, productId: string) => {
    if (!priceId) return;

    const produtoAtual = cart.value.find(
      (item: Cart) => item.priceId === priceId
    );
    if (produtoAtual) {
      produtoAtual.quantity++;
      return;
    }

    const produtoStripeAtual = products.value.find(
      (item: Product) => item.priceId === priceId
    );

    cart.value.push({
      priceId,
      productId,
      quantity: 1,
      price: produtoStripeAtual?.price || 0,
    });
  };

  return {
    cart,
    addToCart,
  };
});
