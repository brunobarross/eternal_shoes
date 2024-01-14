<template>
  <q-drawer
    v-model="leftDrawerOpen"
    :width="400"
    show-if-above
    bordered
    content-class="bg-grey-1"
    class="flex column"
  >
    <q-list>
      <template v-if="cart.length">
        <CartItem v-for="item in cart" :key="item.id" :cart-item="item" />
      </template>
      <template v-else>
        <q-item class="q-pa-md">
          <q-item-section>
            <q-item-label caption>
              <p class="q-mb-none q-mt-none q-ma-none text-body2">
                Seu carrinho está vazio
              </p>
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-list>
    <div class="q-px-md q-pb-lg q-mt-auto">
      <div>
        <p class="text-h6">Total: R$ {{ total.replace('.', ',') }}</p>
      </div>
      <q-btn
        label="Comprar"
        color="primary"
        class="full-width"
        :disable="!cart.length"
        @click="handleClickComprar"
      />
    </div>
  </q-drawer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAuthStore } from 'src/stores/auth';
import { storeToRefs } from 'pinia';
import { useCartStore } from 'src/stores/cart';
import CartItem from 'components/CartItem.vue';
import { useStripeStore } from 'src/stores/stripe';
const { user } = storeToRefs(useAuthStore());

const { cart } = storeToRefs(useCartStore());
const { createCheckoutSession } = useStripeStore();

const leftDrawerOpen = ref(false);

const total = computed(() => {
  if (!cart.value.length) return '0,00';

  return (
    cart.value.reduce((acc, curr) => {
      console.log(acc, curr);
      return acc + curr.price * curr.quantity;
    }, 0) / 100
  ).toFixed(2);
});

const handleClickComprar = async () => {
  const userId = user.value?.uid;
  if (!cart.value.length) {
    throw new Error('Cart is empty');
  }
  if (!userId) {
    throw new Error('User ID is required');
  }
  await createCheckoutSession(userId);
};
</script>
