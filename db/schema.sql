DROP DATABASE IF EXISTS department_db;
CREATE DATABASE department_db;

USE department_db;

CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT,

    name VARCHAR (30) NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    firstName VARCHAR (30) NOT NULL,
    lastName VARCHAR (30) NOT NULL,
    salary INT NOT NULL,
    department VARCHAR (30) NOT NULL,

    PRIMARY KEY (id)
)

