const {BrowserWindow} = require("electron");
const pathsManifest = require('./paths');
let mainWindow;

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

const initializeWindow = () => {
	const bwOptions = getBrowserWindowOptions();
	const extraOptions = getExtraOptions();
	
	mainWindow = new BrowserWindow(bwOptions);
	mainWindow.setMenu(null);
	mainWindow.loadURL(extraOptions.url);
	// mainWindow.webContents.executeJavascript("javascript: (\r\nfunction () { \r\n\/\/ the css we are going to inject\r\nvar css = \'html {-webkit-filter: invert(100%);\' +\r\n    \'-moz-filter: invert(100%);\' + \r\n    \'-o-filter: invert(100%);\' + \r\n    \'-ms-filter: invert(100%); }\',\r\n\r\nhead = document.getElementsByTagName(\'head\')[0],\r\nstyle = document.createElement(\'style\');\r\n\r\n\/\/ a hack, so you can \"invert back\" clicking the bookmarklet again\r\nif (!window.counter) { window.counter = 1;} else  { window.counter ++;\r\nif (window.counter % 2 == 0) { var css =\'html {-webkit-filter: invert(0%); -moz-filter:    invert(0%); -o-filter: invert(0%); -ms-filter: invert(0%); }\'}\r\n };\r\n\r\nstyle.type = \'text\/css\';\r\nif (style.styleSheet){\r\nstyle.styleSheet.cssText = css;\r\n} else {\r\nstyle.appendChild(document.createTextNode(css));\r\n}\r\n\r\n\/\/injecting the css to the head\r\nhead.appendChild(style);\r\n}());\r\n");

	mainWindow.once('ready-to-show', () => {
		mainWindow.show()
	})

	return mainWindow;
}

module.exports = {
	initializeWindow: initializeWindow
}