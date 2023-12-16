<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const ROUTER = useRouter();

const token = localStorage.getItem("token");

const visible = ref(false);

const menuOption = [
  {
    name: "Quản lý phòng trọ",
    code: "QLPT",
  },
  {
    name: "Quản lý người thuê",
    code: "QLNT",
  },
  {
    name: "Quản lý thanh toán",
    code: "QLTT",
  },
];

const onClickMenuItem = (code) => {
  switch (code) {
    case "QLPT":
      ROUTER.push({ name: "RoomManagement" });
      break;
    case "QLNT":
      ROUTER.push({ name: "TenantManagement" });
      break;
    case "QLTT":
      ROUTER.push({ name: "PayManagement" });
      break;
    case "QLPT":
      //
      break;
    default:
      //
      break;
  }
  visible.value = false;
};

const onClickLogout = () => {
  localStorage.removeItem("token");
  ROUTER.push({ name: "Login" });
};
</script>

<template>
  <Sidebar v-model:visible="visible">
    <div class="flex flex-column">
      <span
        v-for="(item, index) in menuOption"
        :key="index"
        class="memu-item p-3 border-round-lg on-click"
        @click="onClickMenuItem(item.code)"
      >
        {{ item.name }}
      </span>
    </div>
  </Sidebar>
  <div
    class="w-full box-shadow flex align-items-center justify-content-between px-5 py-2 bg-white"
  >
    <div class="flex align-items-center gap-5">
      <div
        class="icon w-3rem h-3rem border-circle flex align-items-center justify-content-center on-click"
        @click="visible = true"
      >
        <i style="font-size: 1.2rem" class="pi pi pi-bars on-click" />
      </div>

      <img
        class="w-10rem on-click"
        src="https://quanlytro.me/images/logo-quan-ly-tro.png"
        alt="Lỗi ảnh"
        @click="ROUTER.push({ name: 'Home' })"
      />
    </div>

    <!-- Thông tin người dùng -->
    <div class="info flex align-items-center gap-2 relative">
      <span class="cursor-pointer font-bold">{{ token }} (Chủ trọ)</span>
      <i class="pi pi-angle-down" />

      <div
        class="log-out text-center on-click w-10rem bg-white box-shadow p-3 border-round-lg p-error absolute top-100 right-0"
      >
        <span
          @click="onClickLogout"
          class="flex align-items-center justify-content-center gap-2"
        >
          <i class="pi pi-sign-out" />
          Đăng xuất
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.memu-item:hover {
  background-color: rgb(240, 240, 240);
}

.log-out {
  display: none;
}

.info:hover .log-out {
  display: block !important;
}

.icon {
  transition: all 0.2s ease;
}

.icon:hover {
  background-color: rgb(228, 228, 228);
}
</style>
