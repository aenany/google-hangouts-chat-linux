const {BrowserWindow} = require("electron");
const pathsManifest = require('./paths');
let mainWindow;

const getBrowserWindowOptions = () => {
	return {
		"auto-hide-menu-bar": true,
		"web-preferences": {
			"node-integration": false
		},
		"show": false,
		"icon": pathsManifest.iconPath
	}
}

const getExtraOptions = () => {
	return {
		"name": "Google Hangouts Chat for Linux",
		"url": "https://chat.google.com"
	};
}

const initializeWindow = () => {
	const bwOptions = getBrowserWindowOptions();
	const extraOptions = getExtraOptions();
	
	mainWindow = new BrowserWindow(bwOptions);
	mainWindow.setMenu(null);
	mainWindow.loadURL(extraOptions.url);

	mainWindow.once('ready-to-show', () => {
		mainWindow.show()
	})

	return mainWindow;
}

module.exports = {
	initializeWindow: initializeWindow
}