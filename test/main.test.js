// A simple test to verify a visible window is opened with a title
const electron = require('electron');
const path = require('path')
const mocha = require('mocha');
const Application =  require('spectron').Application
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.should();
chai.use(chaiAsPromised);

let app = null;

const initSpectron = () => {	
	return new Application({
		path: electron,
		args: [path.join(__dirname, '..')],
		  env: {
			ELECTRON_ENABLE_LOGGING: true,
			ELECTRON_ENABLE_STACK_DUMPING: true,
			NODE_ENV: "development"
		},
		startTimeout: 20000,
		chromeDriverLogPath: path.join(__dirname, '../logs/chromedriverlog.txt')
   });
}


describe('Login window', () => {
	before(() => {
		if(!app) {
			app = initSpectron();
		}		
		return app.start();
	})
	
	it('appears', () => {
		this.timeout(30000);
		return app.client.waitUntilWindowLoaded().getWindowCount().should.eventually.equal(1);
	});

	it('has correct window title', () => {
		this.timeout(30000);
		return app.client.waitUntilWindowLoaded().getTitle().should.eventually.equal('Google Hangouts Chat for Linux');
	});


	after(() => {
	if(app && app.isRunning()) {
		return app.stop();
	}});

})
// app.start().then(function () {
//  // Check if the window is visible	
//   return app.browserWindow.isVisible()
// }).then(function (isVisible) {
//   // Verify the window is visible
//   assert.equal(isVisible, true)
// }).then(function () {
//   // Get the window's title
//   return app.client.getTitle()
// }).then(function (title) {
//   // Verify the window's title
//   assert.equal(title, 'My App')
// }).then(function () {
//   // Stop the application
//   return app.stop()
// }).catch(function (error) {
//   // Log any failures
//   console.log(error);
//   console.error('Test failed', error.message)
// })

