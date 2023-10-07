<template>
  <div :class="['Screen', {reminding: isReminding}]">
    <div class="countdown">{{countDownText}}</div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import { listen } from '@tauri-apps/api/event';

const countDownText = ref('00:00:00.00');
const isReminding = ref(false);
const remindTimeout = ref(-1);
onMounted(() => {
  listen('countdown', (e) => {
    countDownText.value = e.payload
  })


  listen('remind', () => {
    isReminding.value = true;
    if (remindTimeout.value) {
      clearTimeout(remindTimeout.value)
    }
    remindTimeout.value = setTimeout(() => {
      isReminding.value = false;
      setTimeout(() => {
        isReminding.value = true;
        setTimeout(() => {
          isReminding.value = false;
        }, 200)
      }, 200)
    }, 200)
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
  transition: background 200ms ease;
  &.reminding {
    background: #ce0000;
     & > .countdown {
       color: #fff;
     }
  }
}
.Screen > .countdown {
  transition: color 200ms ease;
  font-family: 'Digiface', sans-serif;
  font-size: 22vw;
  text-align: center;
  user-select: none;
}
</style>
