const { app, BrowserWindow } = require('electron');
const fs = require('fs')
var data = {}
fs.readFile(__dirname + '/.name', 'ascii', (err, dat) => {
    if (err) throw err
    data['name'] = dat
})
fs.readFile(__dirname + '/.theme', 'ascii', (err, dat) => {
    if (err) throw err
    data['theme'] = eval(dat)
})
function createWindow() {
    const win = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        },
    });
    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
function set(key, value) {
    fs.writeFile(`/.${key}`, value)
    fs.readFile(__dirname + '/.name', 'ascii', (err, dat) => {
        if (err) throw err
        data['name'] = dat
    })
    fs.readFile(__dirname + '/.theme', 'ascii', (err, dat) => {
        if (err) throw err
        data['theme'] = eval(dat)
    })
}
module.exports.getTheme = () => data['theme']
module.exports.getName = () => data['theme']
module.exports.flipTheme = () => {
    set('theme', !data['theme'])
}
module.exports.setName = name => {
    set('name', name)
}