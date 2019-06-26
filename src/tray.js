const {app, Tray, Menu} = require("electron");
const pathsManifest = require("./paths");
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
	const invertColors = fs.readFileSync('./src/clientside/invertColors.js', 'utf8');
	mainWindow.webContents.executeJavaScript(invertColors);
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