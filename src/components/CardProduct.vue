<template>
  <q-card class="my-card">
    <img src="https://cdn.quasar.dev/img/mountains.jpg" />

    <q-card-section class="column justify-center flex items-center">
      <div class="text-h6">{{ product.name }}</div>
      <p class="text-subtitle2 q-mt-sm">{{ product.description }}</p>
      <p class="text-subtitle2 q-ma-none">{{ price }}</p>
    </q-card-section>

    <q-card-actions align="center" class="q-px-none q-pb-none">
      <q-btn color="primary" label="Comprar" class="full-width" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Product } from './models';

interface Props {
  product?: Product;
}
const props = withDefaults(defineProps<Props>(), {
  product: () => ({} as Product),
});

const price = computed(() => props.product.price / 100);
</script>
