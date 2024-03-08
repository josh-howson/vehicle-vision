<script lang="ts" setup>
  type Props = {
    errorMessage: string;
  };
  defineProps<Props>();

  type Emits = (e: 'click-start-over') => void;
  const emit = defineEmits<Emits>();
</script>

<template>
  <section>
    <div class="">
      {{ errorMessage }}
    </div>
    <button
      class="button-secondary"
      @click="emit('click-start-over')"
    >
      Start over
    </button>
  </section>
</template>
