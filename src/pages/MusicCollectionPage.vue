<template>
    <div class="flex flex-col align-center w-full min-h-full bg-gray-800">
        <h1
            class="text-3xl text-center p-4 text-primary-500 sticky top-0 backdrop-blur"
        >
            Music Collection
        </h1>
        <table v-if="collection.length > 0" class="overflow-auto">
            <colgroup>
                <col style="width: 20%" />
                <col style="width: 40%" />
                <col style="width: 35%" />
                <col style="width: 5%" />
            </colgroup>
            <thead>
                <tr class="[&>*]:text-start">
                    <th>Artist</th>
                    <th>Song</th>
                    <th>Album</th>
                    <th>Duration</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="music in collection"
                    :key="music.filePath"
                    @click="selected = music"
                    class="border-t-2 border-b-2 border-gray-700 hover:bg-gray-700 cursor-pointer [&>*]:p-2"
                >
                    <td class="text-sm text-gray-400">
                        {{ music.artists?.join(", ") ?? "No artist" }}
                    </td>
                    <td class="text-start">{{ music.title }}</td>
                    <td>{{ music.album }}</td>
                    <td>{{ formatTime(music.duration) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { type MusicData } from "@/composables/music";

defineProps<{
    collection: MusicData[];
}>();

function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

const selected = defineModel<MusicData | null>();
</script>
