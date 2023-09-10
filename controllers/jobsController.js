const puppeteer = require("puppeteer");
const PN = require("persian-number");
const fs = require("fs");
const asyncHandler = require("express-async-handler");
const getJobs = asyncHandler(async (req, res) => {
  const browser = await puppeteer.launch({
    product: "firefox",
  });
  const page = await browser.newPage();
  let lastPageNumber = 6;
  let fullJobs = [];
  for (let pageNumber = 1; pageNumber < lastPageNumber; pageNumber++) {
    await page.goto(
      `https://jobinja.ir/jobs/category/it-software-web-development-jobs/%D8%A7%D8%B3%D8%AA%D8%AE%D8%AF%D8%A7%D9%85-%D9%88%D8%A8-%D8%A8%D8%B1%D9%86%D8%A7%D9%85%D9%87-%D9%86%D9%88%DB%8C%D8%B3-%D9%86%D8%B1%D9%85-%D8%A7%D9%81%D8%B2%D8%A7%D8%B1?&page=${pageNumber}&preferred_before=1692994262&sort_by=relevance_desc`
    );
    if (pageNumber === 1) {
      lastPageNumber = PN.convertPeToEn(
        await page.evaluate(
          () =>
            document.querySelector(".paginator ul").children.item(10).innerText
        )
      );
    }
    const jobs = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll(".o-listView__item .o-listView__itemWrap  "),
        (e) => ({
          title: e.querySelector(
            ".o-listView__itemInfo .o-listView__itemTitle .c-jobListView__titleLink"
          ).innerText,
          date: e
            .querySelector(".o-listView__itemInfo .c-jobListView__passedDays")
            .innerText.trim()
            .replace("\r\n", ""),
          company: e.querySelector(
            ".o-listView__itemInfo .c-jobListView__metaItem  span"
          ).innerText,
          contract: e.querySelector(
            ".o-listView__itemInfo .c-jobListView__metaItem span span"
          ).innerText,
          city: e.querySelectorAll(
            ".o-listView__itemInfo .c-jobListView__metaItem  span"
          )[1].innerText,

          url: e.querySelector(".o-listView__itemControls a").href,
          source: "jobinja",
        })
      )
    );
    fullJobs = [...fullJobs, ...jobs];
  }
  const fullJobsString = JSON.stringify(fullJobs);
  fs.writeFile("jobs.json", fullJobsString, (err) => {
    if (err) throw err;
    console.log("Data added to file");
  });
  await browser.close();
});
module.exports = getJobs;
