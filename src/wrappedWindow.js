'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const electron = require('electron');
const localShortcut = require('electron-localshortcut');
const contextMenu = require('electron-context-menu');
let app = electron.app;
let BrowserWindow = electron.BrowserWindow;
let ipc = electron.ipcMain;
let shell = electron.shell;
let Tray = electron.Tray;
let Menu = electron.Menu;

contextMenu({showInspectElement: false});

let appIcon = undefined;

const initPath = path.join(app.getPath("userData"), 'init.json');
const iconPath = path.join(__dirname, '../assets/icon/icon.png');
const ICON_NO_NEW_MSG = path.join(__dirname, '../assets/icon/chat-favicon-no-new-256dp.png');
const ICON_NEW_NON_NOTIF_MSG = path.join(__dirname, '../assets/icon/chat-favicon-new-non-notif-256dp.png');
const ICON_NEW_NOTIF_MSG = path.join(__dirname, '../assets/icon/chat-favicon-new-notif-256dp.png');
const ICON_OFFLINE_MSG = path.join(__dirname, '../assets/icon/chat-favicon-offline-256dp.png');


const extractDomain = (url) => {
	let domain = url.includes("://") ? url.split('/')[2] : url.split('/')[0];
	domain = domain.split(':')[0];
	return domain;
}

const loadConfigs = () => {
	let configs;
	try {
		configs = JSON.parse(fs.readFileSync(initPath, 'utf8'));
		return configs;
	} catch (e) {
		console.error(e);
		return null;
	}
}

const generateHash = (wrappedWindowOptions) => {
	let sha = crypto.createHash('sha256');
	sha.update(wrappedWindowOptions.name);
	sha.digest('hex');
	return sha;
}

const initializeTray = (window) => {
	appIcon = new Tray(ICON_OFFLINE_MSG);
	
	const contextMenu = Menu.buildFromTemplate([{
		label: 'Show',
		click: function () {
			window.show()
		}
	}, {
		label: 'Hide',
		click: function () {
			window.minimize()
		}
	}, {
		label: 'Quit',
		click: function () {
			app.isQuiting = true
			app.quit()
		}
	}]);
	appIcon.setContextMenu(contextMenu);

	appIcon.on('click', function (e) {
		if (window.isMinimized()) {
			window.show();
		} else {
			window.focus();
		}
	});
}

const registerKeyboardShortcuts = (window) => {
	const goBack = () => {
		if (window.webContents.canGoBack()) {window.webContents.goBack();}
	}

	const goForward = () => {
		if (window.webContents.canGoForward()) {window.webContents.goForward();}
	}

	localShortcut.register(window, 'Alt+Left', goBack);
	localShortcut.register(window, 'Alt+Right', goForward);
	localShortcut.register(window, 'F5', window.webContents.reload);
}

module.exports = function createWrappedWindow(wrappedWindowOptions) {	
	let configs = loadConfigs();
	let hash = generateHash(wrappedWindowOptions);

	let defaultWindowBounds = {
		"width": 800,
		"height": 600
	};

	let browserWindowOptions = (
		configs &&
		configs[hash] &&
		configs[hash].bounds) ? configs[hash].bounds : defaultWindowBounds;

	browserWindowOptions['auto-hide-menu-bar'] = true;
	browserWindowOptions['web-preferences'] = {'node-integration': false};
	browserWindowOptions['icon'] = iconPath;

	let window = new BrowserWindow(browserWindowOptions);
	window.setMenu(null);
	if (configs && configs[hash] && configs[hash].shouldBeMaximized) {
		window.maximize();
	}

	window.loadURL(wrappedWindowOptions.url);

	registerKeyboardShortcuts(window);

	const handleRedirect = (e, url) => {
		let internalUrlWhitelist = [
			"accounts.google.com",
			"accounts.youtube.com",
			"support.google.com",
			"chat.google.com"
		];
		let domain = extractDomain(url);

		if (!wrappedWindowOptions.openLocally && 
			domain !== extractDomain(window.webContents.getURL()) && internalUrlWhitelist.includes(domain) === false) {
			require('electron').shell.openExternal(url);
			e.preventDefault();
		}
	};

	window.webContents.on('will-navigate', handleRedirect);
	window.webContents.on('new-window', handleRedirect);

	window.on('close', () => {
		let maximized = window.isMaximized();
		let newData = configs || {};
		newData[hash] = {
			bounds: window.getBounds()
		};
		if (maximized) {
			newData[hash].shouldBeMaximized = true;
		}
		fs.writeFileSync(initPath, JSON.stringify(newData));
	});

	window.webContents.on('dom-ready', () => {
		const scriptPath = path.join('file://', __dirname, 'node_modules/jquery/dist/jquery.min.js');
		window.webContents.executeJavaScript('var ipc = require(\'electron\').ipcRenderer; document.addEventListener("click", (evt) => { if (evt.target && evt.target.localName == "a" && evt.target.target == "_blank" && evt.target.href.startsWith("http")) { ipc.send("open-link", evt.target.href); evt.preventDefault(); } }, true);');
		window.webContents.executeJavaScript('var fi = document.querySelector("link#favicon256"); ipc.send("favicon-changed", fi.href); var callback = function(mutationList) { ipc.send("favicon-changed", fi.href); }; var observer = new MutationObserver(callback); observer.observe(fi, { attributes: true });');
	});

	initializeTray();

	return window;
};

ipc.on('open-link', (event, href) => {
	shell.openExternal(href);
});

const iconForType = (itype) =>  {
	let iconMapping = {
		"NORMAL": ICON_NO_NEW_MSG,
		"UNREAD": ICON_NEW_NON_NOTIF_MSG,
		"ATTENTION": ICON_NEW_NOTIF_MSG
	}

	let icon = iconMapping[itype] ? iconMapping[itype] : ICON_OFFLINE_MSG;
	return icon;
}

ipc.on('favicon-changed', (event, href) => {
	let itype = "";

	if (href.match(/chat-favicon-no-new/)) {
		itype = "NORMAL";
	} else if (href.match(/chat-favicon-new-non-notif/)) {
		itype = "UNREAD";
	} else if (href.match(/chat-favicon-new-notif/)) {
		itype = "ATTENTION";
	} else if (href.match(/^data:image\/png;base64,iVBOR.+/)) {
		itype = "OFFLINE";
	}

	appIcon.setImage(iconForType(itype));
});