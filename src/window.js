const {BrowserWindow} = require("electron");
let mainWindow;

const getBrowserWindowOptions = () => {
	return {
		"auto-hide-menu-bar": true,
		"web-preferences": {
			"node-integration": false
		},
		// "icon": null tbd
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

	return mainWindow;
}

module.exports = {
	initializeWindow: initializeWindow
}