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
                        @click="addMusicToCollection"
                        class="w-full mt-4"
                        >Import Music</NavigationButton
                    >
                </div>
            </template>
            <template #main>
                <MusicCollectionPage
                    v-model="currentSong"
                    :collection="musicCollection"
                />
            </template>
            <template #footer>
                <div
                    class="flex flex-col justify-between h-full items-center p-4 pt-2"
                >
                    <div class="flex justify-between items-center w-full">
                        <div class="flex-1">
                            <div v-if="currentSong">
                                <p>
                                    {{ currentSong?.title }}
                                </p>
                                <p class="text-sm text-gray-400">
                                    {{ currentSong?.artists?.join(", ") }}
                                </p>
                            </div>
                            <p v-else>No song selected</p>
                        </div>
                        <PlayerControls
                            v-model:playing="playing"
                            v-model:repeat="repeat"
                            v-model:shuffle="shuffle"
                        />
                        <div class="flex-1 flex justify-end items-center">
                            <SpeakerWaveIcon
                                class="h-5 mr-1.5 translate-y-0.5"
                            />
                            <PlayerProgress
                                v-model="volume"
                                :length="1"
                                class="min-w-32 w-1/3 [&>*::-webkit-progress-value]:!bg-secondary-500"
                            />
                        </div>
                    </div>
                    <div
                        class="flex justify-between w-full text-sm items-center gap-3"
                    >
                        <span>{{ formatTime(currentTime) }}</span>
                        <PlayerProgress
                            v-model="currentTime"
                            :length="currentSong?.duration ?? 0"
                            class="flex-1"
                        />
                        <span>{{
                            formatTime(currentSong?.duration ?? 0)
                        }}</span>
                    </div>
                </div>
            </template>
        </MainLayout>
        <audio ref="audioElement" v-if="currentSong">
            <source
                :src="convertFileSrc(currentSong.filePath)"
                :type="'audio/' + currentSong.filePath.split('.').pop()"
            />
        </audio>
    </div>
</template>

<script setup lang="ts">
import MainLayout from "./layouts/MainLayout.vue";
import MusicCollectionPage from "./pages/MusicCollectionPage.vue";
import PlayerControls from "./components/player/PlayerControls.vue";
import PlayerProgress from "./components/player/PlayerProgress.vue";
import NavigationButton from "./components/NavigationButton.vue";
import { SpeakerWaveIcon } from "@heroicons/vue/16/solid";

import { ref, watch } from "vue";
import { open } from "@tauri-apps/plugin-dialog";
import { readFile } from "@tauri-apps/plugin-fs";
import { convertFileSrc } from "@tauri-apps/api/core";
import { IAudioMetadata, parseBuffer } from "music-metadata";
import { useMediaControls } from "@vueuse/core";

import {
    MusicFilePath,
    useMusicCollection,
    type MusicData,
} from "./composables/music";

// Import music logic
async function addMusicToCollection() {
    const selected = await open({
        multiple: true,
        directory: false,
        filters: [{ name: "Music", extensions: ["mp3", "wav", "flac", "ogg"] }],
    });

    if (!selected) return;

    function isMusicFile(selected: string) {
        return ["mp3", "wav", "flac", "ogg"].includes(
            selected.split(".").pop() ?? ""
        );
    }

    const musicFiles = selected.filter(isMusicFile) as MusicFilePath[];
    const metadataPromises = musicFiles.map(
        async (path) => await parseBuffer(await readFile(path))
    );

    const metadatas = await Promise.all(metadataPromises);
    const zipped = musicFiles.map((path, index) => [
        path,
        metadatas[index],
    ]) as [MusicFilePath, IAudioMetadata][];

    for (const [musicFilePath, metadata] of zipped) {
        if (
            musicCollection.value.map((m) => m.filePath).includes(musicFilePath)
        ) {
            continue;
        }
        musicCollection.value.push({
            filePath: musicFilePath,
            title: metadata.common.title || "Unknown",
            artists: metadata.common.artists || ["Unknown"],
            album: metadata.common.album || "Unknown",
            duration: metadata.format.duration || 0,
            sampleRate: metadata.format.sampleRate || 0,
        });
    }

    saveCollection();
}

// Storing music logic
const { data: musicCollection, save: saveCollection } =
    useMusicCollection("collection.json");

// Player state
const currentSong = ref<MusicData | null>(null);

const repeat = ref<"none" | "one" | "all">("none");
const shuffle = ref<boolean>(false);

function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// Audio
const audioElement = ref<HTMLAudioElement | null>(null);

const { playing, currentTime, volume } = useMediaControls(audioElement, {
    src: currentSong.value
        ? convertFileSrc(currentSong.value.filePath)
        : undefined,
});

watch(currentSong, (newSong) => {
    currentTime.value = 0;
    let playingState = playing.value;

    if (newSong && audioElement.value) {
        audioElement.value.src = convertFileSrc(newSong.filePath);
        audioElement.value.load();
    }

    // TODO: Please find a better way of handling this...
    if (playingState) {
        setTimeout(() => {
            playing.value = true;
        }, 50);
    }
});
</script>
