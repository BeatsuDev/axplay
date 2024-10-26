<template>
    <div
        ref="container"
        class="relative w-full leading-[0] py-2 cursor-pointer select-none"
        @mousedown="startScrubbing"
    >
        <progress
            class="w-full duration-150 appearance-none h-1 [&::-webkit-progress-value]:bg-primary-500 [&::-webkit-progress-bar]:bg-gray-500"
            :value="progress"
            :max="length ?? 0"
        ></progress>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useElementBounding } from "@vueuse/core";

const props = defineProps<{
    length?: number; // The length of the track in milliseconds
}>();

const progress = defineModel<number>({ default: 0 });

// Scrubbing
const emit = defineEmits<{
    (e: "change", progress: number): void;
}>();

const container = ref<HTMLDivElement | null>(null);
const { left, right } = useElementBounding(container);

function startScrubbing(event: MouseEvent) {
    window.addEventListener("mousemove", scrub);
    window.addEventListener("mouseup", stopScrubbing);
    scrub(event);
}

function stopScrubbing() {
    window.removeEventListener("mousemove", scrub);
    window.removeEventListener("mouseup", stopScrubbing);

    emit("change", progress.value);
}

function scrub(event: MouseEvent) {
    if (!container.value) return;

    const x = event.clientX;
    const leftOffset = Math.min(
        1,
        Math.max(0, (x - left.value) / (right.value - left.value))
    );

    progress.value = leftOffset * (props.length ?? 0);
}
</script>
