// test.js — Fully working SmartUI Visual Test (CommonJS)

const webdriver = require("selenium-webdriver");
const By = webdriver.By;
const moment = require("moment");

const USERNAME = process.env.LT_USERNAME || "username";
const KEY = process.env.LT_ACCESS_KEY || "accessKey";
const GRID_HOST = "@hub.lambdatest.com/wd/hub";

const waitTime = 2; // seconds

// ✔ Your SmartUI configuration
let capabilities = {
  platform: "Windows 10",
  browserName: "chrome",
  version: "latest",
  visual: true,
  name: "SmartUI Visual Test",
  build: "Build_1",
  "smartUI.project": "Visual_test",   // exact project name
  "smartUI.build": "Build_1",
  "smartUI.baseline": false
};

async function searchTextOnGoogle() {
  let gridUrl = "https://" + USERNAME + ":" + KEY + GRID_HOST;

  console.log("Connecting to:", gridUrl);
  console.log("Using project:", capabilities["smartUI.project"]);

  // run only 1 test
  startTest(gridUrl, capabilities);
}

searchTextOnGoogle();

async function startTest(gridUrl, caps) {
  const start = moment();

  const driver = await new webdriver.Builder()
    .usingServer(gridUrl)
    .withCapabilities(caps)
    .build();

  const end = moment();
  console.log("Setup Time:", moment.duration(end.diff(start)).asSeconds(), "sec");

  try {
    // open any website you want screenshots from:
    const url = "https://www.lambdatest.com";
    console.log("Navigating to:", url);
    await driver.get(url);

    // ✔ SmartUI Screenshot 1: viewport
    setTimeout(async function () {
      console.log("📸 Taking SmartUI screenshot...");
      let config = { screenshotName: "homepage" };

      driver.executeScript("smartui.takeScreenshot", config).then(out => {
        console.log("SmartUI Response:", out);
      });
    }, waitTime * 1000);

    // end test after 15 seconds
    setTimeout(function () {
      driver.executeScript("lambda-status=passed");
      console.log("Test finished.");
      driver.quit();
    }, 15000);

  } catch (err) {
    console.log("Error:", err);
    driver.executeScript("lambda-status=failed");
    driver.quit();
  }
}
