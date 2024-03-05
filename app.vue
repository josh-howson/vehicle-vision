<script setup lang="ts">
import { fileToBase64 } from '@/utilities/files';

  const url = ref('');
  const fullResponse = ref();
  const error = ref();
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
      const res = await $fetch('/api/openai', {
        method: 'POST',
        body: {
          imageUrl: base64File,
        },
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if ('data' in res && res.data) {
        fullResponse.value = res;
        url.value = res.data.url;
      } else {
        console.error('`data` property is missing from the response');
      }
    } catch (error: any) {
      console.error("Upload failed:", error);
      error.value = error;
    }
    isLoading.value = false;
  }
</script>

<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <label>Upload an image</label>
      <input ref="fileInput" type="file" accept="image/png, image/jpeg" name="image" />
      <button :disabled="isLoading" type="submit">{{isLoading ? 'Please wait...' : 'Describe image'}}</button>
    </form>

    <a v-if="url" :href="url" target="_blank">See vehicles like this</a>
    <pre v-if="fullResponse">{{ fullResponse }}</pre>
    <pre v-if="error">Error: {{ error }}</pre>
  </div>
</template>
