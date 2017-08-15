const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let win2
let step = 0;
let term;

function search(searchTerm) {
  step = 0;
  term = searchTerm;
  win2.loadURL('https://www.google.cz');
}

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600})
  win.setMenu(null);

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  win2 = new BrowserWindow({width: 300, height: 300, show: false});
  // win2.webContents.openDevTools()
  win2.setMenu(null);

  global.sharedObj = {win2: win2, search: search};

  win2.webContents.on('did-finish-load', () => {
    switch(step) {
      case 0:
        win2.webContents.executeJavaScript(`document.getElementById('lst-ib').value = '${term}'`);
        win2.webContents.executeJavaScript("document.forms[0].submit()")
        break;
      case 1:
        let result = win2.webContents.executeJavaScript("document.querySelector('#rso h3 > a').innerText", (value) => {
          console.log(value);
          win.webContents.executeJavaScript(`document.getElementById('result').innerText = '${value}'`)
        });
        break;
    }
    step++;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
