<script setup lang="ts">
  import '@/assets/main.css';
  import { blobToDataURI, resizeImage } from '@/utilities/files';
  import type { OpenAIVisionResponseContent } from '@/types/openai';

  useHead({
    title: 'Snap Shop',
    meta: [
      { name: 'description', content: 'Search for vehicles for sale by simply taking a photo.' }
    ],
    htmlAttrs: {
      lang: 'en',
    }
  })

  const loading = ref(false);
  const imageInput: Ref<HTMLInputElement | null> = ref(null);
  const url = ref('');
  const fullResponse: Ref<null | OpenAIVisionResponseContent> = ref(null);
  const fullError = ref();
  const isAnalyzingImage = ref(false);
  const previewSrc = ref();
  const willRedirect = ref(false);
  const secondsUntilRedirect = ref(0);

  type Step = 'upload' | 'analyzing' | 'redirecting';
  const step: Ref<Step> = ref('upload');

  let intervalId: ReturnType<typeof setInterval> | null = null; 

  const handleUploadButtonClick = () => {
    if (imageInput.value) imageInput.value.click();
  }

  const sendToResults = (response: OpenAIVisionResponseContent) => {
    step.value = 'redirecting';
    willRedirect.value = true;
    const redirectInThisManySeconds = 5;
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

  const getImageAnalysis = async () => {
    const files = imageInput.value?.files;
    if (!files || files.length === 0) {
      console.error('No file selected.')
      return;
    }

    isAnalyzingImage.value = true;
    loading.value = true;
    step.value = 'analyzing';

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
    loading.value = false;
  }

  const updateImagePreview = () => {
    const input = imageInput.value as HTMLInputElement;
    const file = input.files?.[0]
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        previewSrc.value = e.target?.result as string;
      }
      reader.readAsDataURL(file);
    }
  }

  const handleFileChange = () => {
    getImageAnalysis();
    updateImagePreview();
  }

  const startOver = () => {
    window.location.reload();
  }
</script>

<template>
  <Header :is-loading="loading" />

  <ScreenUpload
    v-if="step === 'upload'"
    @click-upload="handleUploadButtonClick"
  />

  <LazyScreenAnalyzing
    v-if="step === 'analyzing'"
    @click-start-over="startOver"
    :previewSrc="previewSrc"
  />

  <LazyScreenRedirecting
    v-if="step === 'redirecting'"
    :preview-src="previewSrc"
    :full-response="fullResponse"
    :seconds-until-redirect="secondsUntilRedirect"
    @click-start-over="startOver"
  />

  <input
    style="display: none" ref="imageInput"
    type="file"
    accept="image/*"
    name="image"
    capture="environment"
    @change="handleFileChange"
  />
</template>
