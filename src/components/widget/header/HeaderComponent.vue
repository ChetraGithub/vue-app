<template>
  <v-app-bar class="bg-transparent">
    <div
      :class="`w-100 ml-2 px-3 py-2 bg-grey-darken-2 rounded-lg d-flex align-center justify-space-between ${props.class}`"
    >
      <span class="text-white">{{ props.title }}</span>
      <div class="w-50">
        <slot></slot>
      </div>
      <div>
        <v-menu rounded>
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props">
              <v-avatar class="profile" size="large">
                <v-img
                  v-if="userData.image"
                  :src="userData.image"
                  :alt="userData.first_name"
                  cover
                ></v-img>
                <span v-else class="text-h5 text-white">{{ initials }}</span>
              </v-avatar>
            </v-btn>
          </template>
          <v-card class="bg-grey-darken-2 rounded-lg mt-3 px-5 py-2">
            <v-card-text>
              <div class="mx-auto text-center">
                <v-avatar class="profile" size="72">
                  <v-img
                    v-if="userData.image"
                    :src="userData.image"
                    :alt="userData.first_name"
                    cover
                  ></v-img>
                  <span v-else class="text-h4 text-white">{{ initials }}</span>
                </v-avatar>
                <h3>{{ userData.first_name }} {{ userData.last_name }}</h3>
                <p class="font-inter text-subtitle-1 mt-1">
                  {{ userData.email }}
                </p>
                <p
                  class="text-left ml-5 font-inter cursor text-subtitle-1"
                  @click="$router.push('/store')"
                >
                  <v-icon icon="mdi-store-cog" color="white" size="small"></v-icon>
                  {{ $t("app.header.sitting.manageStore") }}
                </p>
                <p
                  class="text-left ml-5 font-inter cursor text-subtitle-1 mt-1"
                  @click="$router.push('/manage_account')"
                >
                  <v-icon icon="mdi-cog" color="white" size="small"></v-icon>
                  {{ $t("app.header.sitting.manageAcc") }}
                </p>
                <p
                  class="text-left ml-5 font-inter cursor text-subtitle-1"
                  @click="$router.push('/change_password')"
                >
                  <v-icon icon="mdi-shield-lock-outline" color="white" size="small"></v-icon>
                  {{ $t("app.header.sitting.password") }}
                </p>
                <v-divider class="my-3"></v-divider>
                <div class="d-flex justify-center">
                  <danger-button @click="isLogout = true">
                    <v-icon
                      icon="mdi-logout"
                      color="white"
                      size="large"
                    ></v-icon>
                    {{ $t("app.auth.logout") }}
                  </danger-button>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
      </div>
    </div>
  </v-app-bar>

  <base-dialog
    v-model="isLogout"
    title="Log out"
    ms="Are you sure you want to log out?"
  >
    <danger-button @click="isLogout = false">
      <v-icon icon="mdi-close-box-multiple" color="white" size="large"></v-icon>
      Cancel
    </danger-button>
    <primary-button @click="logout">
      <v-icon
        icon="mdi-checkbox-multiple-marked"
        color="white"
        size="large"
      ></v-icon>
      Confirm
    </primary-button>
  </base-dialog>
</template>

<script setup>
// import http from "@/http-common";
import { defineProps, ref } from "vue";
import { useCookieStore } from "@/stores/cookie";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed } from "vue";

// Variables
const props = defineProps(["title", "class"]);
const isLogout = ref(false);
const router = useRouter();
const { removeCookie } = useCookieStore();
const { userData } = storeToRefs(useUserStore());
const initials = computed(() => {
  const { first_name, last_name } = userData.value;
  return (
    first_name.slice(0, 1).toUpperCase() + last_name.slice(0, 1).toUpperCase()
  );
});

// Method
const logout = async () => {
  try {
    // await http.post("logout");
    isLogout.value = false;
    removeCookie("user_token");
    removeCookie("user_role");
    removeCookie("user");
    router.push("/login");
  } catch (err) {
    console.log(err);
  }
};
</script>

<style scoped>
.font-inter {
  font-family: "Inter", 'Noto Serif Khmer', sans-serif, serif !important;
}
.profile {
  background: #2c2c2c;
}
.cursor {
  cursor: pointer;
}
</style>
