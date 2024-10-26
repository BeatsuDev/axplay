<template>
    <div class="h-screen bg-gray-900 text-gray-50">
        <MainLayout>
            <template #aside> This is an aside </template>
            <template #main> <MusicCollectionPage /> </template>
            <template #footer>
                <div
                    class="flex flex-col justify-between h-full items-center p-4 pt-2"
                >
                    <PlayerControls />
                    <div
                        class="flex justify-between w-full text-sm items-center gap-3"
                    >
                        <span>{{ msToHumanReadable(progress) }}</span>
                        <PlayerProgress
                            v-model="progress"
                            :length="length"
                            class="flex-1"
                        />
                        <span>{{ msToHumanReadable(length) }}</span>
                    </div>
                </div>
            </template>
        </MainLayout>
    </div>
</template>

<script setup lang="ts">
import MainLayout from "./layouts/MainLayout.vue";
import MusicCollectionPage from "./pages/MusicCollectionPage.vue";
import PlayerControls from "./components/player/PlayerControls.vue";
import PlayerProgress from "./components/player/PlayerProgress.vue";

import { ref } from "vue";

const progress = ref<number>(15 * 1000);
const length = ref<number>(200 * 1000);

function msToHumanReadable(ms: number) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
</script>
