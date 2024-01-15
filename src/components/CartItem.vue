<template>
  <q-item bordered class="q-pa-md card-carrinho">
    <q-item-section top avatar>
      <q-img :src="produtoAtual?.images" class="q-ml-sm" />
    </q-item-section>

    <q-item-section>
      <q-item-label>
        <h3
          class="q-mb-none q-mt-none q-ma-none text-subtitle2 elipsis-1-lines"
        >
          {{ produtoAtual?.name }}
        </h3>
        <p class="q-mt-md text-body2">Quantidade: {{ cartItem?.quantity }}</p>
      </q-item-label>
    </q-item-section>

    <q-item-section side center>
      <q-item-label caption>
        <p class="q-mb-none q-mt-none q-ma-none text-body2">
          R$ {{ price.replace('.', ',') }}
          <q-btn
            flat
            round
            icon="delete"
            color="negative"
            aria-label="Menu"
            @click="$emit('click:remove', cartItem?.priceId)"
          /></p
      ></q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Product, Cart } from './models';
import { useStripeStore } from 'src/stores/stripe';
import { storeToRefs } from 'pinia';

const { products } = storeToRefs(useStripeStore());

interface Props {
  cartItem?: Cart;
  loading?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  cartItem: () => ({} as Cart),
  loading: false,
});

const emits = defineEmits(['click:remove']);

const produtoAtual = computed(() =>
  products.value.find((p: Product) => p.id === props.cartItem.productId)
);

const price = computed(() => (produtoAtual.value?.price / 100).toFixed(2));
</script>

<style scoped lang="scss">
.card-carrinho {
  &:not(:last-child) {
    border-bottom: 1px solid $grey-3;
  }
}
</style>
