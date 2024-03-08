<script lang="ts" setup>
  import IconError from '@/assets/svg/IconError.vue';

  type Props = {
    src: string;
    stars?: boolean;
    error?: boolean;
  };

  defineProps<Props>();
</script>

<template>
  <div class="preview">
    <div class="preview-ratio">
      <img class="preview-image" :src="src" />

      <template v-if="stars">  
        <SparkleStarsAnimation style="color: var(--color-primary)" />
      </template>

      <div
        v-if="error"
        class="error-overlay">
        <IconError class="error-icon" />
      </div>
    </div>
  </div>  
</template>

<style scoped>
  .preview {
    --side-spacing: 16rem;
    position: relative;
    width: calc(100% - var(--side-spacing));
    display: flex;
    justify-content: center;
    aspect-ratio: 4 / 3;
    isolation: isolate;
    max-width: calc(48rem + var(--side-spacing));
    max-height: calc(45rem + var(--side-spacing));
  }

  .preview-ratio {
    position: relative;
    width: 100%;
  }

  .preview-ratio::before {
    content: '';
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    outline: .1rem solid var(--color-border-floating);
    outline-offset: -.1rem;
    z-index: 2;
  }

  .preview-image {
    position: relative;
    width: 100%;
    height: 100%;
    object-fit: cover;
    box-shadow: 0 2.4rem 3rem 0 rgba(0, 0, 0, 0.2);
    outline-offset: -.1rem;
    z-index: 1;
  }

  .error-overlay {
    position: absolute;
    background: var(--color-surface-transparent);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
  }
  .error-overlay svg {
    width: 25%;
    height: 25%;
    color: var(--color-on-surface-inverse);
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg) scale(0);
    }
    33% {
      transform: rotate(360deg) scale(1)
    }
    66% {
      transform: rotate(720deg) scale(0);
    }
    100% {
      transform: rotate(0deg) scale(0);
    }
  }
</style>
