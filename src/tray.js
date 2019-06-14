const {Tray, Menu} = require("electron");
let mainWindow;

const initializeTray = (windowObj) => {
	const systemTrayIcon = new Tray();
	mainWindow = windowObj;

	const template = [{
		"label": "Show",
		"click": () => {
			onShowEntryClicked();
		},
		"label": "Hide",
		"click": () => {
			onHideEntryClicked();
		},
		"label": "Quit",
		"click": () => {
			onQuitEntryClicked();
		},
	}]

	const contextMenu = Menu.buildFromTemplate(template);
	systemTrayIcon.setContextMenu(contextMenu);
	systemTrayIcon.on("click", () => {
		onSystemTrayIconClicked();
	});
}

const onShowEntryClicked = () => {
	mainWindow.show();
}

const onHideEntryClicked = () => {
	mainWindow.minimize();
}

const onQuitEntryClicked = () => {
	// not implemented
}

const onSystemTrayIconClicked = () => {
	if(mainWindow.isMinimized()) {
		mainWindow.show();
	} else {
		mainWindow.focus();
	}
}

module.exports = initializeTray;