<template>
  <q-card class="card-produto">
    <img
      class="card-produto__img q-pa-md"
      :src="
        product.images.length
          ? product.images
          : 'https://placehold.co/600x400/EEE/31343C'
      "
    />
    <q-card-section class="column justify-center flex items-center text-center">
      <div class="text-h6">{{ product.name }}</div>
      <p class="text-body2 q-mt-sm ellipsis-2-lines">
        {{ product.description }}
      </p>
      <p class="text-subtitle2 q-ma-none">R$ {{ price.replace('.', ',') }}</p>
    </q-card-section>

    <q-card-actions align="center" class="q-px-none q-pb-none q-mt-auto">
      <q-btn
        :loading="loading"
        color="primary"
        label="Adicionar ao carrinho"
        class="btn-comprar"
        @click="() => $emit('click:cart', product.priceId, product.id)"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Product } from './models';

interface Props {
  product?: Product;
  loading?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  product: () => ({} as Product),
  loading: false,
});

const emits = defineEmits(['click:cart']);

const price = computed(() => (props.product.price / 100).toFixed(2));
</script>

<style lang="scss" scoped>
.card-produto {
  display: flex;
  flex-direction: column;

  &__img {
    width: 200px;
    height: 200px;
    object-fit: cover;
    margin: 0 auto;
    @media (max-width: $breakpoint-xs-max) {
      width: 200px;
      height: 200px;
    }
  }
  .btn-comprar {
    width: 100%;
    height: 3rem;
  }
}
</style>
