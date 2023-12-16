<script setup>
import { reactive } from "vue";
import { StoreApp } from "@/services/stores";
import { useRouter } from "vue-router";
import { ToastService } from "@/utils/toast";

const TOAST = ToastService();

const ROUTER = useRouter();

const { onActionLogin } = StoreApp();

const data = reactive({
  formLogin: {
    userName: "",
    password: "",
  },

  validate: {
    userName: "",
    password: "",
  },
});

const onValidateUserName = () => {
  if (!data.formLogin.userName) {
    data.validate.userName = "Vui lòng nhập tên tài khoản";
  } else {
    data.validate.userName = "";
  }
};

const onValidatePassword = () => {
  if (!data.formLogin.password) {
    data.validate.password = "Vui lòng nhập mật khẩu";
  } else {
    data.validate.password = "";
  }
};

const onInputUpdatePassword = (event) => {
  onValidatePassword();
  data.formLogin.password = event.target.value;
};

const onValidate = () => {
  onValidateUserName();
  onValidatePassword();
};

const onValidateStop = () => {
  for (const item in data.validate) {
    if (data.validate[item]) {
      return true;
    }
  }
  return false;
};

const onClickLoginWebAdmin = async () => {
  onValidate();
  if (onValidateStop()) {
    return;
  }

  const res = await onActionLogin();

  if (
    res.some(
      ({ user_name, password }) =>
        user_name === data.formLogin.userName &&
        password === data.formLogin.password
    )
  ) {
    ROUTER.push({ name: "Home" });
    localStorage.setItem(
      "token",
      res.find(
        ({ user_name, password }) =>
          user_name === data.formLogin.userName &&
          password === data.formLogin.password
      )?.full_name
    );
  } else {
    TOAST.error("Sai tài khoản hoặc mật khẩu!");
  }
};
</script>
<template>
  <div class="flex justify-content-center align-items-center h-screen">
    <div class="flex flex-column gap-4 align-items-center">
      <div class="font-bold text-2xl text-main-color">
        Đăng nhập vào hệ thống
      </div>
      <div class="card w-23rem flex flex-column gap-3 py-4">
        <label class="flex flex-column gap-2">
          <span>Tài khoản</span>
          <div class="flex flex-column gap-1">
            <InputText
              v-model="data.formLogin.userName"
              class="w-full"
              @blur="onValidateUserName"
              @input="onValidateUserName"
              @keydown.enter="onClickLoginWebAdmin"
            />
            <small v-show="data.validate.userName" class="p-error ml-1">
              {{ data.validate.userName }}
            </small>
          </div>
        </label>

        <label class="flex flex-column gap-2">
          <span>Mật khẩu</span>
          <div class="flex flex-column gap-1">
            <Password
              class="w-full"
              :feedback="false"
              toggleMask
              inputClass="w-full"
              autocomplete="new-password"
              @input="onInputUpdatePassword"
              @blur="onValidatePassword"
              v-model="data.formLogin.password"
              @keydown.enter="onClickLoginWebAdmin"
            />
            <small v-show="data.validate.password" class="p-error ml-1">
              {{ data.validate.password }}
            </small>
          </div>
        </label>

        <Button label="Đăng nhập" @click="onClickLoginWebAdmin" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
