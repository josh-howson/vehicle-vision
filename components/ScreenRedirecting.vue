<script lang="ts" setup>
  import type { OpenAIVisionResponseContent } from '@/types/openai';
  import { prefixWithAnOrA } from '@/utilities/format';
  import { getWebsiteDisplayName } from '~/utilities/website';

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
  <div class="preview">
    <div class="preview-ratio">
      <img class="preview-image" :src="previewSrc">
    </div>
  </div>

  <h1 class="headline">This looks like {{ prefixWithAnOrA(fullResponse ? [fullResponse.data.make, fullResponse.data.model].filter(i => !!i).join(' ') : '') }}.</h1>

  <p class="buckle-up">Buckle up! We’re taking you to {{ fullResponse?.data.website && getWebsiteDisplayName(fullResponse?.data.website) }} to see matching listings for sale.</p>

  <p v-if="typeof secondsUntilRedirect === 'number'" class="redirecting-in">{{secondsUntilRedirect > 0 ? `Redirecting in ${secondsUntilRedirect}` : "Redirecting..." }}</p>

  <div class="restart">
    <div class="incorrect">Not correct?</div>
    <button class="button-secondary" @click="emit('click-start-over')">Start over</button>
  </div>
</template>

<style scoped>
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
    width: calc(100% - 16rem)
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

  .restart {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    gap: .8rem;
    margin-top: 6.4rem;
  }

  .incorrect {
    color: var(--color-on-surface);
  }
</style>