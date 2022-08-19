// Import and require mysql2
const express = require("express");
// const mysql = require("mysql2");
// const dotenv = require("dotenv");
const inquirer = require("inquirer");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");
// const fs = require("fs");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

console.log(User === sequelize.models.User);

const init = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "options",
        message: "Add or View Departments?",
        choices: [
          {
            name: "View Departments",
            value: "viewDepartment",
          },
          {
            name: "Add Department",
            value: "addDepartment",
          },
        ],
      },
    ])
    .then((response) => {
      if (response.options === "viewDepartment") {
        console.log(`View Department Code ${response.options}`);
      }
      if (response.options === "addDepartment") {
        // console.log(`Add Department Code ${response.options}`);
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
              console.log(`Add Department ${response.confirm}`);
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

console.log(process.env);
