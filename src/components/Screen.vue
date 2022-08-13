<template>
  <div class="Screen">
    <div class="countdown">{{countDownText}}</div>
  </div>
</template>

<script setup>
import {onMounted, ref, shallowRef} from 'vue';
import { appWindow } from '@tauri-apps/api/window';
import { listen } from '@tauri-apps/api/event';

const countDownText = ref('00:00:00.00');

onMounted(() => {
  const unlisten = listen('countdown', (e) => {
    countDownText.value = e.payload
    // this.countdown = time
  })
  console.log(appWindow.listeners)
  appWindow.onCloseRequested(() => {
    unlisten();
  })
})


</script>
<style>
body {
  margin: 0;
  padding: 0;
}
.Screen {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.Screen > .countdown {
  font-family: 'Digiface', sans-serif;
  font-size: 22vw;
  text-align: center;
  user-select: none;
}
</style>
