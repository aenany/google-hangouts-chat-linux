var ipc = require('electron').ipcRenderer;
document.addEventListener("click", (evt) => {
    if (evt.target && evt.target.localName == "a" && evt.target.target == "_blank" && evt.target.href.startsWith("http")) {
        ipc.send("open-link", evt.target.href);
        evt.preventDefault();
    }
}, true);