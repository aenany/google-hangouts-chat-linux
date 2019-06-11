const { app } = require("electron");
let mainWindow;
let WrappedWindow = require("./wrappedWindow");

const createWindow = () => {
	let wrappedWindowOptions = {
		"name": "Google Hangouts Chat",
		"url": "https://chat.google.com/",
		"openLocally": false
	};

	mainWindow = WrappedWindow(wrappedWindowOptions);
	mainWindow.on("closed", () => {
		mainWindow = null;
	});
};

app.on("ready", createWindow);
app.on("activate", () => {
	if (mainWindow === null) {
		createWindow();
	}
});