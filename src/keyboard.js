const {globalShortcut} = require("electron");
let mainWindow;

const goBack = () => {
	if (mainWindow.webContents.canGoBack()) {
		mainWindow.webContents.goBack();
	}
}

const goForward = () => {
	if (mainWindow.webContents.canGoForward()) {
		mainWindow.webContents.goForward();
	}
}

const reloadWindow = () => {
	mainWindow.reload();
}

const registerKeyboardShortcuts = (windowObj) => {
	mainWindow = windowObj;
	
	globalShortcut.register("F5", () => {
		reloadWindow();
	});

	globalShortcut.register("Alt+Right", () => {
		goForward();
	});

	globalShortcut.register("Alt+Left", () => {
		goBack();
	});
};


module.exports = {
	"registerKeyboardShortcuts": registerKeyboardShortcuts
}