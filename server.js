// Import and require mysql2
const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();
// const dotenv = require("dotenv");
const inquirer = require("inquirer");
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
                            name: "Add Employee",
                            value: "addEmployee",
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
                          break;

                        case "addEmployee":
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
    });
};

init();

// console.log(process.env);
