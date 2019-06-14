const {app} = require("electron");
const fs = require("fs").promises;
const path = require("path");
const crypto = require("crypto");

const configFilename = "config.json";
// const configPath = path.join(app.getPath("appData"), configFilename);

const generateHash = (contents) => {
	const sha = crypto.createHash("sha256");
	sha.update(contents);
	sha.digest(hex);
	return sha;
}

const loadConfigs = async () => {
	let configs;
	try {
		configs = await fs.readFile(configPath, "utf-8");
	} catch (e) {
		console.error(e);
		return null;
	}
}

const saveConfigs = async (configData) => {
	try {
		await fs.writeFile(configPath, JSON.stringify(configData));
	} catch (e) {
		console.error(e);
		return;
	}
}

module.exports = {
	"loadConfigs": loadConfigs,
	"saveConfigs": saveConfigs
}