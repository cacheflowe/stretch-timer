class StretchTimerApp extends HTMLElement {
  connectedCallback() {
    console.log("component connected");
    this.render();
    this.initWindow();
    this.initStretches();
    setTimeout(() => {
      this.showNextStretch();
      this.startShowing();
    }, 100);
  }

  static register() {
    if ("customElements" in window) {
      window.customElements.define("stretch-timer-app", StretchTimerApp);
    }
  }

  css() {
    return /*css*/ `
      body {
        font-family: Arial, sans-serif;
        background-color: #111;
        color: #fff;
      }
      stretch-timer-app {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      h1 {
        /*color: red;*/
      }
      img.stretch {
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    `;
  }

  html() {
    return /*html*/ `
      <div>
        <h1>Stretch Timer</h1>
      </div>
    `;
  }

  render() {
    this.renderCount++;
    this.innerHTML = /*html*/ `
      ${this.html()}
      <style>
        ${this.css()}
      </style>
    `;
  }

  // Neutralino helpers ------------------------------

  initWindow() {
    Neutralino.window.setSize({
      width: 600,
      height: 400,
      maxWidth: 800,
      maxHeight: 500,
    });
  }

  openLink(url) {
    Neutralino.os.open(url);
  }

  // Stretch timer logic ------------------------------

  initStretches() {
    this.stretches = [
      "./images/stretches/arm_circles.png",
      "./images/stretches/arm_stretch.png",
      "./images/stretches/back_stretch.png",
      "./images/stretches/calf_stretch.png",
      "./images/stretches/elbow_press.png",
      "./images/stretches/finger_stretch.png",
      "./images/stretches/head_tilt.png",
      "./images/stretches/shoulder_shrug.png",
      "./images/stretches/shoulder_stretch.png",
      "./images/stretches/wholearm_stretch.png",
      "./images/stretches/wrist_warmup.png",
    ];
    this.stretchIndex = 0;
  }

  showNextStretch() {
    this.stretchIndex++;
    if (this.stretchIndex >= this.stretches.length) {
      this.stretchIndex = 0;
    }
    const stretch = this.stretches[this.stretchIndex];
    this.innerHTML = /*html*/ `
      <div>
        <img class="stretch" src="${stretch}" />
      </div>

      <style>
        ${this.css()}
      </style>
    `;

    // Neutralino.os.showNotification("Stretch time!", "Yoooo", "INFO");
  }

  async startShowing() {
    setInterval(async () => {
      this.showNextStretch();
      await Neutralino.window.show();
      await Neutralino.window.focus();
      // await Neutralino.window.setAlwaysOnTop(true); // or setAlwaysOnTop();
      // setTimeout(async () => {
      //   Neutralino.window.setAlwaysOnTop(false);
      // }, 1000);
    }, 15000);
  }
}

StretchTimerApp.register();
