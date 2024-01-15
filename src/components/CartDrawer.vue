<template>
  <q-dialog
    :model-value="rightDrawerOpen"
    position="right"
    full-height
    maximized
    @hide="() => $emit('update:rightDrawerOpen', false)"
  >
    <q-card class="column card-carrinho">
      <div class="row justify-between">
        <h3 class="q-ma-md text-h6">Carrinho</h3>
        <q-btn
          v-if="$q.screen.lt.sm"
          flat
          round
          dense
          icon="close"
          class="q-ma-md"
          @click="() => $emit('update:rightDrawerOpen', false)"
        />
      </div>

      <q-list>
        <template v-if="cart.length">
          <CartItem
            v-for="item in cart"
            :key="item.priceId"
            :cart-item="item"
            @click:remove="handleClickRemove"
          />
        </template>
        <template v-else>
          <q-item class="q-pa-md">
            <q-item-section>
              <q-item-label caption>
                <p class="q-mb-none q-mt-none q-ma-none text-h6">
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
          label="Ir para pagamento"
          :loading="loadingObj.isLoadingCheckoutSession"
          color="primary"
          class="full-width"
          :size="$q.screen.lt.sm ? 'md' : 'lg'"
          :disabled="!cart.length"
          @click="handleClickComprar"
        />
      </div>
    </q-card>
  </q-dialog>
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
const { removeFromCart } = useCartStore();
const { loadingObj } = storeToRefs(useStripeStore());

interface Props {
  rightDrawerOpen: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  rightDrawerOpen: false,
});

const total = computed(() => {
  if (!cart.value.length) return '0,00';
  return (
    cart.value.reduce((acc, curr) => {
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
  await createCheckoutSession(userId, cart.value);
};

const handleClickRemove = (priceId: string) => {
  removeFromCart(priceId);
};
</script>

<style scoped lang="scss">
.card-carrinho {
  width: 60vw;
  max-width: 600px;
  @media (max-width: $breakpoint-xs-max) {
    width: 100vw;
  }
}
</style>
