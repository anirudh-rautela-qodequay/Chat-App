import BaseApiConfig from "./Api_BaseApi";
import BaseApi from "../config";
import URL from "./Endpoints";
const API = {
  Auth: {
    Register: (props: any) => {
      const url = `${BaseApi.baseUrl}${URL.Auth.Register}`;
      return BaseApiConfig({
        method: "POST",
        url: url,
        data: props?.data,
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    Login: (props: any) => {
      const url = `${BaseApi.baseUrl}${URL.Auth.Login}`;
      return BaseApiConfig({
        method: "POST",
        url: url,
        data: props?.data,
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    LogOut: (props?: any) => {
      const url = `${BaseApi.baseUrl}new-auth/logout`;
      return BaseApiConfig({
        method: "POST",
        url: url,
        data: props?.data,
        tokenRequired: true,
      });
    },
    SetPassword: (props: any) => {
      const url = `${BaseApi.baseUrl}auth/reset_password`;

      return BaseApiConfig({
        method: "POST",
        url: url,
        data: props?.data,
      });
    },
    ResetPassword: (props: any) => {
      const url = `${BaseApi.baseUrl}auth/set_password`;

      return BaseApiConfig({
        method: "POST",
        url: url,
        data: props?.data,
      });
    },
  },
  User: {
    Me: () => {
      const url = `${BaseApi.baseUrl}${URL.User.Me}`;
      return BaseApiConfig({
        method: "GET",
        url: url,
        tokenRequired: true,
      });
    },
    AllUsers: () => {
      const url = `${BaseApi.baseUrl}${URL.User.AllUsers}`;
      return BaseApiConfig({
        method: "GET",
        url: url,
        tokenRequired: true,
      });
    },
  },
  Chat: {
    UserChats: (props: any) => {
      const url = `${BaseApi.baseUrl}${URL.Chat.UserChats}`;
      return BaseApiConfig({
        method: "POST",
        url: url,
        data: props?.data,
        tokenRequired: true,
        // headers: { "Content-Type": "multipart/form-data" },
      });
    },
    SendMessage: (props: any) => {
      const url = `${BaseApi.baseUrl}${URL.Chat.SendMessage}`;
      return BaseApiConfig({
        method: "POST",
        url: url,
        data: props?.data,
        tokenRequired: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
  },
};

export default API;
