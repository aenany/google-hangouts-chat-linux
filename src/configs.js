const {app} = require("electron");
const fs = require("fs");
const path = require("path");

const configFilename = "google-hangouts-chat-linux.json";
const configPath = path.join(app.getPath("appData"), configFilename);

const loadConfigs = () => {
	try {
		return JSON.parse(fs.readFileSync(configPath, "utf8"));
	} catch (e) {
		console.error(e);
		return null;
	}
}

const updateConfigs = (updateData) => {
	let configs = loadConfigs();
	configs = Object.assign({}, configs, updateData);
	saveConfigs(configs);
}

const saveConfigs = (configData) => {
	try {
		fs.writeFileSync(configPath, JSON.stringify(configData), 'utf8');
	} catch (e) {
		console.error(e);
		return;
	}
}

module.exports = {
	"loadConfigs": loadConfigs,
	"updateConfigs": updateConfigs,
	"saveConfigs": saveConfigs
}