let mainWindow;

const getWindowOptions = () => {
	return {
		"name": "Google Hangouts Chat for Linux",
		"url": "https://chat.google.com"
	};
}

const initializeWindow = () => {
	const options = getWindowOptions();
	mainWindow.on("closed", onWindowClosed);
}

