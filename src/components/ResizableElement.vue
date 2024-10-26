<template>
    <div ref="container" class="relative">
        <slot></slot>
        <div
            @mousedown="startResize"
            @mouseup="stopResize"
            :class="`${classForEdge(edge)} select-none absolute delay-75 duration-75 bg-gray-300/0 hover:bg-gray-300/5`"
        ></div>
    </div>
</template>

<script setup lang="ts">
/**
 * Div must be positioned relative or absolute.
 */
import { ref, onUnmounted } from "vue";

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

const container = ref<HTMLDivElement | null>(null);

const props = defineProps<{
    min?: number;
    max?: number;
    edge: "top" | "right" | "bottom" | "left";
}>();

function startResize() {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResize);
}

function stopResize() {
    window.removeEventListener("mousemove", resize);
    window.removeEventListener("mouseup", stopResize);
}

function resize(event: MouseEvent) {
    if (!container.value) {
        throw Error("Can not resize element. Container was not loaded.");
    }

    const currentSize = getSize(event);

    if (props.min && currentSize < (props.min ?? 0)) return;
    if (props.max && currentSize > (props.max ?? 0)) return;

    switch (props.edge) {
        case "top":
        case "bottom":
            container.value.style.height = `${currentSize}px`;
            break;
        case "right":
        case "left":
            container.value.style.width = `${currentSize}px`;
            break;
        default:
            props.edge satisfies never;
    }
}

function getSize(event: MouseEvent) {
    if (!container.value) {
        throw Error("Can not resize element. Container was not loaded.");
    }

    const boundingBox = container.value.getBoundingClientRect();
    switch (props.edge) {
        case "top":
            return Math.abs(event.clientY - boundingBox.bottom);
        case "right":
            return Math.abs(event.clientX - boundingBox.left);
        case "bottom":
            return Math.abs(event.clientY - boundingBox.top);
        case "left":
            return Math.abs(event.clientX - boundingBox.right);
        default:
            return props.edge satisfies never;
    }
}

onUnmounted(() => {
    window.removeEventListener("mousemove", resize);
    window.removeEventListener("mouseup", stopResize);
});
</script>
