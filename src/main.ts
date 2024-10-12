import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

// ElementPlus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

// APEXCHARTS
import VueApexCharts from 'vue3-apexcharts';

import App from './App.vue';
import router from './router';
import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import ja from './locales/ja.json';

// i18nの設定
const messages = {
  en,
  ja
};

const i18n = createI18n({
  legacy: false,
  locale: 'ja',
  fallbackLocale: 'ja',
  messages
});

const app = createApp(App);

app.use(i18n);
app.use(createPinia());
app.use(router);
app.use(ElementPlus);
app.use(VueApexCharts);

app.mount('#app');
