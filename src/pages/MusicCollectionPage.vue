<template>
    <div class="flex justify-center align-center w-full h-full bg-gray-800">
        <h1>Music Collection</h1>
        <ul>
            <li v-for="music in collection" :key="music.filePath">
                <div>{{ music.title }}</div>
                <div>{{ music.artists?.join(", ") ?? "No artist" }}</div>
                <div>{{ music.album }}</div>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { type MusicData } from "@/composables/music";

defineProps<{
    collection: MusicData[];
}>();
</script>
