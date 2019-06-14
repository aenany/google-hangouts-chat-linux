const internalUrlWhitelist = [
	"accounts.google.com",
	"accounts.youtube.com",
	"support.google.com",
	"chat.google.com"
];

const extractDomain = (url) => {
	let domain = url.includes("://") ? url.split("/")[2] : url.split("/")[0];
	domain = domain.split(":")[0];
	return domain;
}

const handleRedirect = (event, url) => {	
	let domain = extractDomain(url);

	if (!wrappedWindowOptions.openLocally && 
		domain !== extractDomain(window.webContents.getURL()) && internalUrlWhitelist.includes(domain) === false) {
		require("electron").shell.openExternal(url);
		e.preventDefault();
	}
};

module.exports = handleRedirect;
