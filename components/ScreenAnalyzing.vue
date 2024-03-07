<script lang="ts" setup>
  // TODO: implement second analyzing screen after a few seconds.
  import IconStar from '@/assets/svg/IconStar.vue';

  type Props = {
    previewSrc: string;
  }
  const props = defineProps<Props>()

  type Emits = (e: 'click-start-over') => void;
  const emit = defineEmits<Emits>();

  type Step = "preview" | "cards";
  const step: Ref<Step> = ref('preview');

  onMounted(() => {
    setTimeout(() => {
      if (step.value === 'preview') step.value = 'cards';
    }, 5000)
  })
</script>

<template>
  <div class="analyzing">
    <template v-if="step === 'preview'">
      <div class="preview">
        <div class="preview-ratio">
          <img class="preview-image" :src="previewSrc">
        </div>

        <IconStar class="star-1" />
        <IconStar class="star-2" />
        <IconStar class="star-3" />
      </div>

      <p class="message">We’re analyzing your photo for things like make and model&hellip;</p>
    </template>

    <template v-else-if="step === 'cards'">
      <div class="cards-step">
        <CardStackAnimation />

        <p>Next up: matching your photo specs with listings for sale. (Friendly reminder: AI isn’t perfect, but it’ll help speed up your buying process.)</p>
      </div>
    </template>

    <button class="text-button button-restart" @click="emit('click-start-over')">
      Start over
    </button>
  </div>
</template>

<style scoped>
  .analyzing {
    text-align: center;
    padding-top: calc(30vh - 10rem);
    padding-top: calc(30dvh - 10rem);
  }

  .preview {
    position: relative;
    margin: 0 8rem;
    display: inline-flex;
    justify-content: center;
  }

  .preview-ratio {
    aspect-ratio: 4 / 3;
    max-width: 100%;
    max-height: 40vh;
    max-height: 40dvh;
  }

  .preview-image {
    position: relative;
    width: 100%;
    height: 100%;
    object-fit: cover;
    box-shadow: 0 2.4rem 3rem 0 rgba(0, 0, 0, 0.2);
    outline: .1rem solid var(--color-);
    outline-offset: -.1rem;
    z-index: 1;
  }

  [class^="star-"] {
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

  .message {
    margin-top: 6.4rem;
  }

  .cards-step {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    gap: 3.2rem;
  }

  .button-restart {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 3.2rem;
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