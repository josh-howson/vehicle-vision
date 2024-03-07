<script lang="ts" setup>
  type Props = {
    isLoading?: boolean;
  };

  const props = defineProps<Props>();

  const progress = ref(0);
  const showProgress = ref(false);
  const progressAnimationDuration = ref(0);

  const progressTickInMS = 1000;
  let intervalId: ReturnType<typeof setInterval> | null = null;

  const startProgress = () => {
    progressAnimationDuration.value = progressTickInMS;
    showProgress.value = true;
    intervalId = setInterval(() => {
      increaseProgress()
    }, progressTickInMS);
    increaseProgress()
  }

  const increaseProgress = () => {
    const inProgressMax = 90;
    if (progress.value < inProgressMax) {
      const remainingProgress = inProgressMax - progress.value;
      const progressToAdd = remainingProgress * .1;
      progress.value += progressToAdd;
    }
  }

  const completeProgress = () => {
    progress.value = 100;
    if (intervalId) clearInterval(intervalId);
    setTimeout(() => {
      showProgress.value = false;
      progressAnimationDuration.value = 0;
      progress.value = 0;
    }, 1000);
  }

  watch(() => props.isLoading, value => {
    if (value) {
      startProgress();
    } else {
      completeProgress();
    }
  });
</script>

<template>
  <header class="site-header">
    <Logo class="logo" aria-label="SnapShop logo" />
  </header>

  <div
    class="progress"
    :style="{
      '--progress': `${progress / 100}`,
      visibility: showProgress ? 'visible' : 'hidden',
      '--transition-duration': `${progressAnimationDuration}ms`,
    }"
  />
</template>

<style scoped>
  .site-header, .progress {
    grid-column: 1 / -1;
  }

  .site-header {
    grid-column: 1 / -1;
    background-color: var(--color-surface);
    border-bottom: .1rem solid var(--color-border-low);
    display: flex;
    justify-content: center;
  }

  .logo {
    padding: 3.2rem;
    color: var(--color-primary);
    box-sizing: content-box;
  }

  .progress {
    width: 100%;
    height: .4rem;
    margin-bottom: -.4rem;
    transform: scaleX(var(--progress));
    transform-origin: left;
    background: linear-gradient(to right, #AFFCFD, #5AC59C);
    transition: transform var(--transition-duration, 1s) ease-out;
  }
</style>
