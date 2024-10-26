<template>
    <div class="flex gap-3 justify-center items-center p-2">
        <PlayerButton> <ArrowsRightLeftIcon class="w-4 h-4" /> </PlayerButton>
        <PlayerButton> <BackwardIcon class="w-4 h-4" /> </PlayerButton>
        <PlayerButton> <PlayIcon class="w-7 h-7" /> </PlayerButton>
        <PlayerButton> <ForwardIcon class="w-4 h-4" /> </PlayerButton>
        <PlayerButton>
            <ArrowPathRoundedSquareIcon class="w-4 h-4" />
        </PlayerButton>
    </div>
</template>

<script setup lang="ts">
import {
    ArrowsRightLeftIcon,
    BackwardIcon,
    PlayIcon,
    ForwardIcon,
    ArrowPathRoundedSquareIcon,
} from "@heroicons/vue/16/solid";
import PlayerButton from "./PlayerButton.vue";
</script>
