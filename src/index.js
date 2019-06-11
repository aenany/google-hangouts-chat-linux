const { app } = require('electron');
let mainWindow;
let WrappedWindow = require('./wrappedWindow');

const createWindow = () => {
	mainWindow = WrappedWindow({
		name: 'Google Hangouts Chat',
		url: 'https://chat.google.com/',
		openLocally: false
	});

	mainWindow.on('closed', () => {
		mainWindow = null;
	});
};

app.on('ready', createWindow);
app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});