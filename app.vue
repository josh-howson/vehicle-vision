<script setup lang="ts">
  import { blobToDataURI, fileToBase64, resizeImage } from '@/utilities/files';

  const url = ref('');
  const fullResponse = ref();
  const fullError = ref();
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
      const resizedImageBlob = await resizeImage(file, 300, 200);
      const dataUri = await blobToDataURI(resizedImageBlob);
      console.log('dataUri', dataUri)
      // const base64File = await fileToBase64(file) as string;
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
      <input ref="fileInput" type="file" accept="image/*" name="image" />
      <button :disabled="isLoading" type="submit">{{isLoading ? 'Please wait...' : 'Describe image'}}</button>
    </form>

    <div>
      <a v-if="url" :href="url" target="_blank">See vehicles like this</a>
    </div>
    <sup>{{ fullResponse }}</sup>
    <sup>{{ fullError }}</sup>
  </div>
</template>
