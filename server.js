const express = require("express");
// Import and require mysql2
const mysql = require("mysql2");
// Import and require inquirer
const inquirer = require("inquirer");
// Import and require console table
const cTable = require("console.table");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
