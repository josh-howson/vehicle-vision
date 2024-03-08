<script lang="ts" setup>
  import IconStar from '@/assets/svg/IconStar.vue';
  /**
   * this component will absolutely position itself and rely purely
   * on percentage widths of the relative parent, so where it's placed
   * in the DOM matters.
   * */
</script>

<template>
  <div class="stars">
    <IconStar class="star-1" />
    
    <IconStar class="star-2" />
    
    <IconStar class="star-3" />
  </div>
</template>

<style scoped>
  .stars {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  [class*="star-"] {
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