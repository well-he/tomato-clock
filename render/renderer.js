const {
    ipcRenderer
} = require('electron');

const Timer = require('timer.js');

let timeCanvas;
let ctx;

new Vue({
    el: '#app',
    data: function () {
        return {
            times: [{
                    value: 5,
                    label: 'test'
                },
                {
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
                }
            ],
            workTimer: new Timer(),
            during: '',
        }
    },
    methods: {
        //初始化canvas
        initCanvas() {
            timeCanvas = document.getElementById('clockCanvas');
            ctx = timeCanvas.getContext('2d');
        },
        //初始化Timer
        initTimer() {
            // timer开始事件
            this.workTimer.on('start', e => {
                console.log('start' + e + 'ms');
                this.executeClock(this.during)
            });
            // timer更新事件
            this.workTimer.on('tick', (e) => {});
            // timer停止事件
            this.workTimer.on('stop', e => {
                ipcRenderer.send('end-work')
            });
            // timer暂停事件
            this.workTimer.on('pause', e => {});
            // timer结束事件
            this.workTimer.on('end', e => {
                this.notification();
                this.workEnd();
            });
        },

        workStart() {
            //开始工作 调用start实际时调用timer的开始事件
            this.workTimer.start(this.during)
        },

        workEnd() {
            //工作结束事件
            clearInterval(this.workTimer.timer); //清理计时器
            this.workTimer.stop(); //停止timer
            this.during = 0; //设置时间为0
            this.clearCanvas(); //清除canvas
        },

        drawClock(time) {
            ctx.font = "60px Arial";
            ctx.textAlign = 'center';
            ctx.strokeText(time + 's', 100, 100);
        },

        executeClock(time) {
            if (this.workTimer.timer) clearInterval(this.workTimer.timer)
            this.workTimer.timer = setInterval(() => {
                this.clearCanvas();
                this.drawClock(time);
                time--;
                if (time < 0) {
                    clearInterval(this.workTimer.timer);
                }
            }, 1000);
        },

        async notification() {
            let res = await ipcRenderer.invoke('work-notification');
            if (res === "rest") {
                this.$message({
                    type: 'info',
                    duration: '1000',
                    message: '5分钟后将会提醒您!'
                });
                ipcRenderer.send('rest-notification')
            } else if (res === "work") {
                this.$message({
                    type: 'info',
                    duration: '1000',
                    message: '请重新设置时间！'
                });
            }
        },

        clearCanvas() {
            timeCanvas.setAttribute('width', 200);
        },

    },
    mounted() {
        this.initCanvas();
        this.initTimer();
    }
})