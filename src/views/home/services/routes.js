export default [
  {
    path: "",
    name: "Home",
    component: () => import("../Home.vue"),
  },
  {
    path: "quan-ly-phong-tro",
    name: "RoomManagement",
    component: () => import("../RoomManagement.vue"),
  },
  {
    path: "quan-ly-nguoi-thue",
    name: "TenantManagement",
    component: () => import("../TenantManagement.vue"),
  },
  {
    path: "quan-ly-thanh-toan",
    name: "PayManagement",
    component: () => import("../PayManagement.vue"),
  },
];
