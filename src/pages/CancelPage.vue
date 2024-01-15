<template>
  <q-page class="q-py-lg" style="display: grid; align-items: center">
    <section>
      <div class="container">
        <div class="column flex-center">
          <p
            class="text-h2 text-center text-negative text-weight-bold"
            :class="$q.screen.gt.xs ? 'text-h2' : 'text-h3'"
          >
            O pedido foi cancelado!
          </p>
          <p class="text-subtitle1 text-center">
            Você pode tentar novamente ou entrar em contato com o suporte.
          </p>
          <q-btn
            class="q-mt-md"
            color="primary"
            label="Voltar para a loja"
            to="/"
          />
        </div>
      </div>
    </section>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'SucessPage',
});
</script>
