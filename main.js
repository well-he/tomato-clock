const {
    app,
    dialog,
    BrowserWindow,
    Notification,
    ipcMain
} = require('electron')

let win;
app.on('ready', () => {
    win = new BrowserWindow({
        width: 400,
        height: 500,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        },
        maximizable: false,
    })
    win.setMenuBarVisibility(false)
    win.loadFile('./index.html')
    // win.loadFile('./demo.html')

    handleIPC();
})

function handleIPC() {
    ipcMain.handle('work-notification', async function () {
        let res = await new Promise((resolve, reject) => {
            let res = dialog.showMessageBoxSync({
                icon: 'question',
                title: "通知",
                buttons: ['开始休息', '继续工作'],
                message: '是否开始休息',
            })

            if (res === 0) {
                resolve('rest')
            } else if (res === 1) {
                resolve('work');
            }
        })
        return res;
    });
    ipcMain.on('rest-notification', function () {
        setTimeout(() => {
            const notification = new Notification({
                title: '休息结束',
                body: '休息结束，请开始工作'
            })
            notification.show();
        }, 5 * 1000);
    })
    ipcMain.on('end-work', function () {
        const notification = new Notification({
            title: '结束',
            body: '计时已经结束'
        })
        notification.show();
    })
}