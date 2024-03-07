<script lang="ts" setup>
  import type { OpenAIVisionResponseContent } from '@/types/openai';
import { prefixWithAnOrA } from '@/utilities/format';

  type Props = {
    fullResponse: OpenAIVisionResponseContent | null;
    previewSrc: string;
    secondsUntilRedirect: number;
  }
  defineProps<Props>();

  type Emits = (e: 'click-start-over') => void;
  const emit = defineEmits<Emits>();
</script>

<template>
  <div class="redirecting">
    <div class="preview">
      <div class="preview-ratio">
        <img class="preview-image" :src="previewSrc">
      </div>
    </div>

    <h1 class="headline">This looks like {{ prefixWithAnOrA(fullResponse ? [fullResponse.data.make, fullResponse.data.model].filter(i => !!i).join(' ') : '') }}.</h1>

    <p class="buckle-up">Buckle up! We’re taking you to {{ fullResponse?.data.website }} to see matching listings for sale.</p>

    <p v-if="typeof secondsUntilRedirect === 'number'" class="redirecting-in">{{secondsUntilRedirect > 0 ? `Redirecting in ${secondsUntilRedirect}` : "Redirecting..." }}</p>

    <div class="text-button" @click="emit('click-start-over')">Start over</div>
  </div>
</template>

<style scoped>
  .redirecting {
    padding-top: calc(20vh - 10rem);
    text-align: center;
  }

  .headline {
    margin-top: 6.4rem;
  }

  .redirecting-in {
    margin-top: 1.6rem;
  }

  .buckle-up {
    margin-top: 1.6rem;
    color: var(--color-on-surface);;
  }

  .preview {
    margin: 0 8rem;
  }

  .preview-ratio {
    aspect-ratio: 4 / 3;
    width: 100%;
  }

  .preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    box-shadow: 0 2.4rem 3rem 0 rgba(0, 0, 0, 0.2);
    outline: .1rem solid var(--color-);
    outline-offset: -.1rem;
  }
</style>