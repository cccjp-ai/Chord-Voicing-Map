const { app, BrowserWindow } = require("electron");
const path = require("path");

const APP_NAME = "CHORD VOICING MAP";

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 570,
    minWidth: 800,
    minHeight: 520,
    title: APP_NAME,
    backgroundColor: "#0b1224",
    icon: path.join(__dirname, "img", "app_icon.png"),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, "index.html"));
}

app.setName(APP_NAME);

app.whenReady().then(() => {
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
