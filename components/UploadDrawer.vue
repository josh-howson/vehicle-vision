<script lang="ts" setup>
  import IconPlus from '@/assets/svg/IconPlus.vue';
  import IconCamera from '@/assets/svg/IconCamera.vue';
  import IconX from '@/assets/svg/IconX.vue';

  type Props = {
    isOpen: boolean;
  }
  withDefaults(defineProps<Props>(), {
    isOpen: false,
  });

  const emit = defineEmits(['request-close', 'click-option']);
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="overlay" @click="emit('request-close')"></div>
  </Transition>

  <Transition name="slide">
    <div
      v-if="isOpen"
      class="drawer"
    >
      <div class="header">
        <button class="close button-transparent icon-only" @click="emit('request-close')">
          <IconX />
        </button>
      </div>

      <div class="main">
        <button class="button-secondary" @click="emit('click-option', 'file')"><IconPlus />Choose a file</button>

        <button class="button-secondary" @click="emit('click-option', 'capture')"><IconCamera />Take a photo</button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
  .overlay {
    background-color: var(--color-surface-transparent);
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: fixed;
  }

  .drawer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: var(--color-surface);
    border-radius: 1.6rem 1.6rem 0 0;
    overflow: hidden;
  }

  .header {
    padding: 1.2rem 2rem;
    border-bottom: .1rem solid var(--color-border-low);
    display: flex;
    justify-content: space-between;
  }

  .header .close {
    margin-left: auto;
  }

  .main {
    display: flex;
    flex-flow: column nowrap;
    align-items: stretch;
    padding: 1.6rem 2rem;
    gap: 1.6rem;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease-in-out;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  .slide-enter-active,
  .slide-leave-active {
    transition: transform 500ms ease-in-out;
  }
  .slide-enter-from,
  .slide-leave-to {
    transform: translateY(100%);
  }
</style>
