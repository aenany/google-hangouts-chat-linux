const {app} = require('electron');
const WindowManager = require('./window');
const TrayManager = require('./tray');
const KeyboardManager = require('./keyboard');
const applicationVersion = require('./../package.json').version;
let mainWindow, systemTrayIcon;

process.title = 'Google Hangouts Chat for Linux (Unofficial)';
console.log(process.title + ' - v' + applicationVersion);
console.log('Node.js runtime version:', process.version);

const initialize = () => {
	if(!mainWindow) {
		mainWindow = WindowManager.initializeWindow();
	}

	if(!systemTrayIcon) {
		systemTrayIcon = TrayManager.initializeTray(mainWindow);
	}

	KeyboardManager.registerKeyboardShortcuts(mainWindow);
	
};

app.on("ready", initialize);
app.on("activate", initialize);

