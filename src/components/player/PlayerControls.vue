<template>
    <div
        class="flex gap-3 justify-center items-center p-2 [&>*>*]:hover:[&>*]:fill-primary-400"
    >
        <PlayerButton>
            <ArrowsRightLeftIcon class="w-4 h-4" />
        </PlayerButton>
        <PlayerButton>
            <BackwardIcon class="w-4 h-4" />
        </PlayerButton>
        <PlayerButton @click="playing = !playing">
            <PlayIcon v-if="!playing" class="w-7 h-7" />
            <PauseIcon v-else class="w-7 h-7" />
        </PlayerButton>
        <PlayerButton>
            <ForwardIcon class="w-4 h-4" />
        </PlayerButton>
        <PlayerButton @click="incrementRepeat">
            <ArrowPathIcon
                v-if="repeat !== 'all'"
                class="w-4 h-4"
                :class="{ 'fill-primary-500': repeat !== 'none' }"
            />
            <ArrowPathRoundedSquareIcon
                v-else
                class="w-4 h-4 fill-primary-500"
            />
        </PlayerButton>
    </div>
</template>

<script setup lang="ts">
import {
    ArrowsRightLeftIcon,
    BackwardIcon,
    PlayIcon,
    PauseIcon,
    ForwardIcon,
    ArrowPathIcon,
    ArrowPathRoundedSquareIcon,
} from "@heroicons/vue/16/solid";
import PlayerButton from "./PlayerButton.vue";

const playing = defineModel<boolean>("playing", { required: true });

// Repeat logic
const repeat = defineModel<"none" | "one" | "all">("repeat", {
    required: true,
});

function incrementRepeat() {
    switch (repeat.value) {
        case "none":
            repeat.value = "one";
            break;
        case "one":
            repeat.value = "all";
            break;
        case "all":
            repeat.value = "none";
            break;
    }
}
</script>
