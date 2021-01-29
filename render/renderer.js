const {
    ipcRenderer
} = require('electron');

const Timer = require('timer.js')

let workTimer = new Timer({
    // ontick: (ms) => {
    //     // updateTime(ms);
    // },
    onend: () => {
        notification();
    },
    onstop: () => {
        // alert('停止')
    }
    // onpause: () => {
    //     console.log('pause');
    // }
})

new Vue({
    el: '#app',
    data: function () {
        return {
            times: [{
                value: 5 * 60,
                label: '5分钟'
            }, {
                value: 10 * 60,
                label: '10分钟'
            }, {
                value: 30 * 60,
                label: '30分钟'
            }, {
                value: 60 * 60,
                label: '60分钟'
            }, {
                value: 90 * 60,
                label: '90分钟'
            }, {
                value: 120 * 60,
                label: '120分钟'
            }],
            during: ''
        }
    },
    methods: {
        workStart() {
            workTimer.start(this.during)
            executeClock(this.during)
        },
        endstart() {
            clearInterval(workTimer.timer);
            workTimer.stop();
            this.during = 0;
            this.$notify({
                title: '已结束',
                message: '计时停止'
            });
        }
    }
})

const timeCanvas = document.querySelector('#clockCanvas');

function drawClock(time) {
    /**
     * @type {HTMLCanvasElement}
     */

    const ctx = timeCanvas.getContext('2d');
    ctx.font = "60px Arial";
    ctx.textAlign = 'center';
    ctx.strokeText(time + 's', 100, 100);

}

function executeClock(time) {
    if (workTimer.timer) clearInterval(workTimer.timer)
    workTimer.timer = setInterval(() => {
        timeCanvas.setAttribute('width', 200);
        drawClock(time);
        time--;
        if (time < 0) {
            clearInterval(workTimer.timer);
        }
    }, 1000);
}

async function notification() {
    let res = await ipcRenderer.invoke('work-notification');
    if (res === "rest") {
        console.log(res);
        setTimeout(() => {
            alert('休息结束')
        }, 5 * 1000);
    } else if (res === "work") {
        workTimer.start(10);
    }
}