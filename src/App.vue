<template>
  <el-config-provider :size="'large'" :locale="locale">
    <count-down v-if="!showScreen" />
    <screen v-else />
  </el-config-provider>
</template>

<script setup>
import {default as locale} from 'element-plus/lib/locale/lang/zh-cn'
import { ElConfigProvider } from 'element-plus'
import CountDown from "./components/CountDown.vue";
import Screen from "./components/Screen.vue";

const showScreen = location.search.indexOf('screen=1') >= 0;
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
  'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
  'Noto Color Emoji';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
