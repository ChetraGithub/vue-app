<template>
  <v-layout>
    <!-- Nav -->
    <header-component :class="'m-auto'">
      <v-text-field
        v-model="keyword"
        class="search text-white rounded-lg"
        density="compact"
        variant="solo"
        :label="$t('waiter.search')"
        append-inner-icon="mdi-magnify"
        single-line
        hide-details
      ></v-text-field>
    </header-component>

    <v-main class="mt-2 mb-15">
      <v-tabs
        v-model="filterValue"
        class="text-white mb-3"
        color="red-accent-2"
        align-tabs="center"
      >
        <v-tab :value="'all'">{{ $t("waiter.all") }}</v-tab>
        <v-tab
          v-for="category in categories"
          :key="category._id"
          :value="category._id"
          >{{ category.name }}</v-tab
        >
      </v-tabs>

      <v-select
        v-model="table"
        :items="tables"
        return-object
        :item-title="'table_number'"
        :item-value="'table'"
        class="select-table ml-2 mb-2 rounded-lg text-white bg-grey-darken-2"
        hide-details="auto"
        :label="$t('waiter.selectTable')"
        @update:model-value="tableSelected"
      ></v-select>

      <header class="text-center text-white text-h5 font-weight-bold font-inter">
        {{ $t("waiter.product") }}
      </header>

      <!-- List products -->
      <div v-if="producties.length > 0" class="grid-container gap-2 mx-2 mt-2">
        <product-card
          v-for="product in producties"
          :key="product._id"
          :product="product"
          @on-customize="onCustomize"
        ></product-card>
      </div>

      <v-container v-else>
        <h4 class="mt-5 text-center text-white">{{ $t("app.noData") }}</h4>
      </v-container>
    </v-main>
  </v-layout>

  <!-- A product customize -->
  <v-card v-if="productCustomize" class="overflow-visible d-zoom">
    <v-layout class="d-zoom">
      <v-navigation-drawer
        v-model="isCustomize"
        class="customize-drawer bg-grey-darken-2 h-auto rounded-t-lg"
        rail
        permanent
        location="bottom"
      >
        <v-card class="mx-auto rounded-t-lg bg-grey-darken-2 d-zoom">
          <v-card-item class="bg-red-accent-2">
            <v-card-title>
              <span class="text-h5">{{ productCustomize.name }}</span>
            </v-card-title>

            <template v-slot:append>
              <v-defaults-provider
                :defaults="{
                  VBtn: {
                    variant: 'text',
                    density: 'comfortable',
                  },
                }"
              >
                <v-btn
                  class="text-h5"
                  @click="isCustomize = !isCustomize"
                  icon="mdi-close-circle"
                ></v-btn>
              </v-defaults-provider>
            </template>
          </v-card-item>

          <v-list>
            <v-list-item append-icon="mdi-plus-none">
              <div class="d-flex">
                <h5>{{ $t("waiter.size") }}:</h5>
                <v-spacer></v-spacer>
                <h5>{{ $t("waiter.price") }}:</h5>
              </div>
            </v-list-item>

            <v-list-item
              v-for="customize in productCustomize.product_customizes"
              :key="customize.id"
            >
              <div class="d-flex align-center">
                <h5 class="font-weight-bold">{{ customize.size }}</h5>
                <v-spacer></v-spacer>
                <h5 class="mr-6 font-weight-bold">
                  ${{ customize.price.toFixed(2) }}
                </h5>
                <v-icon
                  @click="addCustomize(productCustomize, customize)"
                  class="text-h4"
                  color="red-accent-2"
                  icon="mdi-plus-circle"
                ></v-icon>
              </div>
            </v-list-item>
          </v-list>
        </v-card>
      </v-navigation-drawer>
    </v-layout>
  </v-card>

  <!-- Order summary -->
  <v-layout class="overflow-visible">
    <v-bottom-navigation class="rounded-t-lg bg-grey-darken-2">
      <div
        @click="(isCart = !isCart), (isCustomize = false)"
        class="d-flex align-center bg-red-accent-2 rounded-lg px-2"
        style="cursor: pointer"
      >
        <div>
          <v-icon class="text-h4 mt-3" icon="mdi-cart"></v-icon>
          <v-avatar
            class="mb-2 text-h6 text-white font-weight-bold"
            color="grey-darken-4"
          >
            {{ totalFoods }}
          </v-avatar>
        </div>
        <h5 class="ml-2 mt-2">
          {{ $t("waiter.btn.total") }}:
          <span class="font-weight-bold">${{ totalPrice }}</span>
        </h5>
      </div>

      <v-spacer></v-spacer>

      <primary-button @click="order" class="px-2">
        <h6 class="font-weight-bold mt-2">{{ $t("waiter.btn.order") }}</h6>
      </primary-button>
    </v-bottom-navigation>
  </v-layout>

  <!-- My cart -->
  <v-card v-if="myCart.length > 0" class="d-zoom">
    <v-layout class="overflow-visible d-zoom">
      <v-navigation-drawer
        v-model="isCart"
        class="cart-drawer bg-grey-darken-2 rounded-t-lg"
        rail
        permanent
        location="bottom"
      >
        <v-card class="mx-auto bg-grey-darken-2 rounded-t-lg">
          <v-card-item class="bg-red-accent-2">
            <v-card-title>
              <span class="text-h5 font-inter"
                >{{ $t("waiter.cart") }} ({{ totalFoods }})</span
              >
            </v-card-title>

            <template v-slot:append>
              <v-defaults-provider
                :defaults="{
                  VBtn: {
                    variant: 'text',
                    density: 'comfortable',
                  },
                }"
              >
                <v-btn
                  class="text-h5"
                  @click="isCart = !isCart"
                  icon="mdi-close-circle"
                ></v-btn>
              </v-defaults-provider>
            </template>
          </v-card-item>

          <v-list>
            <v-list-item
              v-for="customize in myCart"
              :key="customize.product_customize_id"
              class="text-orange-darken-4"
            >
              <div class="d-flex align-center">
                <div class="d-flex align-center">
                  <div>
                    <v-img
                      class="bg-white rounded-lg"
                      :width="130"
                      :height="100"
                      :src="customize.product.image"
                      cover
                    ></v-img>
                  </div>
                  <div class="ml-3 text-white">
                    <h6 class="font-weight-bold">
                      {{ customize.product.name }}
                    </h6>
                    <span>{{ $t("waiter.size") }} / {{ customize.size }}</span>
                    <h5 class="font-weight-bold">
                      ${{ (customize.quantity * customize.price).toFixed(2) }}
                    </h5>
                  </div>
                </div>
                <v-spacer></v-spacer>
                <div class="d-flex align-center">
                  <v-icon
                    @click="minusCustomize(customize.product_customize_id)"
                    class="text-h4"
                    color="white"
                    icon="mdi-minus-circle-outline"
                  ></v-icon>
                  <h4 class="text-white mx-3 mt-2 font-weight-bold">
                    {{ customize.quantity }}
                  </h4>
                  <v-icon
                    @click="addCustomize(customize.product, customize)"
                    class="text-h4"
                    color="red-accent-2"
                    icon="mdi-plus-circle"
                  ></v-icon>
                </div>
              </div>
            </v-list-item>
          </v-list>
        </v-card>
      </v-navigation-drawer>
    </v-layout>
  </v-card>

  <!-- Dialog remove customize -->
  <base-dialog
    v-model="isRemoveCustom"
    :title="$t('app.dialog.tips')"
    :ms="$t('waiter.dialog.deleteCustom')"
  >
    <danger-button @click="isRemoveCustom = false">
      <v-icon icon="mdi-close-box-multiple" color="white" size="large"></v-icon>
      {{ $t("app.btn.cancel") }}
    </danger-button>
    <primary-button @click="removeCustomize(deleteCustomId)">
      <v-icon
        icon="mdi-checkbox-multiple-marked"
        color="white"
        size="large"
      ></v-icon>
      {{ $t("app.btn.confirm") }}
    </primary-button>
  </base-dialog>

  <!-- Alert please selecet table -->
  <base-alert v-model="tableAlert" type="warning" @hide-snackbar="tableAlert = false">
    <v-icon class="mr-2 text-h4 mdi mdi-alert-circle"></v-icon>
    <h5 class="mt-2">{{ $t("waiter.alert.selectTable") }}</h5>
  </base-alert>

  <!-- Alert please selecet food -->
  <base-alert v-model="foodAlert" type="warning" @hide-snackbar="foodAlert = false">
    <v-icon class="mr-2 text-h4 mdi mdi-alert-circle"></v-icon>
    <h5 class="mt-2">{{ $t("waiter.alert.selectFood") }}</h5>
  </base-alert>

  <!-- Alert success -->
  <base-alert v-model="storeSuccess" @hide-snackbar="storeSuccess = false">
    <v-icon class="mr-2 text-h4 mdi mdi-check-circle"></v-icon>
    <h5 class="mt-2">{{ $t("waiter.alert.orderSuccess") }}</h5>
  </base-alert>
</template>

<script setup>
// Import
import { computed, onMounted, ref } from "vue";
import { useProductStore } from "@/stores/product";
import { useCategoryStore } from "@/stores/category";
// import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { useTableStore } from "@/stores/table";
import { storeToRefs } from "pinia";
import { useOrderStore } from "@/stores/order";

// Variables
const { getProducts } = useProductStore();
const { getTables } = useTableStore();
const { getCategory } = useCategoryStore();
// const { userData } = storeToRefs(useUserStore());
const { tables } = storeToRefs(useTableStore());
const { products } = storeToRefs(useProductStore());
const { categories } = storeToRefs(useCategoryStore());
const { storeSuccess } = storeToRefs(useOrderStore());
const router = useRouter();
const keyword = ref("");
const filterValue = ref(null);

const isCustomize = ref(false);
const isRemoveCustom = ref(false);
const deleteCustomId = ref(null);
const productCustomize = ref(null);
const isCart = ref(false);
const myCart = localStorage.getItem("customizes_selectd")
  ? ref(JSON.parse(localStorage.getItem("customizes_selectd")))
  : ref([]);

const tableAlert = ref(false);
const foodAlert = ref(false);

const table = localStorage.getItem("table_selectd")
  ? ref(JSON.parse(localStorage.getItem("table_selectd")))
  : ref(null);

const producties = computed(() => {
  if (!products.value.length === 0) return [];
  return products.value.filter((r) => {
    const keys = ["name", "product_code", "description"];
    if (filterValue.value != "all") {
      for (const key of keys) {
        if (
          r[key].toLowerCase().search(keyword.value.toLowerCase()) >= 0 &&
          r.category_id._id == filterValue.value
        )
          return true;
      }
    } else {
      const regex = /\\/;
      if (regex.test(keyword.value)) return;
      for (const key of keys) {
        if (r[key].toLowerCase().search(keyword.value.toLowerCase()) >= 0)
          return true;
      }
    }
    return false;
  });
});

// On click product customize
const onCustomize = (product) => {
  isCustomize.value = true;
  isCart.value = false;
  productCustomize.value = product;
};
// Total order price
const totalPrice = computed(() => {
  let total = 0;
  for (let customize of myCart.value) {
    total += Number(customize.price) * customize.quantity;
  }
  return total.toFixed(2);
});
// Total order food
const totalFoods = computed(() => {
  let count = 0;
  for (let customize of myCart.value) {
    count += customize.quantity;
  }
  return count;
});
// Add product customize
const addCustomize = (product, customize) => {
  if (customize._id) {
    customize.product_customize_id = customize._id;
  }
  const customizes = localStorage.getItem("customizes_selectd")
    ? JSON.parse(localStorage.getItem("customizes_selectd"))
    : [];
  let findCustomIndex = customizes.findIndex(
    (custom) => custom.product_customize_id === customize.product_customize_id
  );
  if (customizes[findCustomIndex]) {
    customizes[findCustomIndex].quantity += 1;
  } else {
    customizes.push({
      product_customize_id: customize.product_customize_id,
      size: customize.size,
      quantity: 1,
      price: customize.price,
      product: {
        product_id: product.product_id,
        name: product.name,
        image: product.image,
      },
    });
  }
  myCart.value = customizes;
  localStorage.setItem("customizes_selectd", JSON.stringify(customizes));
};
// Minus product customize
const minusCustomize = (custom_id) => {
  const customizes = localStorage.getItem("customizes_selectd")
    ? JSON.parse(localStorage.getItem("customizes_selectd"))
    : [];
  let findCustomIndex = customizes.findIndex(
    (custom) => custom.product_customize_id === custom_id
  );
  if (customizes[findCustomIndex]) {
    customizes[findCustomIndex].quantity -= 1;
    if (customizes[findCustomIndex].quantity < 1) {
      customizes[findCustomIndex].quantity = 1;
      isRemoveCustom.value = true;
      deleteCustomId.value = findCustomIndex;
    }
  }
  myCart.value = customizes;
  localStorage.setItem("customizes_selectd", JSON.stringify(customizes));
};
// Remove product customize
const removeCustomize = (custom_id) => {
  const customizes = localStorage.getItem("customizes_selectd")
    ? JSON.parse(localStorage.getItem("customizes_selectd"))
    : [];
  customizes.splice(custom_id, 1);
  isRemoveCustom.value = false;
  myCart.value = customizes;
  localStorage.setItem("customizes_selectd", JSON.stringify(customizes));
};
// Get table seleted from localStorage
const tableSelected = () => {
  localStorage.setItem("table_selectd", JSON.stringify(table.value));
};
// Order food
const order = () => {
  if (myCart.value.length === 0) {
    return (foodAlert.value = true);
  }
  if (!table.value) {
    return (tableAlert.value = true);
  }
  router.push("/order-details");
};

// Lifecycle hook
onMounted(() => {
  getProducts();
  getCategory();
  getTables();
});
</script>

<style scoped>
.font-inter {
  font-family: "Inter", "Noto Serif Khmer", sans-serif, serif !important;
}

::v-deep .search .v-input__control .v-theme--light {
  color: white;
  background-color: #2c2c2c !important;
}

.cart-drawer,
.customize-drawer {
  margin-bottom: 56px;
}

.cart-drawer {
  height: 70vh !important;
}

.select-table {
  width: 200px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
}

@media screen and (max-width: 900px) {
  .grid-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media screen and (max-width: 430px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
