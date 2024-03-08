<script lang="ts" setup>
  type Props = {
    previewSrc: string;
  }
  defineProps<Props>()

  type Step = "preview" | "cards";
  const step: Ref<Step> = ref('preview');
  const firstScreenDuration = 5500;

  onMounted(() => {
    setTimeout(() => {
      if (step.value === 'preview') step.value = 'cards';
    }, firstScreenDuration)
  })
</script>

<template>
  <template v-if="step === 'preview'">
    <PreviewImage
      :src="previewSrc"
      stars
    />

    <p class="message smooth-in-out">We’re analyzing your photo for things like make and model&hellip;</p>
  </template>

  <template v-else-if="step === 'cards'">
    <div class="cards-step">
      <CardStackAnimation />

      <p class="smooth-in">Next up: matching your photo specs with listings for sale. (Friendly reminder: AI isn’t perfect, but it’ll help speed up your buying process.)</p>
    </div>
  </template>
</template>

<style scoped>
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
</style>