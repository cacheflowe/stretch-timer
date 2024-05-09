class StretchTimerApp extends HTMLElement {
  connectedCallback() {
    console.log("component connected");
    this.render();
    this.initWindow();
    this.initStretches();
    setTimeout(() => {
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
        width: 100vh;
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
      width: 400,
      height: 400,
      maxWidth: 400,
      maxHeight: 400,
      minWidth: 400,
      minHeight: 400,
    });
  }

  openLink(url) {
    Neutralino.os.open(url);
  }

  // Stretch timer logic ------------------------------

  initStretches() {
    this.stretches = [
      "./images/stretches/side-plank-rotation.gif",
      "./images/stretches/knee-to-elbow.gif",
      "./images/stretches/axe-rotation-dumbell.gif",
      "./images/stretches/front-raises.gif",
      "./images/stretches/squats-dumbell.gif",
      "./images/stretches/shoulder-press.gif",
      "./images/stretches/front-hammer-press.gif",
      "./images/stretches/triceps-pushup.gif",
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
      "./images/stretches/jumping-jacks.gif",
      "./images/stretches/half-burpee.gif",
      "./images/stretches/chair-air-squat.gif",
      "./images/stretches/side-plank-dips.gif",
      "./images/stretches/deadlift-calf-raises.gif",
      "./images/stretches/sumo-deadlift-high-pull.gif",
      "./images/stretches/weighted-lunge.gif",
      "./images/stretches/push-press.gif",
      "./images/stretches/delt-raise.gif",
      "./images/stretches/lateral-raise.gif",
      "./images/stretches/bicep-curl.gif",
      "./images/stretches/ground-to-overhead.gif",
      "./images/stretches/scissors.gif",
      "./images/stretches/pulse-up.gif",
      "./images/stretches/russian-twist.gif",
      "./images/stretches/cat-cow.gif",
      "./images/stretches/dumbell-row.gif",
      "./images/stretches/plank-jacks.gif",
      "./images/stretches/calf-raises.gif",
      "./images/stretches/close-squats.gif",
      "./images/stretches/sump-squats.gif",
    ];
    this.stretches.sort(() => 0.5 - Math.random());
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

  async showWindow() {
    this.showNextStretch();
    await Neutralino.window.show();
    await Neutralino.window.focus();
    await Neutralino.window.maximize();
    await Neutralino.window.setAlwaysOnTop(true); // or setAlwaysOnTop();

    // delayed hide
    clearTimeout(this.hideTimeout);
    let hideTime = 1000 * 15; // 15 seconds
    this.hideTimeout = setTimeout(async () => {
      await this.hideWindow();
    }, hideTime);
  }

  async hideWindow() {
    console.log("hide!");
    Neutralino.window.setAlwaysOnTop(false);
    await Neutralino.window.hide();
  }

  async startShowing() {
    this.showWindow();
    let showInterval = 1000 * 60 * 15; // 15 minutes
    setInterval(async () => {
      this.showWindow();
    }, showInterval);
  }
}

StretchTimerApp.register();
