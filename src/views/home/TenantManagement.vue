<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { StoreApp } from "@/services/stores";
import { ToastService } from "@/utils/toast";
import { formatToVND } from "@/utils";

const TOAST = ToastService();

const {
  onActionAddInfoTenant,
  onActionUpdateInfoTenant,
  onActionGetTenant,
  onActionGetDetailTenant,
  onActionRemoveTenant,

  onGetterTenant,
  onGetterDetailTenant,
  onGetterRooms,
} = StoreApp();

const data = reactive({
  formInfoTenant: {
    name: "",
    image: "",
    phoneNumber: null,
    address: "",
    rentedRoom: "",
    rentedDate: "",
  },
  selectedRoom: [],
  display: false,
  popupDetail: {
    title: "Thêm thông tin người thuê trọ",
  },
});

const renter = ref("");

const tenantList = ref([]);

const roomsOption = computed(() =>
  onGetterRooms.value.map(({ name }) => ({ name }))
);

const onReturnPriceRoom = () => {
  return formatToVND(onGetterRooms.value.find(({ name}) => name === data.formInfoTenant.rentedRoom)?.price);
}

const onClickOpenPopup = (value) => {
  data.display = true;
  if (value === "create") {
    data.popupDetail.title = "Thêm thông tin người thuê trọ";
    data.formInfoTenant = {
      name: "",
      image: "",
      phoneNumber: null,
      address: "",
      rentedRoom: "",
    };
  } else {
    data.popupDetail.title = "Sửa thông tin người thuê trọ";
    onActionGetDetailTenant(value?.data?.id);
  }
};

const onClickSaveInfoRoom = async () => {
  if (data.popupDetail.title === "Thêm thông tin người thuê trọ") {
    await onActionAddInfoTenant(data.formInfoTenant);
  } else {
    await onActionUpdateInfoTenant(data.formInfoTenant);
  }

  TOAST.success("Lưu dữ liệu phòng thành công!");
  data.display = false;
  onActionGetTenant();
};

const onClickRemoveRooms = async () => {
  for (const room of data.selectedRoom) {
    await onActionRemoveTenant(room.id);
  }

  TOAST.success("Xóa phòng thành công!");
  onActionGetTenant();
};

const onChangeRoom = ({ value }) => {
  const result = onGetterTenant.value.some(
    ({ rentedRoom }) => rentedRoom === value
  );
  if (result) {
    TOAST.warn(`${value} đã có người thuê!`);
    data.formInfoTenant.rentedRoom = null;
  }
};

const onCheckNull = () => {
  let result = false;
  Object.keys(data.formInfoTenant).forEach((key) => {
    if (!data.formInfoTenant[key]) result = true;
  });

  Object.keys(onGetterDetailTenant.value).forEach((key) => {
    if (!onGetterDetailTenant.value[key]) result = true;
  });

  return result;
};

const onSearch = () => {
  if (renter.value) {
    tenantList.value = onGetterTenant.value.filter(
      (item) => item?.name.toLowerCase().includes(renter.value.toLowerCase())
    );
  } else {
    tenantList.value = onGetterTenant.value
  }
};

watch(onGetterDetailTenant, (value) => {
  data.formInfoTenant = value;
});

watch(onGetterTenant, (value) => {
  tenantList.value = value;
})

onMounted(() => {
  onActionGetTenant();
});
</script>

<template>
  <Dialog
    v-model:visible="data.display"
    modal
    :header="data.popupDetail.title"
    class="w-30rem"
  >
    <div class="flex flex-column gap-3">
      <label class="flex flex-column gap-2">
        <span>Tên người thuê:</span>
        <InputText v-model="data.formInfoTenant.name" />
      </label>

      <label class="flex flex-column gap-2">
        <span>Ảnh người thuê (đường dẫn ảnh):</span>
        <InputText v-model="data.formInfoTenant.image" />
      </label>

      <label class="flex flex-column gap-2">
        <span>Số điện thoại:</span>
        <InputText v-model="data.formInfoTenant.phoneNumber" />
      </label>

      <label class="flex flex-column gap-2">
        <span>Địa chỉ người thuê phòng:</span>
        <InputText v-model="data.formInfoTenant.address" />
      </label>

      <label class="flex flex-column gap-2">
        <span>Phòng thuê:</span>
        <Dropdown
          v-model="data.formInfoTenant.rentedRoom"
          :options="roomsOption"
          optionLabel="name"
          optionValue="name"
          placeholder="Chọn phòng thuê"
          @change="onChangeRoom"
        />
      </label>

      <label>
        <span class="p-error">Giá phòng: {{ onReturnPriceRoom() }}</span>
      </label>

      <label class="flex flex-column gap-2">
        <span>Ngày thuê:</span>
        <InputText
          v-model="data.formInfoTenant.rentedDate"
          placeholder="Ví dụ: 01/01/2023 (lưu ý viết đúng định dạng)"
        />
      </label>
    </div>
    <template #footer>
      <Button
        label="Bỏ qua"
        @click="data.display = false"
        class="p-button-outlined"
      />
      <Button
        label="Lưu"
        @click="onClickSaveInfoRoom"
        :disabled="onCheckNull()"
        autofocus
      />
    </template>
  </Dialog>

  <div class="flex flex-column gap-3">
    <span class="font-bold text-2xl">Quản lý người thuê trọ</span>
    <DataTable
      :value="tenantList"
      v-model:selection="data.selectedRoom"
      tableStyle="min-width: 40rem"
      @row-dblclick="onClickOpenPopup($event)"
    >
      <template #header>
        <div class="flex justify-content-between">
          <div class="flex gap-2">
            <Button label="Thêm người" @click="onClickOpenPopup('create')" />

            <Button
              label="Xóa phòng"
              class="p-button-danger"
              @click="onClickRemoveRooms"
              :disabled="!data?.selectedRoom[0]"
            />
          </div>

          <div>
            <span class="p-input-icon-right">
              <i class="pi pi-search" @click="onSearch" />
              <InputText
                v-model="renter"
                placeholder="Tìm theo tên người thuê"
                @keypress.enter="onSearch"
              />
            </span>
          </div>
        </div>
      </template>
      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
      <Column
        field="name"
        header="Tên người thuê"
        headerClass="white-space-nowrap"
        class="w-10rem"
      />

      <Column
        field="image"
        header="Ảnh người thuê"
        headerClass="white-space-nowrap"
        class="w-10rem"
      >
        <template #body="{ data }">
          <img
            class="w-7rem h-5rem object-fit-cover"
            :src="data?.image"
            alt="Lỗi ảnh"
          />
        </template>
      </Column>

      <Column
        field="phoneNumber"
        header="Số điện thoại"
        headerClass="white-space-nowrap"
        class="w-10rem"
      >
        <template #body="{ data }">
          <span>{{ data?.phoneNumber }}</span>
        </template>
      </Column>

      <Column
        field="address"
        header="Địa chỉ người thuê"
        headerClass="white-space-nowrap"
        class="w-15rem"
      >
        <template #body="{ data }">
          <span class="fixed-text">{{ data?.address }}</span>
        </template>
      </Column>

      <Column
        field="rentedRoom"
        header="Phòng thuê"
        headerClass="white-space-nowrap"
        class="w-10rem"
      />

      <Column
        field="rentedDate"
        header="Ngày thuê"
        headerClass="white-space-nowrap"
        class="w-10rem"
      />

      <template #empty>
        <div class="flex justify-content-center">
          Không tìm thấy kết quả nào
        </div>
      </template>
    </DataTable>
  </div>
</template>

<style scoped></style>
