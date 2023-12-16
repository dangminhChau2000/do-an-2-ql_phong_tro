<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import { formatToVND } from "@/utils";
import { StoreApp } from "@/services/stores";
import { ToastService } from "@/utils/toast";

const TOAST = ToastService();

const {
  onActionAddInfoRoom,
  onActionUpdateInfoRoom,
  onActionGetRooms,
  onActionGetDetailRoom,
  onActionRemoveRoom,

  onGetterRooms,
  onGetterDetailRoom,
} = StoreApp();

const data = reactive({
  formInfoRoom: {
    name: "",
    image: "",
    price: null,
    size: null,
    amountRoom: null,
    utilities: "",
    status: "Chưa cho thuê",
  },
  selectedRoom: [],
  display: false,
  popupDetail: {
    title: "Thêm phòng trọ",
  },
});

const roomName = ref("");

const roomList = ref([]);

const err = reactive({
  price: null,
  size: null,
  amountRoom: null,
});

const onClickOpenPopup = (value) => {
  data.display = true;

  if (value === "create") {
    data.popupDetail.title = "Thêm phòng trọ";
    data.formInfoRoom = {
      name: "",
      image: "",
      price: null,
      size: null,
      amountRoom: null,
      utilities: "",
      status: "Chưa cho thuê",
    };
  } else {
    data.popupDetail.title = "Cập nhật thông tin phòng";
    onActionGetDetailRoom(value?.data?.id);
  }
};

const onValidateNumber = (key) => {
  if (isNaN(data.formInfoRoom[key])) {
    err[key] = "Trường này bắt buộc là số";
  } else {
    err[key] = null;
  }
};

const onCheckValidate = () => {
  let result = false;
  Object.keys(err).forEach((key) => {
    if (err[key]) result = true;
  });

  return result;
};

const onClickSaveInfoRoom = async () => {
  if (onCheckValidate()) return;

  if (data.popupDetail.title === "Thêm phòng trọ") {
    await onActionAddInfoRoom(data.formInfoRoom);
  } else {
    await onActionUpdateInfoRoom(data.formInfoRoom);
  }

  TOAST.success("Lưu dữ liệu phòng thành công!");
  data.display = false;
  onActionGetRooms();
};

const onClickRemoveRooms = async () => {
  for (const room of data.selectedRoom) {
    await onActionRemoveRoom(room.id);
  }

  TOAST.success("Xóa phòng thành công!");
  onActionGetRooms();
};

const onCheckNull = () => {
  let result = false;
  Object.keys(data.formInfoRoom).forEach((key) => {
    if (!data.formInfoRoom[key]) result = true;
  });

  return result;
};

const onSearch = () => {
  if (roomName.value) {
    roomList.value = onGetterRooms.value.filter(
      (item) => item?.name.toLowerCase().includes(roomName.value.toLowerCase())
    );
  } else {
    roomList.value = onGetterRooms.value;
  }
};

watch(onGetterDetailRoom, (value) => {
  data.formInfoRoom = value;
});

watch(onGetterRooms, (value) => {
  roomList.value = value;
});

onMounted(() => {
  onActionGetRooms();
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
        <span>Tên phòng:</span>
        <InputText v-model="data.formInfoRoom.name" />
      </label>

      <label class="flex flex-column gap-2">
        <span>Ảnh phòng:</span>
        <InputText v-model="data.formInfoRoom.image" />
      </label>

      <label class="flex flex-column gap-2">
        <span>Giá phòng:</span>
        <div class="flex flex-column gap-1">
          <InputText
            v-model="data.formInfoRoom.price"
            @change="onValidateNumber('price')"
          />
          <small class="p-error text-custom-mini" v-show="err.price">
            {{ err.price }}
          </small>
        </div>
      </label>

      <label class="flex flex-column gap-2">
        <span>Kích thước phòng (m2):</span>
        <div class="flex flex-column gap-1">
          <InputText
            v-model="data.formInfoRoom.size"
            @change="onValidateNumber('size')"
          />
          <small class="p-error text-custom-mini" v-show="err.size">
            {{ err.size }}
          </small>
        </div>
      </label>

      <label class="flex flex-column gap-2">
        <span>Số lượng phòng:</span>
        <div class="flex flex-column gap-1">
          <InputText
            v-model="data.formInfoRoom.amountRoom"
            @change="onValidateNumber('amountRoom')"
          />
          <small class="p-error text-custom-mini" v-show="err.amountRoom">
            {{ err.amountRoom }}
          </small>
        </div>
      </label>

      <label class="flex flex-column gap-2">
        <span>Tiện ích:</span>
        <InputText v-model="data.formInfoRoom.utilities" />
      </label>

      <label class="flex flex-column gap-2">
        <span>Trạng thái:</span>
        <Dropdown
          v-model="data.formInfoRoom.status"
          :options="['Chưa cho thuê', 'Đã cho thuê']"
          placeholder="Chọn trạng thái"
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
    <span class="font-bold text-2xl">Quản lý phòng trọ</span>
    <DataTable
      :value="roomList"
      v-model:selection="data.selectedRoom"
      tableStyle="min-width: 50rem"
      @row-dblclick="onClickOpenPopup($event)"
    >
      <template #header>
        <div class="flex justify-content-between">
          <div class="flex gap-2">
            <Button label="Thêm phòng" @click="onClickOpenPopup('create')" />

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
                v-model="roomName"
                placeholder="Tìm theo tên phòng"
                @keypress.enter="onSearch"
              />
            </span>
          </div>
        </div>
      </template>
      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
      <Column
        field="name"
        header="Tên phòng"
        headerClass="white-space-nowrap"
        class="w-10rem"
      />

      <Column
        field="image"
        header="Ảnh"
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
        field="price"
        header="Giá"
        headerClass="white-space-nowrap"
        class="w-10rem"
      >
        <template #body="{ data }">
          <span>{{ formatToVND(data?.price) }}</span>
        </template>
      </Column>

      <Column
        field="size"
        header="Kích thước"
        headerClass="white-space-nowrap"
        class="w-10rem"
      />

      <Column
        field="amountRoom"
        header="Số lượng phòng"
        headerClass="white-space-nowrap"
        class="w-10rem"
      />

      <Column
        field="utilities"
        header="Các tiện ích"
        headerClass="white-space-nowrap"
        class="w-15rem"
      >
        <template #body="{ data }">
          <span class="fixed-text">{{ data?.utilities }}</span>
        </template>
      </Column>

      <Column
        field="status"
        header="Trạng thái"
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
