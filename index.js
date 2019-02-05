console.log('Initializing electron app...');

const { app, BrowserWindow } = require('electron');

let mainWindow = null;
app.on('ready', () => {
    const {session} = require('electron')
    // session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    //     callback({ responseHeaders: Object.assign({
    //         "Content-Security-Policy": [ "default-src 'self'" ]
    //     }, details.responseHeaders)});
    // });
    // session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    //     callback({
    //         responseHeaders: {
    //             ...details.responseHeaders,
    //             'Content-Security-Policy': ['default-src \'none\'']
    //         }
    //     });
    // });

    mainWindow = new BrowserWindow({
        // width: 800, height: 800,
        // webPreferences: {
        //     nodeIntegration: true
        // }
    });
    mainWindow.loadURL(`file://${__dirname}/views/index.html`);
});
