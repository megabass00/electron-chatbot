console.log('Initializing electron app...');

const { app, BrowserWindow, Menu } = require('electron');

let mainWindow;
app.on('ready', createMainWindow);
 

app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createMainWindow()
    }
})


function createMainWindow() {
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);

    mainWindow = new BrowserWindow();
    mainWindow.loadURL(`file://${__dirname}/views/index.html`);

    mainWindow.on('closed', () => {
        console.log('Closing app...');
        mainWindow = null
    });
}


const mainMenuTemplate = [
    {
        label: 'Options',
        submenu: [
            {
                label: 'Created by megabass00',
                click() {
                    require('electron').shell.openExternal('https://github.com/megabass00/electron-chatbot');
                }
            },
            {
                label: 'Show Dev Tools',
                accelerator: process.platform === 'darwin' ? 'command+D' : 'Ctrl+D',
                click(e, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                label: 'Exit',
                accelerator: process.platform === 'darwin' ? 'command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
]
if (process.platform === 'darwin') {
    mainMenuTemplate.unshift({
        label: app.getName()
    })
}