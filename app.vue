<script setup lang="ts">
import { fileToBase64 } from '@/utilities/files';

  const res = ref();
  const isLoading = ref(false);
  const fileInput: Ref<HTMLInputElement | null> = ref(null);

  const handleSubmit = async (e: Event) => {
    const files = fileInput.value?.files;
    if (!files || files.length === 0) {
      console.error('No file selected.')
      return;
    }

    isLoading.value = true;

    const file = files[0];
    try {
      const base64File = await fileToBase64(file) as string;
      res.value = await $fetch('/api/openai', {
      method: 'POST',
      body: {
        imageUrl: base64File,
      },
      headers: {
        'Content-Type': 'application/json',
      }
    });
    } catch (error) {
      console.error("Upload failed:", error);
    }
    isLoading.value = false;
  }
</script>

<template>
  <div>
    <form
      @submit.prevent="handleSubmit"
    >
      <label>Upload an image</label>
      <input ref="fileInput" type="file" accept="image/png, image/jpeg" name="image" />
      <button type="submit">{{isLoading ? 'Please wait...' : 'Describe image'}}</button>
    </form>

    <pre>{{ res }}</pre>
  </div>
</template>
