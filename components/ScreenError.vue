<script lang="ts" setup>
  import type { OpenAIVisionResponseContent } from '~/types/openai';

  type Props = {
    errorMessage: string;
    fullResponse: OpenAIVisionResponseContent | null;
    previewSrc: string;
  };
  defineProps<Props>();

  type Emits = (e: 'click-start-over') => void;
  const emit = defineEmits<Emits>();
</script>

<template>
    <PreviewImage
      :src="previewSrc"
      error
    />

    <h1 class="error-heading">We're having trouble analyzing your image</h1>

    <div class="error-message">
      {{ errorMessage }}
    </div>

  <button
    class="start-over button-primary"
    @click="emit('click-start-over')"
  >
    Start over
  </button>
</template>

<style scoped>
  .error-heading {
    margin-top: 6.4rem;
  }

  .error-message {
    margin-top: 1.6rem;
  }

  .start-over {
    margin-top: 1.6rem;
  }
</style>