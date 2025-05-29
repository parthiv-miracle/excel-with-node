const ExcelJS = require("exceljs");
const User = require("../models/user.model");

exports.importUsers = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    const worksheet = workbook.worksheets[0];

    const data = [];

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return;

      const [name, email, gender, age] = row.values.slice(1);

      data.push({ name, email, gender, age });
    });

    await User.insertMany(data);
    return res.status(200).json({
      status: true,
      message: "Users imported successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

exports.exportsUsers = async (req, res) => {
  try {
    const users = await User.find(
      {},
      { _id: 0, name: 1, email: 1, gender: 1, age: 1 }
    ).lean();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");

    worksheet.columns = [
      { header: "Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 30 },
      { header: "Gender", key: "gender", width: 30 },
      { header: "Age", key: "age", width: 30 },
    ];

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, size: 16 };
    });

    users.forEach((user) => {
      worksheet.addRow(user);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=users.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
