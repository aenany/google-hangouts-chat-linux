const fs = require('fs');
const css = fs.readFileSync('./assets/css/dark-dynamic.css', 'utf-8')

invert = `
javascript: (\r\n\tfunction () { \r\n\t\/\/ the css we are going to inject\r\n\tvar css = \'html {-webkit-filter: invert(100%);\' +\r\n\t\t\'-moz-filter: invert(100%);\' + \r\n\t\t\'-o-filter: invert(100%);\' + \r\n\t\t\'-ms-filter: invert(100%); }\',\r\n\t\r\n\thead = document.getElementsByTagName(\'head\')[0],\r\n\tstyle = document.createElement(\'style\');\r\n\t\r\n\t\/\/ a hack, so you can \"invert back\" clicking the bookmarklet again\r\n\tif (!window.counter) { window.counter = 1;} else  { window.counter ++;\r\n\tif (window.counter % 2 == 0) { var css =\'html {-webkit-filter: invert(0%); -moz-filter:    invert(0%); -o-filter: invert(0%); -ms-filter: invert(0%); }\'}\r\n\t };\r\n\t\r\n\tstyle.type = \'text\/css\';\r\n\tif (style.styleSheet){\r\n\tstyle.styleSheet.cssText = css;\r\n\t} else {\r\n\tstyle.appendChild(document.createTextNode(css));\r\n\t}\r\n\t\r\n\t\/\/injecting the css to the head\r\n\thead.appendChild(style);\r\n\t}());\r\n
`;

module.exports = invert