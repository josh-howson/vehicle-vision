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
  const isAnalyzingImage = ref(false);
  const isError = ref(false);
  const errorMessage = ref('');
  const previewSrc = ref();
  const willRedirect = ref(false);
  const secondsUntilRedirect = ref(0);
  const fileOrCapture: Ref<'file' | 'capture'> = ref('file')

  type Step = 'upload' | 'analyzing' | 'redirecting';
  const step: Ref<Step> = ref('upload');

  let intervalId: ReturnType<typeof setInterval> | null = null;
  
  const handleError = (message: string) => {
    isError.value = true;
    errorMessage.value = message;
    console.error('=== Error === ', message);
  }

  const handleUploadButtonClick = (payload: 'file' | 'capture') => {
    fileOrCapture.value = payload;
    setTimeout(() => {
      if (imageInput.value) imageInput.value.click();
    }, 50);
  }

  const sendToResults = (response: OpenAIVisionResponseContent) => {
    step.value = 'redirecting';
    willRedirect.value = true;
    const redirectInThisManySeconds = 5;
    secondsUntilRedirect.value = redirectInThisManySeconds;
    intervalId = setInterval(() => {
      if (secondsUntilRedirect.value > 1) {
        secondsUntilRedirect.value = secondsUntilRedirect.value - 1
      } else {
        secondsUntilRedirect.value = 0;
        if (intervalId) clearInterval(intervalId);
        window.location.href = response.data.url;
      }
    }, 1000);
  }

  const analyzeImage = async (file: File) => {
    isAnalyzingImage.value = true;
    step.value = 'analyzing';
    loading.value = true;

    // setTimeout is a hack to make this take at least 8 seconds. api is too fast sometimes!
    setTimeout(async () => {
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
          } else if (res.status === 'error') {
            handleError(res.statusText);
          } else {
            handleError('An unknown error has ocurred. Please try again.');
          }
        } else {
          handleError('Error: `data` property is missing from the response');
        }
      } catch (error: any) {
        handleError(error);
      }
      isAnalyzingImage.value = false;
      loading.value = false;
    }, 8000);
  }

  const handleFileDropped = (file: File) => {
    console.log('file dropped')
    handleFileChange(file);
  }

  const updateImagePreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      previewSrc.value = e.target?.result as string;
    }
    reader.readAsDataURL(file);
  }

  const handleFileChange = (file: File) => {
    analyzeImage(file);
    updateImagePreview(file);
  }

  const startOver = () => {
    window.location.reload();
  }
</script>

<template>
  <Layout :is-loading="loading">
    <template v-slot:main>
      <template v-if="isError">
        <LazyScreenError
          :error-message="errorMessage"
          :full-response="fullResponse"
          :preview-src="previewSrc"
          @click-start-over="startOver"
        />
      </template>

      <template v-else>
        <ScreenUpload
          v-if="step === 'upload'"
          @click-upload="handleUploadButtonClick"
          @file-drop="handleFileDropped"
        />

        <LazyScreenAnalyzing
          v-if="step === 'analyzing'"
          :previewSrc="previewSrc"
        />

        <LazyScreenRedirecting
          v-if="step === 'redirecting'"
          :preview-src="previewSrc"
          :full-response="fullResponse"
          :seconds-until-redirect="secondsUntilRedirect"
          @click-start-over="startOver"
        />
      </template>
    </template>

    <template
      v-slot:bottom
      v-if="step === 'analyzing' && !isError"
    >
      <button
        class="button-secondary"
        @click="startOver"
      >
        Start over
      </button>
    </template>
  </Layout>

  <input
    style="display: none;"
    ref="imageInput"
    type="file"
    accept="image/*"
    name="image"
    :capture="fileOrCapture === 'capture' ? 'environment' : undefined"
    @change="e => {
      const files = (e.target as HTMLInputElement)?.files;
      if (files?.[0]) {
        handleFileChange(files[0])
      } else {
        handleError('No file selected.');
      }
    }"
  />
</template>
