const {app, ipcMain, BrowserWindow, Menu} = require('electron');
const fs = require('fs');
const rpc = require('discord-rich-presence')('803887326828036096');
const fyt = require('youtube-info');

const config = JSON.parse(fs.readFileSync(`${__dirname}/config.json`));

fs.writeFileSync(`${__dirname}/node_modules/youtube-info/index.js`, fs.readFileSync(`${__dirname}/hotfixyti.js`));


function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1152,
    height: 739,
    minWidth: 1152,
    minHeight: 739,
    frame: config.frame,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: __dirname + '/preload.js',
      plugins: true
    }
  });

  mainWindow.loadFile('index.html');

  function setPresence(platform, media, image) {
    rpc.updatePresence({
      state: media,
      details: platform,
      startTimestamp: Date.now(),
      largeImageKey: 'nyckhub_-_logo_-_1024',
      smallImageKey: image,
      instance: true,
    });
  }

  if(config.rpc == true) {
    mainWindow.webContents.on('did-navigate', (e, url) => {
      if(url.includes('/resources/app.asar/index.html') || url.includes('/NyckHub/index.html')) {
        setPresence('Media Hub', 'GitHub: RealzWolfy/NyckHub', 'none');
      } else if(url.startsWith('https://www.youtube.com/')) {
        setPresence('YouTube', 'Main Page', 'yt-logo');
      } else if(url.startsWith('https://odysee.com/')) {
        setPresence('Odysee', 'Watching on Odysee', 'odysee-logo');
      } else if(url.startsWith('https://www.twitch.tv/')) {
        setPresence('Twitch', 'Main Page', 'twitch-logo');
      }
    });
  
    mainWindow.webContents.on('did-navigate-in-page', (event, url) => {
      console.log(url)
      if(url.startsWith('https://www.youtube.com/watch?v=')) {
        var videoID = url.replace('https://www.youtube.com/watch?v=', '');
  
        fyt(videoID).then(function (videoInfo) {
          setPresence('YouTube', videoInfo.title, 'yt-logo');
        });
      } else if(url.startsWith('https://www.twitch.tv/')) {
        var idkhowtonamethis = url.replace('https://www.twitch.tv/', '');
        
        setPresence('Twitch', `Watching at ${idkhowtonamethis}.`, 'twitch-logo');
      }
    });
  }

  const template = [
    {
      label: 'Hub',
      click() {
        mainWindow.loadFile('index.html');
      },
      accelerator: process.platform === 'darwin' ? 'Control+0' : 'Control+0',
    },
    {
      label: 'Services',
      submenu: [
        {
              label: 'Odysee',
              click() {
                mainWindow.loadURL('https://odysee.com/', { userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:46.0) Gecko/20100101 Firefox/79.0' });
                mainWindow.setTitle('Odysee');
              },
              accelerator: process.platform === 'darwin' ? 'Control+O' : 'Control+O',
        },
        {
          label: 'Twitch',
          click() {
            mainWindow.loadURL('https://www.twitch.tv/', { userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:46.0) Gecko/20100101 Firefox/79.0' });
            mainWindow.setTitle('Twitch');
          },
          accelerator: process.platform === 'darwin' ? 'Control+T' : 'Control+T',
        },
        {
            label: 'YouTube',
            click() {
              mainWindow.loadURL('https://www.youtube.com/', { userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:46.0) Gecko/20100101 Firefox/79.0' });
              mainWindow.setTitle('YouTube');
            },
            accelerator: process.platform === 'darwin' ? 'Control+Y' : 'Control+Y',
        },
      ],
    },
    {
      label: 'Tools',
      submenu: [
         {
            label: 'Capture Mode',
         },
         {
           label: 'Party',
         }
      ],
    },
    {
      label: 'Settings',
      submenu: [
        {
          label: 'Discord RPC',
          accelerator: process.platform === 'darwin' ? 'Control+R' : 'Control+R',
          // YES... I KNOW THIS CODE SUCKS AND IS INEFFICIENT
          click() {
            if(config.rpc == false) {
              var js0n = {
                "rpc":true,
                "frame":config.frame,
                "soly":config.soly
              };

              js0n = JSON.stringify(js0n, null, 4);

              fs.writeFileSync(`${__dirname}/config.json`, js0n);

              mainWindow.close();
              app.relaunch();
            } else {
              var js0n = {
                "rpc":false,
                "frame":config.frame,
                "soly":config.soly
              };

              js0n = JSON.stringify(js0n, null, 4);

              fs.writeFileSync(`${__dirname}/config.json`, js0n);

              mainWindow.close();
              app.relaunch();
            }
          },
        },
        {
          label: 'Make Frameless',
          accelerator: process.platform === 'darwin' ? 'Control+F' : 'Control+F',
          // YES... I KNOW THIS CODE SUCKS AND IS INEFFICIENT
          click() {
            if(config.frame == false) {
              var js0n = {
                "rpc":config.rpc,
                "frame":true,
                "soly":config.soly
              };

              js0n = JSON.stringify(js0n, null, 4);

              fs.writeFileSync(`${__dirname}/config.json`, js0n);

              mainWindow.close();
              app.relaunch();
            } else {
              var js0n = {
                "rpc":config.rpc,
                "frame":false,
                "soly":config.soly
              };

              js0n = JSON.stringify(js0n, null, 4);

              fs.writeFileSync(`${__dirname}/config.json`, js0n);

              mainWindow.close();
              app.relaunch();
            }
          },
        },
        {
          label: 'Stay on last URL',
          accelerator: process.platform === 'darwin' ? 'Control+L' : 'Control+L',
          // YES... I KNOW THIS CODE SUCKS AND IS INEFFICIENT
          click() {
            if(config.soly == false) {
              var js0n = {
                "rpc":config.rpc,
                "frame":config.frame,
                "soly":true
              };

              js0n = JSON.stringify(js0n, null, 4);

              fs.writeFileSync(`${__dirname}/config.json`, js0n);

              mainWindow.close();
              app.relaunch();
            } else {
              var js0n = {
                "rpc":config.rpc,
                "frame":config.frame,
                "soly":false
              };

              js0n = JSON.stringify(js0n, null, 4);

              fs.writeFileSync(`${__dirname}/config.json`, js0n);

              mainWindow.close();
              app.relaunch();
            }
          },
        }
      ],
    },
    {
      label: 'Other',
      submenu: [
        {
          label: 'Close',
          click() {
            mainWindow.close();
          },
        },
        {
          label: 'Relaunch',
          click() {
            mainWindow.close();
            app.relaunch();
          },
        },
        {
          label: 'Refresh',
          click() {
            mainWindow.reload();
          },
        }
      ],
    },
  ]
  
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

ipcMain.handle('example', () => { // If our code gets the 'example' message then do the following:
  console.log('figgo');
});

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});