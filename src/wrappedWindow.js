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

let appIcon = undefined;
contextMenu({showInspectElement: false});

const ICON_NO_NEW_MSG = path.join(__dirname, '../assets/icon/chat-favicon-no-new-256dp.png');
const ICON_NEW_NON_NOTIF_MSG = path.join(__dirname, '../assets/icon/chat-favicon-new-non-notif-256dp.png');
const ICON_NEW_NOTIF_MSG = path.join(__dirname, '../assets/icon/chat-favicon-new-notif-256dp.png');
const ICON_OFFLINE_MSG = path.join(__dirname, '../assets/icon/chat-favicon-offline-256dp.png');

module.exports = function createWrappedWindow(opts) {
	let initPath = path.join(app.getPath("userData"), 'init.json');
	let data;
	try {
		data = JSON.parse(fs.readFileSync(initPath, 'utf8'));
	} catch (e) {
		console.error(err);
	}

	let sha = crypto.createHash('sha256');
	sha.update(opts.name);
	let hash = sha.digest('hex');

	const iconPath = path.join(__dirname, '../assets/icon/icon.png');

	let windowOpts = (data && data[hash] && data[hash].bounds) ? data[hash].bounds : {
		width: 800,
		height: 600
	};

	windowOpts['auto-hide-menu-bar'] = true;
	windowOpts['web-preferences'] = {'node-integration': false};
	windowOpts['icon'] = iconPath;

	let window = new BrowserWindow(windowOpts);
	window.setMenu(null);
	if (data && data[hash] && data[hash].shouldBeMaximized) {
		window.maximize();
	}

	window.loadURL(opts.url);

	const goBack = () => {
		if (window.webContents.canGoBack()) {
			window.webContents.goBack();
		}
	}

	const goForward = () => {
		if (window.webContents.canGoForward()) {
			window.webContents.goForward();
		}
	}

	localShortcut.register(window, 'Alt+Left', goBack);
	localShortcut.register(window, 'Alt+Right', goForward);
	localShortcut.register(window, 'F5', window.webContents.reload);

	function extractDomain(url) {
		let domain = url.includes("://") ? url.split('/')[2] : url.split('/')[0];
		domain = domain.split(':')[0];
		return domain;
	}

	const handleRedirect = (e, url) => {
		if (!opts.openLocally && 
			extractDomain(url) !== extractDomain(window.webContents.getURL()) && 
			extractDomain(url) !== "accounts.google.com" && 
			extractDomain(url) !== "accounts.youtube.com" && 
			extractDomain(url) !== "support.google.com" &&
			extractDomain(url) !== "chat.google.com") {
			require('electron').shell.openExternal(url);
			e.preventDefault();
		}
	};

	window.webContents.on('will-navigate', handleRedirect);
	window.webContents.on('new-window', handleRedirect);

	window.on('close', function () {
		let maximized = window.isMaximized();
		let newData = data || {};
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

	return window;
};

ipc.on('open-link', (evt, href) => {
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