const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();
  autoUpdater.autoDownload = false; // không tự tải — chờ người dùng xác nhận ở trang thông tin
  autoUpdater.checkForUpdates();
});

autoUpdater.on('update-available', (info) => {
  mainWindow.webContents.send('update-available', {
    version: info.version,
    releaseNotes: info.releaseNotes,
  });
});

autoUpdater.on('checking-for-update', () => {
  mainWindow.webContents.send('update-debug', 'Đang kiểm tra cập nhật...');
});

autoUpdater.on('update-not-available', (info) => {
  mainWindow.webContents.send('update-debug', 'Không có bản mới. Version hiện tại mới nhất: ' + info.version);
});

autoUpdater.on('error', (err) => {
  mainWindow.webContents.send('update-debug', 'LỖI: ' + err.message);
});

autoUpdater.on('download-progress', (progress) => {
  mainWindow.webContents.send('update-download-progress', Math.round(progress.percent));
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update-downloaded');
});

autoUpdater.on('error', (err) => {
  mainWindow.webContents.send('update-error', err.message);
});

// Renderer (React) gọi khi người dùng bấm "Cập nhật" ở trang thông tin
ipcMain.on('start-download-update', () => {
  autoUpdater.downloadUpdate();
});

// Renderer gọi khi người dùng bấm "Cài đặt ngay" sau khi tải xong
ipcMain.on('quit-and-install', () => {
  autoUpdater.quitAndInstall();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});