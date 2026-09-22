const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('updater', {
  onUpdateAvailable: (cb) => ipcRenderer.on('update-available', (_e, info) => cb(info)),
  onDownloadProgress: (cb) => ipcRenderer.on('update-download-progress', (_e, percent) => cb(percent)),
  onUpdateDownloaded: (cb) => ipcRenderer.on('update-downloaded', () => cb()),
  onError: (cb) => ipcRenderer.on('update-error', (_e, msg) => cb(msg)),
  onDebug: (cb) => ipcRenderer.on('update-debug', (_e, msg) => cb(msg)),   // ← thêm dòng này
  startDownload: () => ipcRenderer.send('start-download-update'),
  quitAndInstall: () => ipcRenderer.send('quit-and-install'),
});