<script lang="ts" setup>
  import IconShoppingCart from '@/assets/svg/IconShoppingCart.vue';
  import IconRVTrader from '@/assets/svg/IconRVTrader.vue';
  import IconCycleTrader from '@/assets/svg/IconCycleTrader.vue';
  import IconCarsales from '@/assets/svg/IconCarsales.vue';
  import IconPlus from '@/assets/svg/IconPlus.vue';

  type Emits = {
    (e: 'click-upload', value: 'file' | 'capture'): void;
    (e: 'file-drop', file: File): void;
  }
  const emit = defineEmits<Emits>();

  const isDrawerOpen = ref(false);
  const isDraggingOver = ref(false);

  const handleDrawerClose = () => {
    isDrawerOpen.value = false;
  }

  const handleOptionClick = (option: 'file' | 'capture') => {
    isDrawerOpen.value = false;
    emit('click-upload', option);
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    isDraggingOver.value = true;
  }
  
  const handleDragLeave = (e: DragEvent) => {
    isDraggingOver.value = false;
  };
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();

    if (e.dataTransfer && e.dataTransfer.items) {
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        if (e.dataTransfer.items[i].kind === 'file') {
            const file: File | null = e.dataTransfer.items[i].getAsFile();
            if (file) {
              emit('file-drop', file);
            }
            break;
          }
      }
    }
  }
</script>

<template>
  <div class="ai-powered">
    <div class="cart-icon">
      <IconShoppingCart fill="var(--color-primary)" />
    </div>

    <span>Powered by AI</span>
  </div>

  <div class="explainer">
    <h1>What are you shopping for?</h1>

    <p class="explainer-para">Take a picture of an RV, motorcycle, or car you’re interested in, and we’ll find matching listings for sale just for you.</p>

    <div class="brands">
      <IconRVTrader />

      <IconCycleTrader />

      <IconCarsales />
    </div>
  </div>

  <div
    :class="['upload', isDraggingOver && 'dragging-over']"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <button
      class="upload-button-mobile button-primary icon-only"
      aria-label="Upload an image"
      @click="isDrawerOpen = true"
    >
      <IconPlus />
    </button>

    <h2>Upload a photo</h2>

    <p class="drag-n-drop-instructional">Drag and drop files here to upload, or use the upload button</p>

    <button
      class="upload-button-desktop button-primary"
      aria-label="Upload an image"
      @click="handleOptionClick('file')"
    >
      <IconPlus />
      Upload
    </button>
  </div>

  <UploadDrawer
    :is-open="isDrawerOpen"
    @request-close="handleDrawerClose"
    @click-option="handleOptionClick"
  />
</template>

<style scoped>
  .ai-powered {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: .4rem;
    font-size: 1.2rem;
    color: var(--color-on-surface);
    margin-bottom: 1.6rem;
  }
  .explainer-para {
    color: var(--color-on-surface-variant)
  }

  .cart-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--color-secondary);
    border-radius: 999rem;
    height: 3rem;
    width: 3rem;
  }

  .cart-icon svg {
    height: 100%;
    width: 100%;
    color: var(--color-primary)
  }

  .brands {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: center;
    gap: 3.2rem;
    margin-top: 1.6rem;
  }

  .brands svg {
    fill: #B6B6B6;
    height: 3.2rem;
    width: auto;
  }

  .upload {
    flex: 1;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    gap: 1.6rem;
    width: 100%;
  }

  .upload h2 {
    font-size: 2.4rem;
  }

  .drag-n-drop-instructional {
    margin: 0;
  }

  @media (max-width: 63.99rem) {
    .upload-button-desktop {
      display: none;
    }

    .drag-n-drop-instructional {
      display: none;
    }
  }
  @media (min-width: 64rem) {
    h1 {
      font-size: 4rem;
    }

    .upload-button-mobile {
      display: none;
    }

    .upload {
      border: .1rem dashed var(--color-border);
      margin: 3.2rem 0;
      border-radius: .8rem;
      background-color: var(--color-surface);
    }

    .upload.dragging-over {
      border-color: currentColor;
      background-color: var(--color-surface-variant);
      color: var(--color-on-surface-variant);
    }

    .upload.dragging-over h2 {
      color: inherit;
    }
  }
</style>
