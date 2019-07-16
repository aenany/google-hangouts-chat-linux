const {BrowserWindow} = require("electron");
const pathsManifest = require('./paths');
const ConfigManager = require('./configs');
const fs = require('fs');
let mainWindow;
let isDarkMode;

const getBrowserWindowOptions = () => {
	return {
		"title": process.title,
		"autoHideMenuBar": true,
		"webPreferences": {
			"node-integration": false
		},
		"show": false,
		"backgroundColor": "#262727",
		"icon": pathsManifest.iconPath,
	}
}

const getExtraOptions = () => {
	return {
		"name": "Google Hangouts Chat for Linux",
		"url": "https://chat.google.com"
	};
}

const handleDarkMode = (config, windowObj) => {
	const invertColors = fs.readFileSync('./src/clientside/invertColors.js', 'utf8');

	if(config.darkMode && !isDarkMode) {
		isDarkMode = true;
		windowObj.webContents.executeJavaScript(invertColors, false, () => {
			windowObj.show();
		});
	} else {
		windowObj.show();
	}
}

const initializeWindow = (config) => {
	const bwOptions = (config && config.bounds) ? Object.assign(getBrowserWindowOptions(), config.bounds) : getBrowserWindowOptions()
	const extraOptions = getExtraOptions();

	mainWindow = new BrowserWindow(bwOptions);
	mainWindow.loadURL(extraOptions.url);

	mainWindow.once('ready-to-show', () => {
		handleDarkMode(config, mainWindow);
	});

	mainWindow.on('close', () => {
		let isMaximized = mainWindow.isMaximized();
		configsData = {};
		configsData.bounds = mainWindow.getBounds();
		configsData.wasMaximized = isMaximized;
		ConfigManager.updateConfigs(configsData);
		isDarkMode = false;
	});

	return mainWindow;
}

module.exports = {
	initializeWindow: initializeWindow
}