<template>
    <div class="h-screen bg-gray-900 text-gray-50">
        <MainLayout>
            <template #aside>
                <div class="w-full h-full p-4">
                    <img
                        src="/axplay.png"
                        alt="axplay"
                        class="w-full max-w-48 mx-auto"
                    />
                    <NavigationButton
                        @click="addMusictoCollection"
                        class="w-full mt-4"
                        >Import Music</NavigationButton
                    >
                </div>
            </template>
            <template #main>
                <MusicCollectionPage :collection="musicCollection" />
            </template>
            <template #footer>
                <div
                    class="flex flex-col justify-between h-full items-center p-4 pt-2"
                >
                    <div class="flex justify-between w-full">
                        <div>Left controls</div>
                        <PlayerControls />
                        <div>Right controls</div>
                    </div>
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
import NavigationButton from "./components/NavigationButton.vue";

import { ref } from "vue";
import { open } from "@tauri-apps/plugin-dialog";
import { readFile } from "@tauri-apps/plugin-fs";
import { parseBuffer } from "music-metadata";
import { MusicFilePath, useMusicCollection } from "./composables/music";

// Player state
const progress = ref<number>(15 * 1000);
const length = ref<number>(200 * 1000);

function msToHumanReadable(ms: number) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// Import music logic
async function addMusictoCollection() {
    const selected = await open({
        multiple: false,
        directory: false,
        filters: [{ name: "Music", extensions: ["mp3", "wav", "flac", "ogg"] }],
    });

    if (!selected) return;
    if (
        !["mp3", "wav", "flac", "ogg"].includes(selected.split(".").pop() ?? "")
    )
        return;

    const musicFilePath = selected as MusicFilePath;
    const fileData = await readFile(musicFilePath);
    const metadata = await parseBuffer(fileData);

    musicCollection.value.push({
        filePath: musicFilePath,
        title: metadata.common.title || "Unknown",
        artists: metadata.common.artists || ["Unknown"],
        album: metadata.common.album || "Unknown",
        duration: metadata.format.duration || 0,
        sampleRate: metadata.format.sampleRate || 0,
    });

    await saveCollection();
}

// Storing music logic
const { data: musicCollection, save: saveCollection } =
    useMusicCollection("collection.json");
</script>
