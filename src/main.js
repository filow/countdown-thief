import { createApp } from 'vue'
import App from './App.vue'
import { createI18n } from 'vue-i18n'
import './assets/digiface.css'
import en from './i18n/en';
import zhCN from './i18n/zh-CN';

const lang = localStorage.getItem('lang');
const i18n = createI18n({
    legacy: false, // you must set `false`, to use Composition API
    // something vue-i18n options here ...
    locale: lang || 'en', // set locale
    fallbackLocale: 'en', // set fallback locale
    messages: {
        en,
        'zh-CN': zhCN
    }, // set locale messages
})

const app = createApp(App);
app.use(i18n);
app.mount('#app')
