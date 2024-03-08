<script lang="ts" setup>
  import IconStar from '@/assets/svg/IconStar.vue';
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
        <IconStar class="star-1" />

        <IconStar class="star-2" />

        <IconStar class="star-3" />
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
    position: relative;
    width: calc(100% - 16rem);
    display: flex;
    justify-content: center;
    aspect-ratio: 4 / 3;
    isolation: isolate;
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


  [class*="star-"] {
    color: var(--color-primary);
    position: absolute;
    --size: 16%;
    width: var(--size);
    height: var(--size);
    animation: spin var(--duration, 3s) linear infinite var(--offset, 0s);
    transform: rotate(0deg) scale(0);
  }

  .star-1 {
    top: 25%;
    left: -20%;
    transform: rotate(-12deg);
    --duration: 2.5s;
    rotate: -12deg;
  }

  .star-2 {
    top: 100%;
    left: 65%;
    transform: rotate(-10deg) scale(.5);
    rotate: -10deg;
    scale: .5;
    --offset: -1s;
    --duration: 3s
  }

  .star-3 {
    top: 75%;
    left: 102%;
    rotate: 15deg;
    scale: .75;
    --offset: -.2s;
    --duration: 2.8s
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