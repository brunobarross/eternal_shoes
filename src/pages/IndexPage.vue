<template>
  <q-page class="q-py-lg" style="display: grid; align-items: center">
    <section>
      <div class="container">
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
              @click:buy="handleClickComprar"
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

export default defineComponent({
  name: 'IndexPage',
  components: {
    CardProduct,
    CardProductSkeleton,
  },
  setup() {
    const { persistLogin } = useAuthStore();
    const { user } = storeToRefs(useAuthStore());

    const { fetchProducts, createCheckoutSession } = useStripeStore();

    const { products, loadingObj } = storeToRefs(useStripeStore());

    const handleClickComprar = async (priceId: string, sessionId: string) => {
      const userId = user.value?.uid;
      if (!userId) {
        throw new Error('User ID is required');
      }
      await createCheckoutSession(userId, priceId);
    };

    watch(
      () => products,
      (v) => {
        console.log(v);
      },
      {
        immediate: true,
      }
    );

    onMounted(async () => {
      await persistLogin();
      await fetchProducts();
    });

    return {
      persistLogin,
      user,
      products,
      handleClickComprar,
      loadingObj,
    };
  },
});
</script>

<style lang="scss">
.cards-wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
  @media (max-width: $breakpoint-xs-max) {
    margin-top: 4rem;
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
