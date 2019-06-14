const {Tray, Menu} = require("electron");
const pathsManifest = require("./paths");
let mainWindow;


const onShowEntryClicked = () => {
	mainWindow.show();
}

const onHideEntryClicked = () => {
	mainWindow.minimize();
}

const onQuitEntryClicked = () => {
	// not implemented
}

const onInvertEntryClicked = (mainWindow) => {
	// mainWindow.webContents.executeJavascript("javascript: (\r\nfunction () { \r\n\/\/ the css we are going to inject\r\nvar css = \'html {-webkit-filter: invert(100%);\' +\r\n    \'-moz-filter: invert(100%);\' + \r\n    \'-o-filter: invert(100%);\' + \r\n    \'-ms-filter: invert(100%); }\',\r\n\r\nhead = document.getElementsByTagName(\'head\')[0],\r\nstyle = document.createElement(\'style\');\r\n\r\n\/\/ a hack, so you can \"invert back\" clicking the bookmarklet again\r\nif (!window.counter) { window.counter = 1;} else  { window.counter ++;\r\nif (window.counter % 2 == 0) { var css =\'html {-webkit-filter: invert(0%); -moz-filter:    invert(0%); -o-filter: invert(0%); -ms-filter: invert(0%); }\'}\r\n };\r\n\r\nstyle.type = \'text\/css\';\r\nif (style.styleSheet){\r\nstyle.styleSheet.cssText = css;\r\n} else {\r\nstyle.appendChild(document.createTextNode(css));\r\n}\r\n\r\n\/\/injecting the css to the head\r\nhead.appendChild(style);\r\n}());\r\n")
}

const onSystemTrayIconClicked = () => {
	if(mainWindow.isMinimized()) {
		mainWindow.show();
	} else {
		mainWindow.focus();
	}
}

const initializeTray = (windowObj) => {
	const systemTrayIcon = new Tray(pathsManifest.iconPath);
	mainWindow = windowObj;

	const template = [
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
			"label": "Invert",
			"role": "unhide",
			"click": () => {
				onInvertEntryClicked(mainWindow);
			}
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
	systemTrayIcon.setToolTip('Google Hangouts Chat for Linux (Unofficial)');

	systemTrayIcon.on("click", () => {
		onSystemTrayIconClicked();
	});

	return systemTrayIcon;
}

module.exports = {
	initializeTray: initializeTray
};