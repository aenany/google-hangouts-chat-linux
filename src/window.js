const {BrowserWindow, ipcMain, shell} = require("electron");
const pathsManifest = require('./paths');
const ConfigManager = require('./configs');
const fs = require('fs');
let mainWindow;
let isDarkMode;

ipcMain.on('open-link', (evt, href) => {
	shell.openExternal(href);
});

const getBrowserWindowOptions = () => {
	return {
		"title": process.title,
		"autoHideMenuBar": true,
		"webPreferences": {
			"node-integration": true,
			"devTools": false,
		},
		"show": false,
		"backgroundColor": "#262727",
		"icon": pathsManifest.iconPath,
	}
}

const getExtraOptions = () => {
	return {
		"name": "Google Hangouts Chat for Linux",
		"url": "https://chat.google.com",
		"openLocally": true
	};
}

const handleDarkMode = (config, windowObj) => {
	const invertColors = fs.readFileSync('./src/clientside/invertColors.js', 'utf8');

	if(config && config.darkMode && !isDarkMode) {
		isDarkMode = true;
		windowObj.webContents.executeJavaScript(invertColors, false, () => {
			windowObj.show();
		});
	} else {
		windowObj.show();
	}
}

const attachOpenLinkListener = (windowObj) => {
	const handleUrls = fs.readFileSync('./src/clientside/handleUrls.js', 'utf8');
	windowObj.webContents.executeJavaScript(handleUrls, true, () => {});
}

const handleRedirect = (e, url) => {
	shell.openExternal(url);
	e.preventDefault();
};

const initializeWindow = (config) => {
	const bwOptions = (config && config.bounds) ? Object.assign(getBrowserWindowOptions(), config.bounds) : getBrowserWindowOptions()
	const extraOptions = getExtraOptions();

	mainWindow = new BrowserWindow(bwOptions);
	mainWindow.loadURL(extraOptions.url);
	mainWindow.once('ready-to-show', () => {
		handleDarkMode(config, mainWindow);
	});
	mainWindow.webContents.on('dom-ready', () => {
		attachOpenLinkListener(mainWindow);
	})
	mainWindow.on('close', () => {
		let isMaximized = mainWindow.isMaximized();
		configsData = {};
		configsData.bounds = mainWindow.getBounds();
		configsData.wasMaximized = isMaximized;
		ConfigManager.updateConfigs(configsData);
		isDarkMode = false;
	});
	mainWindow.webContents.on('will-navigate', handleRedirect);
	mainWindow.webContents.on('new-window', handleRedirect);

	return mainWindow;
}

module.exports = {
	initializeWindow: initializeWindow
}