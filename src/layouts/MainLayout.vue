<script setup lang="ts">
import ResizableElement from "@/components/ResizableElement.vue";
</script>

<template>
    <div class="flex flex-col h-full">
        <div class="flex flex-1 items-stretch min-h-0">
            <ResizableElement
                edge="right"
                class="border-r-2 border-gray-700 min-w-36 max-w-[50%]"
            >
                <aside class="h-full w-full">
                    <slot name="aside"></slot>
                </aside>
            </ResizableElement>
            <main class="flex-1 min-h-0 overflow-auto">
                <slot name="main"></slot>
            </main>
        </div>
        <ResizableElement
            edge="top"
            class="border-t-2 border-gray-700 min-h-28 max-h-36"
        >
            <footer class="h-full w-full">
                <slot name="footer"></slot>
            </footer>
        </ResizableElement>
    </div>
</template>
