import { app, shell, BrowserWindow, ipcMain, protocol } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'fs'
import path from 'path'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true, 
      nodeIntegration: false, 
      webSecurity: true 
    }
  })

  mainWindow.setAlwaysOnTop(true, 'screen')

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  const userDataPath = app.getPath('userData') // Get this once

  protocol.registerFileProtocol('app', (request, callback) => {
    try {
      const userDataPath = app.getPath('userData');
      const decodedUrl = decodeURIComponent(request.url);
      const protocolPrefix = 'app://';
  
      if (!decodedUrl.startsWith(protocolPrefix)) {
        console.error('Invalid protocol format');
        return callback({ error: -324 });
      }
  
      let filePath = decodedUrl.substring(protocolPrefix.length);
  
      if (filePath.startsWith('/')) {
        filePath = filePath.slice(1);
      }
  
      filePath = filePath.split('/').map(segment => decodeURIComponent(segment)).join('/');
  
      const fullPath = path.join(userDataPath, ...filePath.split('/'));
  
      if (!fullPath.startsWith(userDataPath)) {
        console.error('Security violation:', fullPath);
        return callback({ error: -324 });
      }
  
      console.log('Serving file:', fullPath);
      callback({ path: fullPath });
    } catch (error) {
      console.error('Protocol error:', error);
      callback({ error: -324 });
    }
  });
  

  const testImagePath = path.join(app.getPath('userData'), 'images/test.jpg');
  fs.writeFileSync(testImagePath, 'TEST'); 
  console.log('Test file exists:', fs.existsSync(testImagePath));

  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

 
  ipcMain.handle('save-image', async (_, { fileName, buffer }) => {
    const userDataPath = app.getPath('userData')
    const imagesPath = path.join(userDataPath, 'images')
    
    if (!fs.existsSync(imagesPath)) {
      fs.mkdirSync(imagesPath, { recursive: true })
    }
    
    const filePath = path.join(imagesPath, fileName)
    fs.writeFileSync(filePath, Buffer.from(buffer))
    return filePath
  })

  ipcMain.handle('load-images', async () => {
    try {
      const userDataPath = app.getPath('userData');
      const imagesPath = path.join(userDataPath, 'images');
  
      if (!fs.existsSync(imagesPath)) return [];
  
      return fs.readdirSync(imagesPath)
        .filter(file => ['.jpg', '.jpeg', '.png'].includes(path.extname(file).toLowerCase()))
        .map(file => ({
          name: file,
          path: path.relative(userDataPath, path.join(imagesPath, file)).replace(/\\/g, '/')
        }));
    } catch (error) {
      console.error('Load images error:', error);
      return [];
    }
  });
  
  ipcMain.handle('delete-image', async (_, fileName) => {
    const userDataPath = app.getPath('userData')
    const filePath = path.join(userDataPath, 'images', fileName)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      return true
    }
    return false
  })

  ipcMain.handle('get-app-path', () => {
    return app.getPath('userData')
  })

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})