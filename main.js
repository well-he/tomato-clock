const {
    app,
    dialog,
    Notification,
    BrowserWindow,
    ipcMain
} = require('electron')

let win;
app.on('ready', () => {
    win = new BrowserWindow({
        width: 500,
        height: 500,
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.loadFile('./index.html')

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
}