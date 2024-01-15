<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="q-py-md">
      <div class="container">
        <q-toolbar>
          <q-toolbar-title> Eternal Shoes </q-toolbar-title>
          <div class="row">
            <div
              class="row flex-center"
              :class="$q.screen.lt.sm ? 'q-mr-none' : 'q-mr-lg'"
            >
              <div
                v-if="user?.uid"
                class="row flex-center"
                :class="$q.screen.lt.sm ? 'q-mr-none' : ' q-mr-md'"
              >
                <q-avatar>
                  <img
                    :src="
                      user?.photoURL
                        ? user?.photoURL
                        : 'https://cdn.quasar.dev/img/avatar.png'
                    "
                  />
                </q-avatar>
                <p class="q-ml-sm q-mb-none">
                  Bem vindo, {{ user ? user.displayName : 'visitante' }}
                </p>
              </div>
              <q-btn
                flat
                :label="user ? 'Sair' : 'Entrar'"
                class="q-mr-lg"
                @click="handleClickLogin"
              />
            </div>

            <q-btn
              flat
              round
              icon="shopping_cart"
              aria-label="Menu"
              @click="toggleRightDrawer"
            >
              <q-badge
                v-if="cart.length"
                color="secondary"
                floating
                :label="cart.length"
              />
            </q-btn>
          </div>
        </q-toolbar>
      </div>
    </q-header>
    <CartDrawer
      :cart="cart"
      :right-drawer-open="rightDrawerOpen"
      @update:rightDrawerOpen="rightDrawerOpen = $event"
    />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuthStore } from 'src/stores/auth';
import { storeToRefs } from 'pinia';
import { useCartStore } from 'src/stores/cart';
import CartDrawer from 'components/CartDrawer.vue';

const { persistLogin, makeLogin, signOut } = useAuthStore();
const { user } = storeToRefs(useAuthStore());

const { cart } = storeToRefs(useCartStore());

const handleClickLogin = (): void => {
  if (user.value) {
    signOut();
  } else {
    makeLogin();
  }
};

const rightDrawerOpen = ref(false);

function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value;
}

onMounted(() => {
  persistLogin();
});
</script>
