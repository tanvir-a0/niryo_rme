const { dialog } = require('electron');
//require('v8-compile-cache');
const electron = require('electron');
var client;
// Module to control application life.
const app = electron.app;
const Menu = electron.Menu;
const globalShortcut = electron.globalShortcut;

// Initialize sentry
const sentry = require('./sentry.js')

if (process.env.LIVE_UPDATE === "true") {
  // Connect to live update if LIVE_UPDATE env variable is true
  app.commandLine.appendSwitch('remote-debugging-port', '8315');
  client = require('electron-connect').client;
}
const protocol = electron.protocol;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  //Intercept any urls on the page and find the file on disk instead
  protocol.interceptFileProtocol('file', function (req, callback) {
    var url = req.url.substr(7);
    callback({ path: path.normalize(__dirname + url) });
  });
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    titleBarStyle: 'hidden-inset',
    webPreferences: {
      nodeIntegration: true,
      sandbox: false,
      contextIsolation: false, // Should be set to true if we had a better architecture \*_*/
      icon: path.join(__dirname, 'app/assets/ico/app_logo.png'),
      preload: path.join(__dirname, "sentry.js")
    }
  });
  mainWindow.maximize();
  mainWindow.removeMenu();

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: 'index.html',
    protocol: 'file:',
    slashes: true
  }));

  // if application in dev' mode, allow to toggle developer tools
  if (electron.app && !electron.app.isPackaged)
  {
    app.whenReady().then(() => {
      globalShortcut.register('CommandOrControl+Shift+I', () => {
        mainWindow.webContents.toggleDevTools();
      })
    })
  }

  app.commandLine.appendSwitch('high-dpi-support', 1)
  app.commandLine.appendSwitch('force-device-scale-factor', 1)

  mainWindow.webContents.zoomFactor  = 0.9;

  mainWindow.webContents.setVisualZoomLevelLimits(0.7, 1.3);
  mainWindow.webContents.on("zoom-changed", (event, zoomDirection) => {
    var currentZoom = mainWindow.webContents.zoomFactor;
    if (zoomDirection === "in" && currentZoom < 1.3) {
      mainWindow.webContents.zoomFactor += 0.05;
    }
    else if (zoomDirection === "out" && currentZoom > 0.7) {
      mainWindow.webContents.zoomFactor -= 0.05;
    }
  });

  if (process.platform === 'darwin') {
    // Create our menu entries so that we can use MAC shortcuts
    Menu.setApplicationMenu(Menu.buildFromTemplate([
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'delete' },
        ]
      }
    ]));
  }

  // Emitted when the window is closed.
  mainWindow.on('close', function (e) {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    // mainWindow = null;
    var choice = require('electron').dialog.showMessageBoxSync(this,
      {
        type: 'question',
        buttons: ['Yes', 'No'],
        title: 'Confirm',
        message: 'Are you sure you want to quit?'
      });
    if (choice == 1) {
      e.preventDefault();
    }
  });

  // Connect to live update if LIVE_UPDATE env variable is true
  if (client) {
    client.create(mainWindow, { "sendBounds": false });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.
