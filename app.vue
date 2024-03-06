<script setup lang="ts">
  import { blobToDataURI, resizeImage } from '@/utilities/files';

  const url = ref('');
  const fullResponse = ref();
  const fullError = ref();
  const isLoading = ref(false);
  const fileInput: Ref<HTMLInputElement | null> = ref(null);
  const previewSrc = ref();

  const handleImageChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0]
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        previewSrc.value = e.target?.result as string;
      }
      reader.readAsDataURL(file);
    }
  }

  const handleSubmit = async (e: Event) => {
    const files = fileInput.value?.files;
    if (!files || files.length === 0) {
      console.error('No file selected.')
      return;
    }

    isLoading.value = true;

    const file = files[0];
    try {
      const resizedImageBlob = await resizeImage(file, 300, 200);
      const dataUri = await blobToDataURI(resizedImageBlob);
      const res = await $fetch('/api/openai', {
        method: 'POST',
        body: {
          imageUrl: dataUri,
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
      fullError.value = error;
    }
    isLoading.value = false;
  }
</script>

<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        name="image"
        capture="environment"
        @change="handleImageChange"
      />
      <button
        :disabled="isLoading"
        type="submit"
      >
        {{ isLoading ? 'Please wait...' : 'Describe image' }}
      </button>
    </form>

    <img v-if="previewSrc" :src="previewSrc" width="200" />

    <sup>{{ fullResponse }}</sup>
    <sup>{{ fullError }}</sup>
    <div>
      <a
        v-if="url"
        :href="url"
        target="_blank">
        See vehicles like this
      </a>
    </div>
  </div>
</template>

<style>
  body {font-size: 20px;}
  button, input[type="file"] {padding: 10px; font-size: inherit}
</style>