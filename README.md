# Unofficial Google Hangouts Chat client for Linux

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/daa44071b9c84ec883b9a3f44831eaf2)](https://www.codacy.com/app/aenany/google-hangouts-chat-linux?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=aenany/google-hangouts-chat-linux&amp;utm_campaign=Badge_Grade)
 [![Known Vulnerabilities](https://snyk.io/test/github/aenany/google-hangouts-chat-linux/badge.svg)](https://snyk.io/test/github/aenany/google-hangouts-chat-linux) 
 
This project supports Linux clients for [Google Hangouts Chat for Teams](https://gsuite.google.com/products/chat/). Contributions are welcome, this is a project maintained to learn more about Electron, and to hopefully provide something of use to Linux users of Google Hangouts.

## Features

* Ability to toggle "Dark Mode", which inverts the colors in the application for easy reading at night
* Persistent login sessions
* Remember size and position of the application window upon restart
* Remember preference for Dark Mode
* Support for major Linux distributions (AppImage, Snap, Debian, RPM, Arch Linux (Pacman), Alpine Linux (APK), and ZIP)
* Support for FreeBSD

## Getting Started

For development, clone the repository and follow the rest of the instructions. For general usage, see the [GitHub Releases](https://github.com/aenany/google-hangouts-chat-linux/releases) page.

### Prerequisites

You will need:

```
Node.js v12.4.0+
Yarn v1.16+
ESLint v6.0.0+
```

### Installing

Install Node.js modules by navigating to the root of the repository and running:

```
yarn
```

Once modules are installed, please run:

```
yarn start
```

A separate window should spawn, prompting a login screen to Google Hangouts, provide your Google credentials to start using Hangouts Chat.

<!-- 
## Running the tests

TBD.

## Deployment

TBD. -->

# Building the Linux binaries

Ability to build the above mentioned binaries were accomplished in Kubuntu 18.04 LTS with the following dependencies / commands:

```
sudo apt install rpm
sudo apt install build-essential
sudo apt install ruby ruby-dev rubygems gcc make
sudo apt install makepkg
sudo apt install bsdtar
```

Once that is complete, install the npm packages.

Then run the following command:

`yarn dist`

The binaries will output to the `dist/` folder.

## Built With

* [Node.js](https://nodejs.org) - JavaScript runtime environment
* [Yarn](https://yarnpkg.com/en/) - Fast, reliable, and secure dependency management for Node.js
* [Electron](https://electronjs.org/) - Desktop application framework for Node.js
* [Babel](https://babeljs.io/) - The compiler for next generation JavaScript
* [electron-builder](https://www.electron.build/) - Packager and distribution framework for Electron
* [electron-localshortcut](https://www.npmjs.com/package/electron-localshortcut) - Register keyboard shortcuts with Electron
* [electron-context-menu](https://www.npmjs.com/package/electron-localshortcut) - Register keyboard shortcuts with Electron

## Contributing

Please read [CONTRIBUTING.md](https://github.com/aenany/google-hangouts-chat-linux/blob/master/CONTRIBUTING.md) for the process for submitting pull requests to the project.

## Versioning

This project uses [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/aenany/google-hangouts-chat-linux/project/tags). 

## Authors

* **A Enany** - *Initial work* - [aenany](https://github.com/aenany)

See also the list of [contributors](https://github.com/aenany/google-hangouts-chat-linux/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Inspired by the original project at https://github.com/robyf/google-chat-linux
* [This awesome stackoverflow response for dark mode](https://stackoverflow.com/questions/4766201/javascript-invert-color-on-all-elements-of-a-page)
* The actual development of the application by [Google LLC](https://about.google/intl/en).
