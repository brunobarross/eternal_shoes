<template>
  <q-card class="card-produto">
    <q-skeleton
      class="card-produto__img"
      type="img"
      style="width: 200px; height: 200px; margin: 16px auto"
    />
    <q-card-section>
      <q-skeleton type="h6" style="height: 32px" />
      <q-skeleton type="p" class="q-mt-md" style="height: 54px" />
      <q-skeleton type="p" style="width: 64px; margin: 16px auto 0 auto" />
    </q-card-section>

    <q-card-actions align="center" class="q-px-none q-py-none q-mt-auto">
      <q-skeleton type="QBtn" class="btn-comprar" />
    </q-card-actions>
  </q-card>
</template>

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
