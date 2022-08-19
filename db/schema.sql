DROP DATABASE IF EXISTS department_db;
CREATE DATABASE department_db;

USE department_db;

CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT,

    name VARCHAR (30) NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE SALES AS 
SELECT id, name
FROM departments