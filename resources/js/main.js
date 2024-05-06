import "./stretch-timer-app.js";

// This is just a sample app. You can structure your Neutralinojs app code as you wish.
// This example app is written with vanilla JavaScript and HTML.
// Feel free to use any frontend framework you like :)
// See more details: https://neutralino.js.org/docs/how-to/use-a-frontend-library

function showInfo() {
  document.body.innerHTML += `
        ${NL_APPID} is running on port ${NL_PORT}  inside ${NL_OS}
        <br/><br/>
        <span>server: v${NL_VERSION} . client: v${NL_CVERSION}</span>
        `;
}

async function startShowing() {
  setInterval(() => {
    console.log("Stretch time!");
    Neutralino.window.show();
    Neutralino.window.focus();
  }, 15000);

  // show a notification. currently broken in windows' neutralino
  document.addEventListener("click", async function (event) {
    console.log("CLICKED");
    Neutralino.os.showNotification(
      "Hello world",
      "It works! Have a nice day",
      "INFO"
    );
  });

  // show an alert()
  // await Neutralino.os.showMessageBox("Hello", "Welcome");
  // window operations
  // Neutralino.window.minimize();
  // Neutralino.window.hide();
  // Neutralino.window.setDraggableRegion("neutralinoapp");
}

function setTray() {
  if (NL_MODE != "window") {
    console.log("INFO: Tray menu is only available in the window mode.");
    return;
  }
  let tray = {
    icon: "/resources/icons/trayIcon.png",
    menuItems: [
      { id: "VERSION", text: "Get version" },
      { id: "SEP", text: "-" },
      { id: "QUIT", text: "Quit" },
    ],
  };
  Neutralino.os.setTray(tray);
}

function onTrayMenuItemClicked(event) {
  switch (event.detail.id) {
    case "VERSION":
      Neutralino.os.showMessageBox(
        "Version information",
        `Neutralinojs server: v${NL_VERSION} | Neutralinojs client: v${NL_CVERSION}`
      );
      break;
    case "QUIT":
      Neutralino.app.exit();
      break;
  }
}

function onWindowClose() {
  Neutralino.app.exit();
}

Neutralino.init();
Neutralino.events.on("trayMenuItemClicked", onTrayMenuItemClicked);
Neutralino.events.on("windowClose", onWindowClose);

if (NL_OS != "Darwin") {
  // TODO: Fix https://github.com/neutralinojs/neutralinojs/issues/615
  setTray();
}

// showInfo();
