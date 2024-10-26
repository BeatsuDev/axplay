<template>
    <progress class="w-full" :value="progress" :max="length ?? 0"></progress>
</template>

<script setup lang="ts">
defineProps<{
    length?: number; // The length of the track in milliseconds
}>();

const progress = defineModel<number>({ default: 0 });
</script>
