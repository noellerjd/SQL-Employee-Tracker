// Import and require mysql2
const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();
// const dotenv = require("dotenv");
const inquirer = require("inquirer");
const e = require("express");
// const { Sequelize, DataTypes } = require("sequelize");
// const sequelize = new Sequelize("sqlite::memory:");
// const fs = require("fs");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

var con = mysql.createConnection({
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Initial Prompt
const init = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "options",
        message: "Select an option",
        choices: [
          {
            name: "View Departments",
            value: "viewDepartment",
          },
          {
            name: "View Employees",
            value: "viewEmployees",
          },
          {
            name: "Add Department",
            value: "addDepartment",
          },
          {
            name: "Add Employee",
            value: "addEmployee",
          },
        ],
      },
    ])
    // View Departments
    .then((response) => {
      if (response.options === "viewDepartment") {
        con.connect(function (err) {
          if (err) throw err;
          console.log("Connected!");
          con.query(
            "SELECT * FROM departments",
            function (err, result, fields) {
              if (err) throw err;
              let departmentList = [];
              result.forEach((element) => {
                departmentList.push({
                  name: element.name,
                  value: element.name,
                });
              });
              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "departmentName",
                    message: "Which department would you like to select?",
                    choices: departmentList,
                  },
                ])
                .then((response) => {
                  let department = response.departmentName;
                  inquirer
                    .prompt([
                      {
                        type: "list",
                        name: "selectAction",
                        message:
                          "What would you like to do with this department?",
                        choices: [
                          {
                            name: "View Employees",
                            value: "viewEmployees",
                          },
                          {
                            name: `Delete ${response.departmentName} department`,
                            value: "deleteDepartment",
                          },
                        ],
                      },
                    ])
                    .then((response) => {
                      switch (response.selectAction) {
                        case "viewEmployees":
                          var sql = `SELECT * FROM employees WHERE department = '${department}'`;
                          con.query(sql, function (err, result) {
                            if (err) throw err;
                            console.table(result, [
                              "firstName",
                              "lastName",
                              "department",
                            ]);
                          });
                          break;

                        case "deleteDepartment":
                          var sql = `DELETE FROM departments WHERE name = "${department}" `;
                          con.query(sql, function (err, result) {
                            if (err) throw err;
                            console.log(
                              `${department} deleted from department database`
                            );
                            console.log("-------------------------");
                            console.log("Returning to main menu...");
                            console.log("-------------------------");
                            init();
                          });
                          break;

                        default:
                          break;
                      }
                    });
                });
            }
          );
        });
      }
      // Add Departments
      if (response.options === "addDepartment") {
        inquirer
          .prompt([
            {
              type: "input",
              name: "departmentName",
              message: "What will this department be called?",
            },
            {
              type: "list",
              name: "confirm",
              message: "Are you sure you want to add this department?",
              choices: [
                {
                  name: "Yes",
                  value: "confirm",
                },
                {
                  name: "No",
                  value: "deny",
                },
              ],
            },
          ])
          .then((response) => {
            if (response.confirm === "confirm") {
              //   console.log(`Add Department ${response.departmentName}`);
              con.connect(function (err) {
                if (err) throw err;
                console.log("Connected!");
                var sql = `INSERT INTO departments (name) VALUES ('${response.departmentName}')`;
                con.query(sql, function (err, result) {
                  if (err) throw err;
                  console.log("-------------------------");
                  console.log(
                    `Added ${response.departmentName} to the database`
                  );
                  console.log("-------------------------");
                  //   console.log(result);
                  console.log("-------------------------");
                  console.log("Returning to main menu...");
                  console.log("-------------------------");
                  init();
                });
              });
            }
            if (response.confirm === "deny") {
              console.log("-------------------------");
              console.log("Returning to main menu...");
              console.log("-------------------------");
              init();
            }
          });
      }
      if (response.options === "viewEmployees") {
        con.connect(function (err) {
          if (err) throw err;
          con.query("SELECT * FROM employees", function (err, result, fields) {
            if (err) throw err;
            console.table(result, ["firstName", "lastName", "department"]);
          });
        });
      }
      if (response.options === "addEmployee") {
        inquirer
          .prompt([
            {
              type: "input",
              name: "firstName",
              message: "What is the employee's first name?",
            },
            {
              type: "input",
              name: "lastName",
              message: "What is the employee's last name?",
            },
            {
              type: "number",
              name: "salary",
              message: "What is the employee's salary?",
            },
          ])
          .then((response) => {
            if (!response.salary) {
              console.log("Invalid salary");
              console.log("-------------------------");
              console.log("Returning to main menu...");
              console.log("-------------------------");
              init();
              return;
            }
            if (response) {
              let employeeData = {
                firstName: response.firstName,
                lastName: response.lastName,
                salary: response.salary,
                department: "",
              };
              con.connect(function (err) {
                con.query(
                  "SELECT * FROM departments",
                  function (err, result, fields) {
                    if (err) throw err;
                    let departmentList = [];
                    result.forEach((element) => {
                      departmentList.push({
                        name: element.name,
                        value: element.name,
                      });
                    });
                    inquirer
                      .prompt([
                        {
                          type: "list",
                          name: "department",
                          message: `Which department does ${response.firstName} belong to?`,
                          choices: departmentList,
                        },
                      ])
                      .then((response) => {
                        employeeData.department = response.department;
                        var sql = `INSERT INTO employees (firstName, lastName, salary, department) VALUES ('${employeeData.firstName}', '${employeeData.lastName}', ${employeeData.salary}, '${employeeData.department}')`;

                        con.query(sql, function (err, result) {
                          if (err) throw err;
                          console.log(
                            `${employeeData.firstName} has been added under the department ${employeeData.department}`
                          );
                          console.log("-------------------------");
                          console.log("Returning to main menu...");
                          console.log("-------------------------");
                          init();
                        });
                      });
                  }
                );
              });
            }
          });
      }
    });
};

init();

// console.log(process.env);
