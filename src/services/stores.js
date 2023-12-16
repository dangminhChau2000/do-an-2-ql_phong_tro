import { defineStore } from "pinia";
import { API_APP } from "./api";
import { computed, ref } from "vue";

// export * as STORE_PERSONAL from "@/views/personal/services/store";

export const StoreApp = defineStore("StoreApp", () => {
  // State
  const loadingActive = ref(false);
  const rooms = ref([]);
  const detailRooms = ref({});

  // Quản lý người thuê trọ
  const tenant = ref([]);
  const tenantDetail = ref({});

  // Getter
  const onGetterLoadingActive = computed(() => loadingActive);
  const onGetterRooms = computed(() => rooms);
  const onGetterDetailRoom = computed(() => detailRooms);

  // Quản lý người thuê trọ
  const onGetterTenant = computed(() => tenant);
  const onGetterDetailTenant = computed(() => tenantDetail);

  // Action
  const onActionLoadingActive = (bl) => {
    loadingActive.value = bl;
  };

  const onActionLogin = async (args) => {
    onActionLoadingActive(true);
    return await API_APP.onApiLogin(args)
      .then(({ data: res }) => {
        onActionLoadingActive(false);
        return res;
      })
      .catch((error) => {
        onActionLoadingActive(false);
        console.log("Lỗi: " + error);
      });
  };

  const onActionAddInfoRoom = async (args) => {
    onActionLoadingActive(true);
    return await API_APP.onApiAddInfoRoom(args)
      .then(({ data: res }) => {
        onActionLoadingActive(false);
        return res;
      })
      .catch((error) => {
        onActionLoadingActive(false);
        console.log("Lỗi: " + error);
      });
  };

  const onActionUpdateInfoRoom = async (args) => {
    onActionLoadingActive(true);
    return await API_APP.onApiUpdateInfoRoom(args)
      .then(({ data: res }) => {
        onActionLoadingActive(false);
        return res;
      })
      .catch((error) => {
        onActionLoadingActive(false);
        console.log("Lỗi: " + error);
      });
  };

  const onActionGetRooms = async () => {
    onActionLoadingActive(true);
    return await API_APP.onApiGetRooms()
      .then(({ data: res }) => {
        onActionLoadingActive(false);
        rooms.value = res;
        return res;
      })
      .catch((error) => {
        onActionLoadingActive(false);
        console.log("Lỗi: " + error);
      });
  };

  const onActionGetDetailRoom = async (params) => {
    onActionLoadingActive(true);
    return await API_APP.onApiGetDetailRoom(params)
      .then(({ data: res }) => {
        onActionLoadingActive(false);
        detailRooms.value = res;
        return res;
      })
      .catch((error) => {
        onActionLoadingActive(false);
        console.log("Lỗi: " + error);
      });
  };

  const onActionRemoveRoom = async (params) => {
    onActionLoadingActive(true);
    return await API_APP.onApiRemoveRoom(params)
      .then(({ data: res }) => {
        onActionLoadingActive(false);
        return res;
      })
      .catch((error) => {
        onActionLoadingActive(false);
        console.log("Lỗi: " + error);
      });
  };

  // Quản lý người thuê trọ
  const onActionGetTenant = async () => {
    onActionLoadingActive(true);
    return await API_APP.onApiGetTenant()
      .then(({ data: res }) => {
        onActionLoadingActive(false);
        tenant.value = res;
        return res;
      })
      .catch((error) => {
        onActionLoadingActive(false);
        console.log("Lỗi: " + error);
      });
  };

  const onActionGetDetailTenant = async (params) => {
    onActionLoadingActive(true);
    return await API_APP.onApiGetDetailTenant(params)
      .then(({ data: res }) => {
        onActionLoadingActive(false);
        tenantDetail.value = res;
        return res;
      })
      .catch((error) => {
        onActionLoadingActive(false);
        console.log("Lỗi: " + error);
      });
  };

  const onActionAddInfoTenant = async (args) => {
    onActionLoadingActive(true);
    return await API_APP.onApiAddInfoTenant(args)
      .then(({ data: res }) => {
        onActionLoadingActive(false);
        return res;
      })
      .catch((error) => {
        onActionLoadingActive(false);
        console.log("Lỗi: " + error);
      });
  };

  const onActionUpdateInfoTenant = async (args) => {
    onActionLoadingActive(true);
    return await API_APP.onApiUpdateInfoTenant(args)
      .then(({ data: res }) => {
        onActionLoadingActive(false);
        return res;
      })
      .catch((error) => {
        onActionLoadingActive(false);
        console.log("Lỗi: " + error);
      });
  };

  const onActionRemoveTenant = async (params) => {
    onActionLoadingActive(true);
    return await API_APP.onApiRemoveTenant(params)
      .then(({ data: res }) => {
        onActionLoadingActive(false);
        return res;
      })
      .catch((error) => {
        onActionLoadingActive(false);
        console.log("Lỗi: " + error);
      });
  };

  // Quản lý thanh toán

  const onActionConfirmPay = async (params, status) => {
    onActionLoadingActive(true);
    return await API_APP.onApiConfirmPay(params, status)
      .then(({ data: res }) => {
        onActionLoadingActive(false);
        return res;
      })
      .catch((error) => {
        onActionLoadingActive(false);
        console.log("Lỗi: " + error);
      });
  };

  return {
    // Getter
    onGetterLoadingActive,

    // Quản lý phòng trọ
    onGetterRooms,
    onGetterDetailRoom,

    // Quản lý người thuê
    onGetterTenant,
    onGetterDetailTenant,

    // Action
    onActionLoadingActive,
    onActionLogin,

    // Quản lý phòng trọ
    onActionAddInfoRoom,
    onActionUpdateInfoRoom,
    onActionGetRooms,
    onActionGetDetailRoom,
    onActionRemoveRoom,

    // Quản lý người thuê
    onActionGetTenant,
    onActionGetDetailTenant,
    onActionAddInfoTenant,
    onActionUpdateInfoTenant,
    onActionRemoveTenant,

    // Quản lý thanh toán
    onActionConfirmPay,
  };
});
