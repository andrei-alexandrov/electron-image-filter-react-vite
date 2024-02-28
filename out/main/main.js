"use strict";
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("node:path");
let mainWindow;
const handleFileOpen = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({});
  if (!canceled) {
    mainWindow.webContents.send("file-opened", filePaths[0]);
    return filePaths[0];
  }
};
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1e3,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js"),
      webSecurity: false
    }
  });
  mainWindow.loadURL("http://localhost:5173");
  mainWindow.on("closed", () => mainWindow = null);
  mainWindow.webContents.openDevTools();
}
app.whenReady().then(() => {
  ipcMain.handle("dialog:openFile", handleFileOpen);
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
