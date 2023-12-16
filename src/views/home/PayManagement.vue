<script setup>
import { formatDate, formatToVND } from "@/utils";
import { StoreApp } from "@/services/stores";
import { computed, ref } from "vue";

const { onGetterTenant: tenant, onGetterRooms, onActionConfirmPay, onActionGetTenant } = StoreApp();

const tabMenus = computed(() => [
  { name: "Tất cả", code: "ALL" },
  { name: "Chưa thanh toán", code: "CTT" },
  { name: "Đã thanh toán", code: "DTT" },
  { name: "Thống kê", code: "TK" },
]);

const tabIndex = ref(0);

const selected = ref([]);

const valueTable = computed(() => {
  const tenantList = tenant.value.filter(
      (item) =>
          +item?.rentedDate?.split("/")[0] <=
          +formatDate(new Date()).split(" ")[0]
      );
  switch (tabIndex.value) {
    case 0:
    case 3:
      return tenantList;
    case 1:
      return tenantList.filter((item) => +item?.status !== +new Date().getMonth() + 1);
    case 2:
      return tenantList.filter((item) => +item?.status === +new Date().getMonth() + 1);
  }
});

const onClickConfirmPay = async () => {
  for (const id of selected.value.map(({ id }) => id)) {
    await onActionConfirmPay(id, `${new Date().getMonth() + 1}`);
  }
  onActionGetTenant();
};

const onReturnPriceRoom = (value) => {
  return formatToVND(onGetterRooms.value.find(({ name}) => name === value)?.price);
}

const onReturnPrice = (type, value1, value2) => {
  const price = value1.map((item) => {
    return {
    ...item,
    price: value2.find(({ name }) => name === item?.rentedRoom)?.price,
  }
  });

  switch (type) {
    case "TONG":
      return formatToVND(price.reduce((previous, current) => previous + +current.price, 0));
    case "DA_THANH_TOAN":
      return formatToVND(price.filter(({ status }) => +status === +new Date().getMonth() + 1).reduce((previous, current) => previous + +current.price, 0));
    case "CON_NO":
      return formatToVND(price.filter(({ status }) => +status !== +new Date().getMonth() + 1).reduce((previous, current) => previous + +current.price, 0));
  }
};
</script>

<template>
  <div class="flex flex-column gap-3">
    <span class="font-bold text-2xl">
      Danh sách trọ đến hạn thanh toán trong tháy nàng
    </span>
    <TabView v-model:activeIndex="tabIndex">
      <TabPanel
        v-for="(tab, index) in tabMenus"
        :key="index"
        :header="tab.name"
      >
        <div v-if="index === 3" class="flex flex-column gap-2">
          <span>Tổng doanh thu tháng này: {{ onReturnPrice("TONG", valueTable, onGetterRooms) }}</span>
          <span>Đã thanh toán: {{ onReturnPrice("DA_THANH_TOAN", valueTable, onGetterRooms) }}</span>
          <span>Còn nợ: {{ onReturnPrice("CON_NO", valueTable, onGetterRooms) }}</span>
        </div>

        <DataTable v-else
          :value="valueTable"
          v-model:selection="selected"
          tableStyle="min-width: 40rem"
        >
          <template v-if="index === 1" #header>
            <div class="flex gap-2">
              <Button label="Xác nhận thanh toán" @click="onClickConfirmPay" />
            </div>
          </template>

          <Column
            v-if="index === 1"
            selectionMode="multiple"
            headerStyle="width: 3rem"
          />

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
            field="rentedRoom"
            header="Giá phòng"
            headerClass="white-space-nowrap"
            class="w-10rem"
          >
          <template #body="{ data }">
            <span>{{ onReturnPriceRoom(data.rentedRoom) }}</span>
          </template>
          </Column>

          <Column
            field="rentedDate"
            header="Ngày thuê"
            headerClass="white-space-nowrap"
            class="w-10rem"
          />

          <Column
            field="status"
            header="Thanh toán"
            headerClass="white-space-nowrap"
            style="min-width: 13rem"
          >
            <template #body="{ data }">
              <span
                :class="[
                  'p-2 border-round-2xl',
                  +data?.status === +new Date().getMonth() + 1 ? 'opacity-blue' : 'opacity-red',
                ]"
              >
                {{ +data?.status === +new Date().getMonth() + 1 ? "Đã thanh toán" : "Chưa thanh toán" }}
              </span>
            </template>
          </Column>

          <template #empty>
            <div class="flex justify-content-center">
              Không tìm thấy kết quả nào
            </div>
          </template>
        </DataTable>
      </TabPanel>
    </TabView>
  </div>
</template>

<style scoped>
.opacity-red {
  color: red;
  background-color: rgba(255, 0, 0, 0.233);
}

.opacity-blue {
  color: blue;
  background-color: rgba(0, 0, 255, 0.267);
}
</style>
