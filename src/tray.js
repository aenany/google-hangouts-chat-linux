const {app, Tray, Menu} = require("electron");
const pathsManifest = require("./paths");
const ConfigManager = require('./configs');
const fs = require('fs');
let mainWindow;

const onShowEntryClicked = () => {
	mainWindow.show();
}

const onHideEntryClicked = () => {
	mainWindow.minimize();
}

const onQuitEntryClicked = () => {
	app.quit();
}

const onInvertEntryClicked = (mainWindow) => {
	const invertColors = fs.readFileSync(pathsManifest.invertColors, 'utf8');
	const configs = ConfigManager.loadConfigs();
	
	mainWindow.webContents.executeJavaScript(invertColors);	
	configs.darkMode = (configs.darkMode) ? false : true;
	ConfigManager.updateConfigs(configs);
}

const onSystemTrayIconClicked = () => {
	(mainWindow.isMinimized()) ? mainWindow.show() : mainWindow.focus();
}

const initializeTray = (windowObj) => {
	const systemTrayIcon = new Tray(pathsManifest.iconPath);
	mainWindow = windowObj;

	const template = [
		{
			"label": "Toggle Dark Mode",
			"role": "unhide",
			"click": () => {
				onInvertEntryClicked(mainWindow);
			}
		},
		{
			"label": "Show",
			"role": "unhide",
			"click": () => {
				onShowEntryClicked();
			},
		}, {
			"label": "Hide",
			"role": "hide",
			"click": () => {
				onHideEntryClicked();
			},
		},
		{
			"label": "Quit",
			"role": "quit",
			"click": () => {
				onQuitEntryClicked();
			}
		}
	]

	const contextMenu = Menu.buildFromTemplate(template);
	systemTrayIcon.setContextMenu(contextMenu);
	systemTrayIcon.setToolTip(process.title);
	systemTrayIcon.setTitle(process.title);

	systemTrayIcon.on("click", () => {
		onSystemTrayIconClicked();
	});

	return systemTrayIcon;
}

module.exports = {
	initializeTray: initializeTray
};