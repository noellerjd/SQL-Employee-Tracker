// Import and require mysql2
const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db 

console.log(process.env);