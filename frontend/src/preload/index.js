import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('electronAPI', {
      saveImage: (data) => ipcRenderer.invoke('save-image', data),
      loadImages: () => ipcRenderer.invoke('load-images'),
      deleteImage: (fileName) => ipcRenderer.invoke('delete-image', fileName),
      getAppPath: () => {
        console.log('[PRELOAD] getAppPath called');
        return ipcRenderer.invoke('get-app-path');
      },
      ping: () => ipcRenderer.invoke('ping')
    })
    
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}