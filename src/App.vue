<script setup lang="ts">
import MainLayout from "./layouts/MainLayout.vue";
import MusicCollectionPage from "./pages/MusicCollectionPage.vue";
</script>

<template>
    <div class="h-screen bg-gray-900 text-gray-50">
        <MainLayout>
            <template #aside> This is an aside </template>
            <template #main> <MusicCollectionPage /> </template>
            <template #footer>
                <p>&copy; 2021</p>
            </template>
        </MainLayout>
    </div>
</template>
