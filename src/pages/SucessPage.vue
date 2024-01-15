<template>
  <q-page class="q-py-lg" style="display: grid; align-items: center">
    <section>
      <div class="container">
        <div class="column flex-center">
          <p
            class="text-h2 text-center text-green-8 text-weight-bold"
            :class="$q.screen.gt.xs ? 'text-h2' : 'text-h3'"
          >
            Compra efetuada com sucesso!
          </p>
          <p class="text-subtitle1 text-center">
            Obrigado por comprar conosco!
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
import { useMeta } from 'quasar';

const metaData = {
  // sets document title
  title: 'Eternal Shoes',
  titleTemplate: (title: string) => `${title} - Compra efetuada com sucesso!`,

  meta: {
    description: {
      name: 'description',
      content: 'Obrigado por comprar conosco!',
    },
    keywords: { name: 'keywords', content: 'Quasar website' },
    equiv: {
      'http-equiv': 'Content-Type',
      content: 'text/html; charset=UTF-8',
    },
    ogTitle: {
      property: 'og:title',
      template(ogTitle: string) {
        return `${ogTitle} - Home`;
      },
    },
  },

  // <body> attributes
  bodyAttr: {
    'action-scope': 'xyz', // generates <body action-scope="xyz">
    empty: undefined, // generates <body empty>
  },
};

export default defineComponent({
  name: 'SucessPage',
  setup() {
    useMeta(metaData);
  },
});
</script>
