<template>
    <div class="h-screen bg-gray-900 text-gray-50">
        <MainLayout>
            <template #aside> This is an aside </template>
            <template #main> <MusicCollectionPage /> </template>
            <template #footer>
                <PlayerControls />
                <PlayerProgress v-model="progress" max="20" />
            </template>
        </MainLayout>
    </div>
</template>

<script setup lang="ts">
import MainLayout from "./layouts/MainLayout.vue";
import MusicCollectionPage from "./pages/MusicCollectionPage.vue";
import PlayerControls from "./components/PlayerControls.vue";
import PlayerProgress from "./components/PlayerProgress.vue";

import { ref } from "vue";

const progress = ref<number>(15);
</script>
