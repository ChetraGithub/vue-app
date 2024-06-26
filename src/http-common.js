// Reference from: https://stackoverflow.com/questions/66891025/how-to-retreive-json-web-token-with-axios-in-vue

import axios from "axios";
import { storeToRefs } from "pinia";
import { useCookieStore } from "@/stores/cookie";
import { useLoadingStore } from "@/lib/state/loading/loading";
import router from "@/router/index";

const BASE_URL = process.env.VUE_APP_API_URL;
const http = axios.create({
  baseURL: BASE_URL,
});

http.interceptors.request.use((config) => {
  const { getCookie } = useCookieStore();
  const { isLoading } = storeToRefs(useLoadingStore());
  isLoading.value = true;
  const token = getCookie("user_token");
  if (token) {
    // config.headers.Authorization = `Bearer ${token}`;
    config.headers["x-access-token"] = token;
  }
  config.headers["Content-Type"] = "application/json";
  return config;
});

http.interceptors.response.use(
  (response) => {
    const { isLoading } = storeToRefs(useLoadingStore());
    isLoading.value = false;
    return response;
  },
  async (error) => {
    // const router = useRouter();
    const { removeCookie } = useCookieStore();
    const { isLoading } = storeToRefs(useLoadingStore());
    isLoading.value = false;
    if (error.request.status === 401) {
      console.log(error.request.status);
      removeCookie("user_token");
      removeCookie("user_role");
      removeCookie("user");
      router.push("/login");
    }
    return Promise.reject(error);
  }
);
export default http;
