<script lang="ts" setup>
  type Props = {
    isLoading: boolean;
  };
  defineProps<Props>();
</script>

<template>
  <main class="layout">
    <Header :is-loading="isLoading" />
    <div class="main" v-if="$slots.main">
      <slot name="main" />
    </div>

    <div class="bottom" v-if="$slots.bottom">
      <slot name="bottom" />
    </div>
  </main>
</template>

<style scoped>
  .layout {
    display: flex;
    flex-flow: column nowrap;
    min-height: 100vh;
    min-height: 100dvh;
    text-align: center;
  }

  .main {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 3.2rem 2rem;
    margin-top: 1.6rem;
  }

  .bottom {
    flex: 0 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 3.2rem;
    margin-top: auto;
    padding: 1.6rem 2rem 0 2rem;
  }
</style>