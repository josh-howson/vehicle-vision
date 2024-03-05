<script setup lang="ts">
  const res = ref();
  const handleClick = async () => {
    res.value = $fetch('/api/openai');
  }
</script>

<template>
  <div>
    Hello, {{ res }}

    <button @click="handleClick">Click</button>
  </div>
</template>
