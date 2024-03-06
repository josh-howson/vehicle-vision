<script setup lang="ts">
  import { blobToDataURI, resizeImage } from '@/utilities/files';
  import type { OpenAIVisionResponseContent } from './types/openai';

  const url = ref('');
  const fullResponse = ref();
  const fullError = ref();
  const isAnalyzingImage = ref(false);
  const willRedirect = ref(false);
  const secondsUntilRedirect = ref(0);
  const fileInput: Ref<HTMLInputElement | null> = ref(null);
  const previewSrc = ref();
  let intervalId: ReturnType<typeof setInterval> | null = null; 

  const updateImagePreview = () => {
    const input = fileInput.value as HTMLInputElement;
    const file = input.files?.[0]
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        previewSrc.value = e.target?.result as string;
      }
      reader.readAsDataURL(file);
    }
  }

  const sendImageToOpenAI = async () => {
    const files = fileInput.value?.files;
    if (!files || files.length === 0) {
      console.error('No file selected.')
      return;
    }

    isAnalyzingImage.value = true;

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
      }) as OpenAIVisionResponseContent;

      if ('data' in res && res.data) {
        fullResponse.value = res;
        url.value = res.data.url;
        if (res.status === 'ok' && res.data.url) {
          sendToResults(res);
        }
      } else {
        console.error('`data` property is missing from the response');
      }

      fullError.value = null;
    } catch (error: any) {
      console.error("Upload failed:", error);
      fullError.value = error;
    }
    isAnalyzingImage.value = false;
  }

  const handleFileChange = () => {
    sendImageToOpenAI();
    updateImagePreview();
  }

  const sendToResults = (response: OpenAIVisionResponseContent) => {
    willRedirect.value = true;
    const redirectInThisManySeconds = 3;
    secondsUntilRedirect.value = redirectInThisManySeconds;
    intervalId = setInterval(() => {
      if (secondsUntilRedirect.value > 0) {
        secondsUntilRedirect.value = secondsUntilRedirect.value - 1
      } else {
        if (intervalId) clearInterval(intervalId);
        window.location.href = response.data.url;
      }
    }, 1000);
  }
  
  const cancelRedirect = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
      willRedirect.value = false;
    }
  }
</script>

<template>
  <div>
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      name="image"
      capture="environment"
      @change="handleFileChange"
    />

    <div v-if="isAnalyzingImage">Analyzing image...</div>

    <template v-if="willRedirect">
      <div>Showing you [make], [model] in {{ secondsUntilRedirect }}</div>
      <button @click="cancelRedirect">Nonono I don't want that! Stop!</button>
    </template>

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