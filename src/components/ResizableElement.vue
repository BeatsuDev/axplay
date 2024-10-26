<template>
    <div
        ref="container"
        class="relative"
        :style="{
            width:
                (edge === 'left' || edge === 'right') && sizeRatio
                    ? `${100 * sizeRatio}%`
                    : 'auto',
            height:
                (edge === 'top' || edge === 'bottom') && sizeRatio
                    ? `${100 * sizeRatio}%`
                    : 'auto',
        }"
    >
        <slot class=""></slot>
        <div
            @mousedown="startResize"
            @mouseup="stopResize"
            :class="`${classForEdge(edge)} select-none absolute delay-75 duration-75 bg-gray-300/0 hover:bg-gray-300/5`"
        ></div>
    </div>
</template>

<script setup lang="ts">
import { useElementBounding } from "@vueuse/core";
import { onUnmounted, ref, defineModel } from "vue";

const props = defineProps<{
    min?: number; // Minimum size in percentage of parent size
    max?: number; // Maximum size in percentage of parent size
    edge: "top" | "right" | "bottom" | "left";
}>();

const sizeRatio = defineModel<number>();

function classForEdge(edge: "top" | "right" | "bottom" | "left") {
    switch (edge) {
        case "top":
            return "left-0 right-0 -top-2 h-4 cursor-ns-resize";
        case "right":
            return "top-0 bottom-0 -right-2 w-4 cursor-ew-resize";
        case "bottom":
            return "left-0 right-0 -bottom-2 h-4 cursor-ns-resize";
        case "left":
            return "top-0 bottom-0 -left-2 w-4 cursor-ew-resize";
        default:
            return edge satisfies never;
    }
}

// Resizing logic
const container = ref<HTMLDivElement | null>(null);
const { top, right, bottom, left } = useElementBounding(container);

function startResize() {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResize);
}

function stopResize() {
    window.removeEventListener("mousemove", resize);
    window.removeEventListener("mouseup", stopResize);
}

function resize(event: MouseEvent) {
    sizeRatio.value = clampToRange(getSizeFromClick(event));
}

function getSizeFromClick(event: MouseEvent) {
    if (!container.value) {
        throw new Error("Cannot resize element. Container is not mounted.");
    }

    const parentSize = container.value?.parentElement!.getBoundingClientRect();
    switch (props.edge) {
        case "top":
            return Math.abs(event.clientY - bottom.value) / parentSize.height;
        case "bottom":
            return Math.abs(event.clientY - top.value) / parentSize.height;
        case "right":
            return Math.abs(event.clientX - left.value) / parentSize.width;
        case "left":
            return Math.abs(event.clientX - right.value) / parentSize.width;
        default:
            props.edge satisfies never;
    }

    return 0;
}

function clampToRange(value: number) {
    if (props.min !== undefined && value < props.min) {
        return props.min;
    }
    if (props.max !== undefined && value > props.max) {
        return props.max;
    }
    return value;
}

onUnmounted(() => {
    window.removeEventListener("mousemove", resize);
    window.removeEventListener("mouseup", stopResize);
});
</script>
