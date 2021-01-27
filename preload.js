const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('msg', {
  'example': () => {
    return ipcRenderer.invoke('example');
  }
});