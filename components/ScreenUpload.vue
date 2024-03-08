<script lang="ts" setup>
  import IconShoppingCart from '@/assets/svg/IconShoppingCart.vue';
  import IconRVTrader from '@/assets/svg/IconRVTrader.vue';
  import IconCycleTrader from '@/assets/svg/IconCycleTrader.vue';
  import IconCarsales from '@/assets/svg/IconCarsales.vue';
  import IconPlus from '@/assets/svg/IconPlus.vue';

  type Emits = (e: 'click-upload', payload: 'file' | 'capture') => void;
  const emit = defineEmits<Emits>();
</script>

<template>
  <div class="ai-powered">
    <div class="cart-icon">
      <IconShoppingCart fill="var(--color-primary)" />
    </div>

    <span>Powered by AI</span>
  </div>

  <div class="explainer">
    <h1>What are you shopping for?</h1>

    <p>Take a picture of an RV, motorcycle, or car you’re interested in, and we’ll find matching listings for sale just for you.</p>

    <div class="brands">
      <IconRVTrader />

      <IconCycleTrader />

      <IconCarsales />
    </div>
  </div>

  <div class="upload">
    <button
      class="upload-button button-primary icon-only"
      aria-label="Upload an image"
      @click="emit('click-upload', 'file')"
    >
      <IconPlus />
    </button>

    <button
      class="upload-button button-primary icon-only"
      aria-label="Upload an image"
      @click="emit('click-upload', 'capture')"
    >
      <IconPlus />
    </button>

    <h2>Upload a photo</h2>
  </div>
</template>

<style scoped>
  .ai-powered {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: .4rem;
    font-size: 1.2rem;
    margin-top: 3.2rem;
    color: var(--color-on-surface)
  }

  .cart-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--color-secondary);
    border-radius: 999rem;
    height: 3rem;
    width: 3rem;
  }

  .cart-icon svg {
    height: 100%;
    width: 100%;
    color: var(--color-primary)
  }

  .explainer {
    margin-top: 1.6rem;
  }

  .explainer p {
    margin-top: 1.6rem;
  }

  .brands {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: center;
    gap: 3.2rem;
    margin-top: 1.6rem;
  }

  .brands svg {
    fill: #B6B6B6;
    height: 3.2rem;
    width: auto;
  }

  .upload {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    gap: 1.6rem;
    padding: calc(50vh - 25rem) 0;
    padding: calc(50dvh - 25rem) 0;
    height: 100%;
  }

  .upload h2 {
    font-size: 2.4rem;
  }

  .upload-button svg {
    width: 100%;
    height: 100%;
  }
</style>
