// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import '@/sass/variables.scss';

// Vuetify
import { createVuetify } from "vuetify";

export default createVuetify(
  {
    theme: {
      options: {
        customProperties: true,
      },
    },
  }
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
);
