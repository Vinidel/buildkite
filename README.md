# buildkite
A small electron app that shows builds from Buildkite

## Contribute
Clone the app repo and run `npm install` and `npm start` to install dependencies and start the app

  - Open the `main.js` file and comment/uncomment these lines of code

  ```Javascript
      require('electron-reload')(__dirname) // This will enable auto-reload

      // mainWindow = new BrowserWindow({width: 515, height: 600, resizable: false})
      mainWindow = new BrowserWindow({width: 1000, height: 600}) //this will make the screen bigger

      mainWindow.webContents.openDevTools() //this will enable Chrome dev tools for debuging that's why you need a bigger screen

  ```

  Don't forget to comment those lines again before generating the app.

Have Fun!!

## Scripts
 - npm start `Will run the app locally`
 - npm run package-mac `Will create the app for Mac`
 - npm run package-win `Will create the app for Windows`
 - npm run package-linux `Will create the app for Linux`
 
 ## HTML
  Still all hardcoded adding Vue or React in future