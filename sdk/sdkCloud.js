import { Builder } from "selenium-webdriver";
import { smartuiSnapshot } from "@lambdatest/selenium-driver";

(async () => {
    // Build driver with LambdaTest Cloud Grid
    const driver = await new Builder()
        .usingServer(`https://${process.env.LT_USERNAME}:${process.env.LT_ACCESS_KEY}@hub.lambdatest.com/wd/hub`)
        .forBrowser("chrome")
        .build();

    try {
        // Your website URL
        await driver.get("https://www.flipkart.com/");

        // Capture SmartUI snapshot
        await smartuiSnapshot(driver, "updated");
    } catch (err) {
        console.error("Error during SmartUI snapshot:", err);
    } finally {
        await driver.quit();
    }
})();


// import { Builder } from "selenium-webdriver";
// import { smartuiSnapshot } from "@lambdatest/selenium-driver";

// (async () => {
//     const driver = await new Builder()
//         .usingServer(`https://${process.env.LT_USERNAME}:${process.env.LT_ACCESS_KEY}@hub.lambdatest.com/wd/hub`)
//         .forBrowser("chrome")
//         .build();

//     try {
//         // STEP 1 — Open Amazon
//         await driver.get("https://www.flipkart.com/");

//         console.log("Waiting 10 seconds before capturing screenshot...");
//         await new Promise(resolve => setTimeout(resolve, 10000)); // 🎯 10-second delay

//         // STEP 2 — Capture screenshot with SmartUI
//         await smartuiSnapshot(driver, "amazon_part2");

//         console.log("Snapshot taken: amazon_part2");
//     } catch (err) {
//         console.error("Error during SmartUI snapshot:", err);
//     } finally {
//         await driver.quit();
//     }
// })();
