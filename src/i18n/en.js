const messages = {
    start: "Start",
    pause: "Pause",
    stop: "Stop",
    reset: "Reset to {time} min",
    remind: "Remind",
    open: 'Open',
    close: "Close",
    subScreen: "Sub Screen",
    timePeriod: {
        title: "Time Period",
        minute: "min.",
        min: "min.",
        sec: "sec.",
        custom: "Custom: ",
        confirm: "Confirm",
    },
    timeControl: {
        title: "Time Control",
    },
    thiefMode: {
        title: "Thief Mode",
        close: "Close",
        tip: "In thief mode, time will be gradually reduced",
        timeLeft: "Thief Mode Time Left: {toChange}s, need {left}s to finish."
    },
    message: {
        setCountDownError: 'Please stop counting down before setting the time.',
        timeToLowError: 'Time must be greater than 0'
    }
}

export default messages;