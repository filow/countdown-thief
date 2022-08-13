<template>
  <div id="Countdown">
    <div class="countdown">{{countDownText}}</div>
    <div class="controls">
      <el-button type="primary" v-if="!isRunning" :icon="VideoPlay" :disabled="isRunning || countdown === 0" @click="startRunning">开始</el-button>
      <el-button type="warning" v-else :icon="VideoPause" @click="pause">暂停</el-button>
      <el-button type="danger" :icon="Close" :disabled="countdown < 0.005" @click="stopAll">停止</el-button>
      <el-button type="info" :icon="Refresh" @click="reset">重置为{{twoDigit(memorizedCountDown)}}分钟</el-button>
      <el-button @click="toggleSubScreen">{{windowVisible ? '隐藏' : '打开'}}子屏幕</el-button>
    </div>
    <table class="control-table">
      <tr>
        <td>倒计时设置</td>
        <td>
          <div>
            <el-button @click="setCountDown(1)">1分钟</el-button>
            <el-button @click="setCountDown(3)">3分钟</el-button>
            <el-button @click="setCountDown(5)">5分钟</el-button>
            <el-button @click="setCountDown(15)">15分钟</el-button>
            <el-button @click="setCountDown(30)">30分钟</el-button>
          </div>
          <div class="custom">
            <div>自定义时间</div>
            <el-input-number :controls="false" v-model="input.minutes" controls-position="right" :step="1" :min="0" :max="600"></el-input-number>
            <div>分</div>
            <el-input-number :controls="false" v-model="input.seconds" controls-position="right" :step="1" :min="0" :max="60"></el-input-number>
            <div>秒</div>
            <el-button style="margin-left: 10px;" @click="setInputCountDown">确定</el-button>
          </div>
        </td>
      </tr>
      <tr>
        <td>时间控制</td>
        <td class="timeOffsetControl">
          <div class="minusButtons">
            <el-button @click="timeChange(-10)">-10s</el-button>
            <el-button @click="timeChange(-30)">-30s</el-button>
            <el-button @click="timeChange(-60)">-60s</el-button>
            <el-button @click="timeChange(-120)">-120s</el-button>
          </div>
          <div class="addButtons">
            <el-button @click="timeChange(10)">+10s</el-button>
            <el-button @click="timeChange(30)">+30s</el-button>
            <el-button @click="timeChange(60)">+60s</el-button>
            <el-button @click="timeChange(120)">+120s</el-button>
          </div>
        </td>
      </tr>
      <tr>
        <td>平滑模式</td>
        <td>
          <el-radio-group v-model="speed" class="speed-group">
            <el-radio :label="0">关闭</el-radio>
            <el-radio :label="1.1">1.1x</el-radio>
            <el-radio :label="1.2">1.2x</el-radio>
            <el-radio :label="1.3">1.3x</el-radio>
            <el-radio :label="1.4">1.4x</el-radio>
          </el-radio-group>
          <div class="fluent-mode-tip">平滑模式下，减去时间时，将不会直接减去，而是加速倒计时，从而达到偷时间的效果。</div>
          <div class="fluent-mode-count" v-if="times.toChange !== 0">平滑模式剩余待变化时间：{{ twoDigit(times.toChange / 1000) }}，还需要{{toChangeLeftTime}}秒</div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import {computed, ref, shallowRef, watch} from 'vue';
import { prefixZero } from "../utils/prefixZero";
import { ElButton, ElMessage, ElInputNumber, ElRadioGroup, ElRadio } from 'element-plus';
import { VideoPlay, VideoPause, Close, Refresh } from '@element-plus/icons-vue';
import { twoDigit } from '../utils/filters';
import { WebviewWindow, getAll, appWindow } from '@tauri-apps/api/window';
import { emit } from '@tauri-apps/api/event';


const times = ref({
  target: 0,
  lastTime: 0,
  toChange: 0
})
const input = ref({
  minutes: 1,
  seconds: 0
})
const windowRef = shallowRef();
const countdown = ref(0);
const memorizedCountDown = ref(1);
const speed = ref(0);
const isRunning = ref(false);
const windowVisible = ref(false);

const countDownText = computed(() => {
  const cntDown = countdown.value;
  const hours = Math.floor(cntDown / 1000 / 60 / 60);
  const minutes = Math.floor(cntDown / 1000 / 60) % 60;
  const seconds = Math.floor(cntDown / 1000) % 60;
  const mSeconds = Math.floor(cntDown % 1000 / 10);
  return `${prefixZero(hours)}:${prefixZero(minutes)}:${prefixZero(seconds)}.${prefixZero(mSeconds)}`;
})

watch(countDownText, (newVal) => {
  emit('countdown', newVal);
})

const openSubScreen = async () => {
  const width = 880;
  const height = 270;
  const win = new WebviewWindow(
    'display', {
    alwaysOnTop: true,
    decorations: true,
    fileDropEnabled: false,
    resizable: true,
    center: true,
    width,
    height,
    skipTaskbar: true,
    title: '倒计时小工具',
    url: '/?screen=1'
  })
  win.onCloseRequested(() => {
    windowVisible.value = false;
  })
  appWindow.onCloseRequested(() => {
    if (win) {
      try {
        win.close();
      } catch {}
    }
  })
  windowRef.value = win;
  windowVisible.value = true;
}

const toggleSubScreen = async () => {
  const allWindow = getAll();
  const displayWin = allWindow.find(item => item.label === 'display');
  if (!displayWin) {
    return await openSubScreen()
  }
  const visible = await displayWin.isVisible();
  if (visible) {
    windowVisible.value = false;
    await displayWin.hide()
  }
  else {
    windowVisible.value = true;
    await displayWin.show()
    setTimeout(() => {
      appWindow.setFocus()
    }, 100)
  }
}

const toChangeLeftTime = computed(() => {
    return twoDigit(Math.abs(times.value.toChange / 1000) / (speed.value - 1));
})

const reset = () => {
  setCountDown(memorizedCountDown.value)
}
const timeChange = (offset) => {
  if (!isRunning.value) {
    return;
  }
  // 处理时间变化
  times.value.toChange += offset * 1000
}

const runningTicks = () => {
  if (!isRunning.value) {
    return;
  }
  const now = Date.now();
  // 有需要变化的时间值
  if (times.value.toChange !== 0) {
    // 关闭平滑模式
    if (speed.value === 0) {
      times.value.target += times.value.toChange;
      times.value.toChange = 0;
    }
    else {
      const lastTimeDiff = now - times.value.lastTime;
      let extraTimeDiff = lastTimeDiff * (speed.value - 1) * Math.sign(times.value.toChange);
      if (Math.abs(times.value.toChange) - Math.abs(extraTimeDiff) < 0) {
        extraTimeDiff = times.value.toChange
      }
      times.value.target += extraTimeDiff;
      times.value.toChange = times.value.toChange - extraTimeDiff
    }
  }

  // 计算剩余时间
  let offset = times.value.target - now;
  // 记录最后一次的时间
  times.value.lastTime = now;
  countdown.value = offset;
  if (countdown.value <= 0) {
    countdown.value = 0;
    isRunning.value = false;
    times.value.toChange = 0;
  }
  else {
    setTimeout(() => runningTicks(), 12)
  }
}
const startRunning = () => {
  if (countdown.value <= 0) {
    return;
  }
  isRunning.value = true;
  times.value = {
    target: Date.now() + countdown.value,
    lastTime: Date.now(),
    toChange: 0,
  }
  setTimeout(() => runningTicks(), 12)
}
const setCountDown = (minutes) => {
  if (isRunning.value) {
    ElMessage.error('倒计时中，请停止后再设定时间')
    return;
  }

  const target = minutes * 60 * 1000;
  if (countdown.value === target && !isRunning.value) {
    startRunning()
  }
  else {
    countdown.value = target;
    memorizedCountDown.value = minutes;
  }
}
const pause = () => {
  if (isRunning.value) {
    isRunning.value = false
  }
}
const stopAll = () => {
  isRunning.value = false;
  countdown.value = 0;
  times.value.toChange = 0;
}

const setInputCountDown = () => {
    const mergedMinutes = input.value.minutes + input.value.seconds / 60;
    if (mergedMinutes > 0) {
      setCountDown(mergedMinutes);
    }
    else {
      ElMessage.error('时间必须大于0')
    }
}
</script>


<style scoped>
.countdown {
  font-family: 'Digiface', sans-serif;
  font-size: 16vw;
  text-align: center;
}
.controls {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.custom {
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
}
.custom .el-input-number {
  width: 60px;
  margin: 0 5px 0 10px;
}
.control-table td {
  border-bottom: 1px solid #efefef;
  height: 120px;
}
.control-table td:first-child {
  font-weight: bold;
  width: 100px;
}
.timeOffsetControl .el-button {
  width: 80px;
  margin: 5px;
}
.minusButtons {
  display: flex;
}
.speed-group .el-radio__label {
  font-size: 16px;
}
.fluent-mode-tip {
  font-size: 13px;
  color: #888;
  margin-top: 6px;
  margin-bottom: 7px;
}
</style>
