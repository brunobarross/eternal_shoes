import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCartStore = defineStore('cartStore', () => {
  const cart = ref([]);

  return {
    cart,
  };
});
