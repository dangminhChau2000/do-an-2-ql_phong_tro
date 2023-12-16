import axios from "axios";

// export * as API_PERSONAL from "@/views/personal/services/api";

class ApiApp {
  onApiLogin = async () => {
    return await AxiosInstance({
      method: "GET",
      url: "account",
    });
  };

  onApiAddInfoRoom = async (args) => {
    return await AxiosInstance({
      method: "POST",
      url: "rooms",
      data: args,
    });
  };

  onApiUpdateInfoRoom = async (args) => {
    return await AxiosInstance({
      method: "PUT",
      url: `rooms/${args?.id}`,
      data: args,
    });
  };

  onApiGetRooms = async () => {
    return await AxiosInstance({
      method: "GET",
      url: "rooms",
    });
  };

  onApiGetDetailRoom = async (params) => {
    return await AxiosInstance({
      method: "GET",
      url: `rooms/${params}`,
    });
  };

  onApiRemoveRoom = async (params) => {
    return await AxiosInstance({
      method: "DELETE",
      url: `rooms/${params}`,
    });
  };

  // Quản lý người thuê trọ
  onApiGetTenant = async () => {
    return await AxiosInstance1({
      method: "GET",
      url: "tenant",
    });
  };

  onApiGetDetailTenant = async (params) => {
    return await AxiosInstance1({
      method: "GET",
      url: `tenant/${params}`,
    });
  };

  onApiAddInfoTenant = async (args) => {
    return await AxiosInstance1({
      method: "POST",
      url: "tenant",
      data: { ...args, status: "0" },
    });
  };

  onApiUpdateInfoTenant = async (args) => {
    return await AxiosInstance1({
      method: "PUT",
      url: `tenant/${args?.id}`,
      data: args,
    });
  };

  onApiRemoveTenant = async (params) => {
    return await AxiosInstance1({
      method: "DELETE",
      url: `tenant/${params}`,
    });
  };

  // Quản lý thanh toán
  onApiConfirmPay = async (params, status) => {
    return await AxiosInstance1({
      method: "PUT",
      url: `tenant/${params}`,
      data: {
        status,
      },
    });
  };
}

export const API_APP = new ApiApp();

const AxiosInstance = axios.create({
  baseURL: "https://6406ba3a862956433e582c80.mockapi.io/",
});

const AxiosInstance1 = axios.create({
  baseURL: "https://63cdf36dd2e8c29a9bce8f97.mockapi.io/",
});

export { AxiosInstance, AxiosInstance1 };
