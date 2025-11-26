// visualTest.js
// Usage: node visualTest.js
// Requires: selenium-webdriver installed (already in your project)

const { Builder, By, until } = require("selenium-webdriver");

(async () => {
  const USERNAME = process.env.LT_USERNAME || "YOUR_USERNAME";
  const KEY = process.env.LT_ACCESS_KEY || "YOUR_ACCESS_KEY";

  if (!process.env.LT_USERNAME || !process.env.LT_ACCESS_KEY) {
    console.error("Please set LT_USERNAME and LT_ACCESS_KEY in this terminal session.");
    process.exit(1);
  }

  // SmartUI capabilities (must include visual:true and smartUI.project)
  let capabilities = {
    platform: "Windows 10",
    browserName: "chrome",
    version: "latest",
    visual: true,                         // MUST be true for SmartUI
    name: "Visual: example homepage",
    build: "Build_1",
    "smartUI.project": "Visual_test",     // EXACT project name in SmartUI (case-sensitive)
    "smartUI.build": "Build_1",
    "smartUI.baseline": false
  };

  const gridUrl = `https://${USERNAME}:${KEY}@hub.lambdatest.com/wd/hub`;

  let driver = await new Builder().usingServer(gridUrl).withCapabilities(capabilities).build();

  try {
    // navigate to target page (change to your app)
    await driver.get("https://example.com");

    // 1) take a viewport screenshot
    await driver.executeScript("smartui.takeScreenshot", {
      screenshotName: "homepage-viewport"
    });
    console.log("Viewport screenshot requested.");

    // 2) take a full-page screenshot (string form)
    await driver.executeScript("smartui.takeFullPageScreenshot=homepage-fullpage");
    console.log("Full-page screenshot requested.");

    // 3) take element screenshot (example showing how)
    // Make sure the selector exists on the page or adjust it
    try {
      await driver.findElement(By.css("h1")); // wait until exists
      await driver.executeScript("smartui.takeScreenshot", {
        screenshotName: "homepage-h1",
        elementType: "css_selector",
        element: "h1"
      });
      console.log("Element screenshot requested.");
    } catch (e) {
      console.log("Element for element-screenshot not found, skipping element capture.");
    }

    // 4) optionally fetch screenshot status (returns screenshotsData array)
    const status = await driver.executeScript("return smartui.fetchScreenshotStatus");
    console.log("SmartUI fetch status result (may be null until processing finishes):", status);

    // wait a short time so SmartUI uploads can finish on the server side
    await driver.sleep(5000);
  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    await driver.quit();
    console.log("Session ended.");
  }
})();
