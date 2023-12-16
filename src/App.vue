<script setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { StoreApp } from "@/services/stores";
import TheHeader from "./components/TheHeader.vue";

const ROUTE = useRoute();

const { onActionGetTenant, onActionGetRooms } = StoreApp();

onMounted(() => {
  onActionGetTenant();
  onActionGetRooms();
});
</script>

<template>
  <div
    :class="{ 'bg-white': ROUTE.name !== 'Home' }"
    class="flex flex-column gap-3 h-screen"
  >
    <TheHeader />
    <div class="flex-1">
      <div
        :class="{
          card: ROUTE.name !== 'Home',
          'h-full': ROUTE.name === 'Home',
        }"
        class="p-4 mx-3"
      >
        <router-view />
      </div>
    </div>

    <div class="text-custom-mini text-600 w-full text-center py-3">
      Quản lý phòng trọ @2023
    </div>
  </div>
</template>

<style scoped></style>
