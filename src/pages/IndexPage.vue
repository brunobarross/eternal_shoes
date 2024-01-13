<template>
  <q-page class="container flex flex-center">
    <main>
      <q-btn
        color="primary"
        label="Go to About page"
        @click="handleClickLogin"
      />
      <div class="cards-wrapper">
        <template v-if="!products.length">
          <q-spinner-gears size="100px" color="primary" />
        </template>
        <template v-else>
          <CardProduct
            v-for="item in (products as Product)"
            :key="item.id"
            :product="item"
          />
        </template>
      </div>
    </main>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from 'vue';
import CardProduct from 'components/CardProduct.vue';
import { useAuthStore } from 'src/stores/auth';
import { storeToRefs } from 'pinia';
import { useStripeStore } from 'src/stores/stripe';
import { Product } from 'src/stores/stripe/models';

export default defineComponent({
  name: 'IndexPage',
  components: {
    CardProduct,
  },
  setup() {
    const { persistLogin, makeLogin, signOut } = useAuthStore();
    const { user } = storeToRefs(useAuthStore());

    const { fetchProducts, createCheckoutSession } = useStripeStore();

    const { products } = storeToRefs(useStripeStore());

    const handleClickLogin = (): void => {
      if (user.value) {
        signOut();
      } else {
        makeLogin();
      }
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
      handleClickLogin,
      products,
    };
  },
});
</script>

<style lang="scss">
.cards-wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1rem;
}
</style>
