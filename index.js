const screenshot = require("desktop-screenshot");
const Jimp = require("jimp");
const robot = require("robotjs");

const SCREENSHOT_FILENAME = "tmp-screenshot.png";

function keypress() {
  process.stdin.setRawMode(true);
  return new Promise(resolve => process.stdin.once("data", () => {
    process.stdin.setRawMode(false);
    resolve();
  }));
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function areColorsSame(rgb1, rgb2, tolerance = 0) {
  return rgb1.every((c, i) => Math.abs(c - rgb2[i]) <= tolerance);
}

function resetMousePosition() {
  robot.moveMouse(0, 0);
}

function takeScreenshot() {
  console.debug("Capturing screen");
  return new Promise((resolve, reject) => {
    screenshot(SCREENSHOT_FILENAME, (error, complete) => {
      error ? reject("Error taking screenshot: " + error) : resolve();
    });
  });
}

function findClickableNode() {
  return Jimp.read(SCREENSHOT_FILENAME).then(image => {
    const area = { x: 220, y: 150, width: 1000, height: 850 };
    let clickableNode;

    image.scan(area.x, area.y, area.width, area.height, function(x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];

      // Cannot return early with this lib. Hence workaround with temp var `clickableNode`.
      if (!clickableNode && areColorsSame([r, g, b], [156, 148, 116])) {
        clickableNode = [x, y];
      }
    });

    if (clickableNode) {
      console.debug(`Found clickable node at ${clickableNode}`);
      return clickableNode;
    } else {
      console.debug("Could not find clickable node");
      throw new Error("Could not find clickable node");
    }
  });
}

async function clickNode(x, y) {
  robot.moveMouse(x + 15, y + 15);
  robot.mouseToggle("down");
  await timeout(1200);
  robot.mouseToggle("up");
}

function isPrestigeReady() {
  return Jimp.read(SCREENSHOT_FILENAME).then(image => {
    const pixels = [[678, 512],[677, 655],[614, 620]].map(positions => image.getPixelColor(...positions));

    const allPixelsRed = pixels.every(pixel => {
      const c = Jimp.intToRGBA(pixel);
      return areColorsSame([c.r, c.g, c.b], [200, 0, 0], 60);
    });

    return allPixelsRed;
  });
}

async function performPrestige() {
  robot.moveMouse(670, 580);
  robot.mouseToggle("down");
  await timeout(2500);
  robot.mouseToggle("up");
}

let nbConsecutiveErrors = 0;
let lastClickableNode;

async function run() {
  try {
    resetMousePosition();
    await takeScreenshot();
  } catch(e) {
    console.error(e);
    await keypress();
    process.exit(1);
  }

  try {
    [x, y] = await findClickableNode();

    if (JSON.stringify(lastClickableNode) == JSON.stringify([x, y])) {
      throw new Error("Could not validate previously identified node. Out of bloodpoints?");
    }

    nbConsecutiveErrors = 0;
    await clickNode(x, y);
    resetMousePosition();
    lastClickableNode = [x, y];

  } catch(e) {
    if (e.message == "Could not find clickable node") {
      if (await isPrestigeReady()) {
        console.debug("Prestige ready, leveling up")
        await performPrestige();
      }
      else
      {
        nbConsecutiveErrors+= 1;
        if (nbConsecutiveErrors > 5) {
          console.error("Could not find clickable node. Tried several times.");
          await keypress();
          process.exit(1);
        }

        // Maybe opened mystery box or just finished bloodweb. Trying to reset UI state + wait some more.
        resetMousePosition();
        robot.mouseClick();
        await timeout(5000);
      }
    } else {
      console.error(`${e.message} Aborting.`);
      await keypress();
      process.exit(1);
    }
  }

  run();
}

console.log("Focus window on bloodweb. Starting in 10 seconds.");
setTimeout(run, 10000);
