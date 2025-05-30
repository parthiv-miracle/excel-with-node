const puppeteer = require("puppeteer");
const ejs = require("ejs");
const path = require("path");
const User = require("../models/user.model");

exports.importUserListPdf = async (req, res) => {
  try {
    // const userData = await User.find(
    //   {},
    //   { name: 1, email: 1, gender: 1, age: 1 }
    // ).lean();

    let userData = [];
    for (let i = 0; i < 100; i++) {
      userData.push({
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        gender: i % 2 === 0 ? "male" : "female",
        age: Math.floor(Math.random() * 50) + 20,
      });
    }

    // Render HTML from EJS
    const html = await ejs.renderFile(
      path.join(__dirname, "../views", "user.ejs"),
      { userData }
    );

    // Launch Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Generate PDF in memory
    const pdfBuffer = await page.pdf({
      format: "A4",
    });
    await browser.close();

    // Set headers and send PDF
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="orders.pdf"',
      "Content-Length": pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.log("🚀 ~ exports.importUserListPdf= ~ error:", error);
    return res.status(500).json({
      status: false,
      message:
        error.message ||
        "An error occurred while importing user list from PDF.",
    });
  }
};
