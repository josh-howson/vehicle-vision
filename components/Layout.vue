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
    --bg-opacity: .7;
    display: flex;
    flex-flow: column nowrap;
    min-height: 100vh;
    min-height: 100dvh;
    text-align: center;
    background-image: linear-gradient(rgba(255, 255, 255, calc(1 - var(--bg-opacity))), rgba(255, 255, 255, calc(1 - var(--bg-opacity)))), url('/wave-dots.png');
    background-size: auto 60rem;
    background-repeat: no-repeat;
    background-position: center 60vh;
  }

  @media (min-width: 64rem) {
    .layout {
      --bg-opacity: .21;
      background-size: cover;
      background-position: center 50vh;
    }
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