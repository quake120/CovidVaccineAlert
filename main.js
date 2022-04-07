const puppeteer = require("puppeteer");

const main = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 720 });
  console.log("Opening U of U MyChart Page ...");
  await page.goto(
    "https://mychart.med.utah.edu/mychart/Authentication/Login?",
    { waitUntil: "networkidle0" }
  );

  console.log("Logging in ...");
  await page.type("#Login", "<redacted>");
  await page.type("#Password", "<redacted>");

  await Promise.all([
    page.click("#submit"),
    page.waitForNavigation({ waitUntil: "networkidle0" }),
  ]);

  await Promise.all([
    console.log("Going to vaccine page ..."),
    page.goto(
      "https://mychart.med.utah.edu/mychart/Scheduling?workflow=procedure&rfvId=126&topic=1pkHgCZW6fn%2FG9233qmYdg%3D%3D"
    ),
    page.waitForNavigation({ waitUntil: "networkidle0" }),
    page.waitForSelector('label[class="togglebutton"]'),
  ]);

  for (var x = 0; x < 6; x++) {
    console.log("Answering question", x + 1);
    await Promise.all([
      await page.click(
        "#question-wrapper > div > fieldset > div > span:nth-child(2)"
      ),
      await page.waitForTimeout(1000),
      await page.click("#questionform > div.formbuttons.ques-actions > input"),
      await page.waitForTimeout(1000),
    ]);
  }

  await Promise.all([
    await page.waitForTimeout(1000),
    await page.click("#question-wrapper > div > fieldset > div > span"),
    await page.waitForTimeout(2000),
    await page.click("#questionform > div.formbuttons.ques-actions > input"),
    await page.waitForTimeout(2000),
  ]);

console.log("Choosing scheduling page ...");

  await Promise.all([
    await page.waitForTimeout(1000),
    await page.click(
      "#scheduling-workflow > div:nth-child(7) > div:nth-child(1) > div > div.grid.cardlist.matchHeights.list.hoverable.selectable.shortcards > div > a:nth-child(1)"
    ),
    await page.waitForTimeout(500),
    await page.click("#scheduling-continue"),
    await page.waitForTimeout(500),
    await page.click(
      "#scheduling-workflow > div:nth-child(9) > div > div > div > a"
    ),
  ]);

  await page.waitForSelector(
    "#scheduling-workflow > div:nth-child(10) > div:nth-child(1) > div > div > div > div.col-9 > div.slotsData.card > div.nodata.nodatamessage.nodays.jqHidden"
  );

  console.log("Checking for vaccine availability ...");

	if(page.$("#scheduling-workflow > div:nth-child(10) > div:nth-child(1) > div > div > div > div.col-9 > div.slotsData.card > div.nodata.nodatamessage.nodays.jqHidden")) { 

  var status = await page.$eval(
    "#scheduling-workflow > div:nth-child(10) > div:nth-child(1) > div > div > div > div.col-9 > div.slotsData.card > div.nodata.nodatamessage.nodays.jqHidden",
    (el) => el.innerText
  );

}
else { 
	console.log("Vaccine appt may be available!")
}

  if (
    status ==
    "No times found. Please try another date range or call the clinic and our staff will help you schedule this appointment."
  ) {
    console.log("No vaccines available");
  }
	
process.exit()
};

main();
