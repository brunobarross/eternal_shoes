<template>
  <q-page class="q-py-lg" style="display: grid; align-items: center">
    <section :style="{ marginTop: $q.screen.lt.sm ? '2rem' : '' }">
      <div class="container">
        <h3 class="text-h4 q-ma-none">Produtos</h3>
        <p class="text-subtitle1 q-mt-sm">
          Conheça nossos produtos e adquira já o seu!
        </p>
        <div class="cards-wrapper">
          <template v-if="!products.length && loadingObj.isLoading">
            <CardProductSkeleton v-for="i in 3" :key="i" />
          </template>
          <template v-else>
            <CardProduct
              v-for="item in (products as Product)"
              :key="item.id"
              :product="item"
              :loading="loadingObj.isLoadingCheckoutSession"
              @click:cart="handleClickAddToCart"
            />
          </template>
        </div>
      </div>
    </section>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, ref } from 'vue';
import CardProduct from 'components/CardProduct.vue';
import CardProductSkeleton from 'components/CardProductSkeleton.vue';
import { useAuthStore } from 'src/stores/auth';
import { storeToRefs } from 'pinia';
import { useStripeStore } from 'src/stores/stripe';
import { Product } from 'src/stores/stripe/models';
import { useCartStore } from 'src/stores/cart';

export default defineComponent({
  name: 'IndexPage',
  components: {
    CardProduct,
    CardProductSkeleton,
  },
  setup() {
    const { persistLogin } = useAuthStore();
    const { user } = storeToRefs(useAuthStore());

    const { fetchProducts } = useStripeStore();

    const { products, loadingObj } = storeToRefs(useStripeStore());

    const { addToCart } = useCartStore();

    const { cart } = storeToRefs(useCartStore());

    const handleClickAddToCart = (priceId: string, productId: string) => {
      if (productId && priceId) addToCart(priceId, productId);
    };

    onMounted(async () => {
      await persistLogin();
      await fetchProducts();
    });

    return {
      persistLogin,
      user,
      products,
      loadingObj,
      addToCart,
      cart,
      handleClickAddToCart,
    };
  },
});
</script>

<style lang="scss">
.cards-wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
  margin-top: 3rem;
  @media (max-width: $breakpoint-xs-max) {
    margin-top: 2rem;
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
