const messages = {
    start: "开始",
    pause: "暂停",
    stop: "停止",
    reset: "重置为{time}分钟",
    remind: "提醒",
    open: '打开',
    close: "关闭",
    subScreen: "子屏幕",
    timePeriod: {
        title: "倒计时设置",
        minute: "分钟",
        min: "分",
        sec: "秒",
        custom: "自定义时间: ",
        confirm: "确定",
    },
    timeControl: {
        title: "时间控制",
    },
    thiefMode: {
        title: "平滑模式",
        close: "关闭",
        tip: "平滑模式下，减去时间时，将不会直接减去，而是加速倒计时，从而达到偷时间的效果。",
        timeLeft: "平滑模式剩余待变化时间：{toChange}，还需要{left}秒"
    },
    message: {
        setCountDownError: '倒计时中，请停止后再设定时间',
        timeToLowError: '时间必须大于0'
    }
}

export default messages;