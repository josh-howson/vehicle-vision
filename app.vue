<script setup lang="ts">
  const { data } = await useFetch('/api/openai?name=Josh');
</script>

<template>
  <div>
    Hello, {{ data?.hello }}
  </div>
</template>
