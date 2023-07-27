<script setup lang="ts">
defineProps<{
  headerName: string
}>()
</script>

<template>
  <p>{{ headerName }}</p>
</template>

<style scoped>
p {
  font-size: 24px;
}
</style>
