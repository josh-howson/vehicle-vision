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
  <PreviewImage
    :src="previewSrc"
  />

  <h1 class="headline">This looks like {{ prefixWithAnOrA(fullResponse ? [fullResponse.data.make, fullResponse.data.model].filter(i => !!i).join(' ') : '') }}.</h1>

  <p class="buckle-up">Buckle up! We’re taking you to {{ fullResponse?.data.website && getWebsiteDisplayName(fullResponse?.data.website) }} to see matching listings for sale.</p>

  <p v-if="typeof secondsUntilRedirect === 'number'" class="redirecting-in">{{secondsUntilRedirect > 0 ? `Redirecting in ${secondsUntilRedirect}` : "Redirecting..." }}</p>

  <div class="restart">
    <p class="incorrect">Not correct?</p>

    <button class="button-secondary" @click="emit('click-start-over')">Start over</button>
  </div>
</template>

<style scoped>
  .headline {
    margin-top: 6.4rem;
  }

  .redirecting-in {
    margin-top: 1.6rem;
    color: var(--color-on-surface-variant)
  }

  .buckle-up {
    margin-top: 1.6rem;
  }

  .restart {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    gap: .8rem;
    margin-top: 6.4rem;
  }
</style>