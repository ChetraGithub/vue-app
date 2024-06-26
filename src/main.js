// Import libraries
import { createApp } from "vue";
import { createPinia } from "pinia";
import VueApexCharts from "vue3-apexcharts";
import firebase from "firebase";
// import OneSignal from "@onesignal/onesignal-vue3";
// import oneSignalConfig from "./onesignal";
import firebaseConfig from "./firebase";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import i18n from "./plugins/i18n";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import FlagIcon from 'vue-flag-icon'

// Import components
import PrimaryButton from "@/components/widget/button/PrimaryButton";
import SecondaryButton from "@/components/widget/button/SecondaryButton";
import DangerButton from "@/components/widget/button/DangerButton";
import DarkButton from "@/components/widget/button/DarkButton";
import BaseAlert from "@/components/widget/alert/BaseAlert";
import ResOwnerSideBar from "@/components/aside/ResOwnerSideBar";
import HeaderComponent from "@/components/widget/header/HeaderComponent";
import ProductListTable from "@/components/table/ProductListTable";
import ProductForm from "@/components/form/ProductForm";
import ProductCard from "@/components/widget/card/ProductCard";
import CategoryForm from "@/components/form/CategoryForm";
import TableForm from "@/components/form/TableForm";
import StaffCard from "@/components/widget/card/StaffCard";
import StaffForm from "@/components/form/StaffForm";
import UpdateProfileForm from "@/components/form/UpdateProfileForm";
import BaseSideBar from "@/components/aside/BaseSideBar";
import OrderListTable from "@/components/table/OrderListTable";
import BaseDialog from "@/components/widget/dialog/BaseDialog";
import ChefOrderCard from "@/components/widget/card/ChefOrderCard";
import ProductResOwnerCard from "@/components/widget/card/ProductResOwnerCard";
import SummaryComponent from "@/components/summary/SummaryComponent";
import UploadingProgress from "@/components/progress/UploadingProgress";
import CategoryCard from "@/components/widget/card/CategoryCard";
import TableCard from "@/components/widget/card/TableCard";
import AppDelay from "@/lib/components/AppDelay";
// App
const app = createApp(App);
const pinia = createPinia();

// Libs
app.component("app-delay", AppDelay);

// Cards
app.component("product-res-owner-card", ProductResOwnerCard);
app.component("product-card", ProductCard);
app.component("category-card", CategoryCard);
app.component("table-card", TableCard);
app.component("staff-card", StaffCard);
app.component("chef-order-card", ChefOrderCard);

// Sidebars
app.component("res-owner-side-bar", ResOwnerSideBar);
app.component("base-side-bar", BaseSideBar);
app.component("header-component", HeaderComponent);
app.component("summary-component", SummaryComponent);

// Forms
app.component("category-form", CategoryForm);
app.component("product-form", ProductForm);
app.component("staff-form", StaffForm);
app.component("table-form", TableForm);
app.component("update-profile-form", UpdateProfileForm);

// Tables
app.component("product-list-table", ProductListTable);
app.component("order-list-table", OrderListTable);

// Buttons
app.component("primary-button", PrimaryButton);
app.component("secondary-button", SecondaryButton);
app.component("danger-button", DangerButton);
app.component("dark-button", DarkButton);

// Alert
app.component("base-alert", BaseAlert);

// Dialog
app.component("base-dialog", BaseDialog);

// Uplaoding progress
app.component("uploading-progress", UploadingProgress);

// Initialize firebase app
firebase.initializeApp(firebaseConfig);
app.config.productionTip = false

// App uses
app
  .use(VueApexCharts)
  // .use(OneSignal, oneSignalConfig)
  .use(pinia)
  .use(i18n)
  .use(vuetify)
  .use(router)
  .use(FlagIcon)
  .mount("#app");