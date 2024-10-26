<script setup lang="ts">
import ResizableElement from "@/components/ResizableElement.vue";
</script>

<template>
    <div class="flex flex-col h-full">
        <div class="flex flex-1 items-stretch">
            <ResizableElement
                edge="right"
                class="border-r-2 border-gray-700 min-w-36 max-w-[50%]"
            >
                <slot name="aside"></slot>
            </ResizableElement>
            <main class="flex-1">
                <slot name="main"></slot>
            </main>
        </div>
        <ResizableElement
            edge="top"
            class="border-t-2 border-gray-700 min-h-16 max-h-36"
        >
            <slot name="footer"></slot>
        </ResizableElement>
    </div>
</template>
