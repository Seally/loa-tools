# Tools for Lies of Astaroth (loa-tools)

## Developers Guide

### Getting Started

This app uses [React](https://reactjs.org/) to build the UI, and 
[Electron](https://electronjs.org/) to create the standalone desktop version
of this app.

To get started building this app, follow these steps:

1. Clone this repository using Git.
2. Install [Node.js](https://nodejs.org). I recommend installing through NVM, 
   but it's not absolutely required 
   - For Windows: [https://github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows).
   - For Mac/Linux: [https://github.com/creationix/nvm](https://github.com/creationix/nvm).
3. Install [yarn](https://yarnpkg.com) through NPM (Node Package Manager). Some
   commands assume `yarn` is installed, so install it using:
   - `npm install -g yarn`
4. Change to repository directory and run `yarn install`.
5. Here are some useful commands:
   - `yarn start`:         starts the server and opens a browser page to the site. 
   - `yarn electron-dev`:  opens the app in Electron (development mode).
   - `yarn electron-dist`: produces an Electron executable in the 
                           `dist` folder.
   
   See full list of commands in the commands section.

### Commands

**Note:** Running commands not listed here but exists in `package.json` may
          cause flying monkeys to appear and the Moon to come crashing down to 
          Earth. Please don't run them unless you know what you're doing. 
          Thank you.
      

- `yarn start`:         starts the React server and open up a browser page to 
                        the website. You can also access the page through
                        `http://localhost:3000`. 
- `yarn build`:         builds the app in the `build` folder so that it can be
                        served in an HTTP server.
- `yarn electron-dev`:  runs the Electron app in development mode.
- `yarn electron-pack`: generates package directory without packaging it. 
                        May be used for debugging.
- `yarn electron-dist`: produces an Electron executable in the `dist` folder.

