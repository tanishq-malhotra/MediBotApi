"use strict";

const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
let browser = null;
let departments = [];

async function openBrowser() {
  browser = await puppeteer.launch({
    headless: false
  });
}

async function closeBrowser() {
  browser.close();
}

async function fetchDepartments() {
  const page = await browser.newPage();
  await page.setRequestInterception(true);

  page.on("request", request => {
    if (
      request.resourceType() === "image" ||
      request.resourceType() === "stylesheet" ||
      request.resourceType() === "font"
    )
      request.abort();
    else request.continue();
  });

  await page.goto(
    "http://pgimer.edu.in/PGIMER_PORTAL/PGIMERPORTAL/GlobalPages/JSP/default.jsp"
  );
  await page.waitForSelector("#dept");
  var $ = cheerio.load(await page.content());
  $("#dept > option").each((index, data) => {
    if ($(data).text() != "Select one") {
      departments.push({
        name: $(data).text(),
        id: $(data).attr("value"),
        more:
          "http://pgimer.edu.in/PGIMER_PORTAL/PGIMERPORTAL/Department/Global/JSP/home_dept.jsp?CP=Eng&deptid=" +
          $(data).attr("value") +
          "&B2=GO"
      });
    }
  });
  page.close();
  console.log("Fetched Departments!");
}

async function fetchDoctors() {
  await fetchDepartments();
  const page = await browser.newPage();
  await page.setRequestInterception(true);

  page.on("request", request => {
    if (
      request.resourceType() === "image" ||
      request.resourceType() === "stylesheet" ||
      request.resourceType() === "font"
    )
      request.abort();
    else request.continue();
  });

  for (let i = 0; i < departments.length; i++) {
    let doctors = [];
    await page.goto(
      "http://pgimer.edu.in/PGIMER_PORTAL/PGIMERPORTAL/Department/Global/JSP/home_dept.jsp?CP=Eng&deptid=" +
        departments[i].id +
        "&B2=GO"
    );
    await page.goto(
      "http://pgimer.edu.in/PGIMER_PORTAL/PGIMERPORTAL/Department/Global/JSP/dept_dir.jsp"
    );
    let $ = cheerio.load(await page.content());
    $("#allData > tbody > tr").each((trIndex, trData) => {
      if (
        $(trData)
          .find("td:nth-child(4)")
          .text() === "Faculty"
      ) {
        doctors.push({
          name: $(trData)
            .find("td:nth-child(2) > a")
            .html()
            .trim()
            .replace(/\s\s+/g, " "),
          designation: $(trData)
            .find("td:nth-child(3)")
            .html(),
          email: $(trData)
            .find("td:nth-child(5)")
            .html()
        });
      }
    });
    departments[i]["doctors"] = doctors;
  }
  page.close();
}

let scrapper = async () => {
  await openBrowser();
  await fetchDoctors();
  await closeBrowser();
};

module.exports.scrapper = scrapper;
module.exports.departments = departments;
