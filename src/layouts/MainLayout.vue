<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <div class="container">
        <q-toolbar>
          <q-toolbar-title> Eternal Shoes </q-toolbar-title>
          <div>
            <q-btn
              flat
              :label="user ? 'Sair' : 'Entrar'"
              class="q-mr-lg"
              @click="handleClickLogin"
            />
            <q-btn
              flat
              round
              icon="shopping_cart"
              aria-label="Menu"
              @click="toggleLeftDrawer"
            />
          </div>
        </q-toolbar>
      </div>
    </q-header>

    <!-- <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer> -->

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink, {
  EssentialLinkProps,
} from 'components/EssentialLink.vue';
import { useAuthStore } from 'src/stores/auth';
import { storeToRefs } from 'pinia';

const essentialLinks: EssentialLinkProps[] = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev',
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework',
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev',
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev',
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev',
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev',
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev',
  },
];

const { persistLogin, makeLogin, signOut } = useAuthStore();
const { user } = storeToRefs(useAuthStore());

const handleClickLogin = (): void => {
  if (user.value) {
    signOut();
  } else {
    makeLogin();
  }
};

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
