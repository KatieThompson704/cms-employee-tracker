// import and require packages needed for application
const mysql = require("mysql2");
const inquirer = require("inquirer");
const { printTable } = require("console-table-printer");

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: "root",
    database: "cms_db",
  },
  console.log(`Connected to the cms_db database.`)
);

// questions for user input
const menu = [
  {
    type: "list",
    message: "What would you like to do?",
    choices: [
      "View All Employees",
      "Add Employee",
      "Update Employee role",
      "View All Roles",
      "Add Role",
      "View All Departments",
      "Add Departments",
      "Done",
    ],
    name: "menu",
  },
];

function init() {
  inquirer.prompt(menu).then((response) => {
    if (response.menu === "View All Employees") {
      viewEmployee();
    } else if (response.menu === "Add Employee") {
      addEmployee();
    } else if (response.menu === "Update Employee role") {
      updateEmployee();
    } else if (response.menu === "View All Roles") {
      viewRole();
    } else if (response.menu === "Add Role") {
      addRole();
    } else if (response.menu === "View All Departments") {
      viewDepartment();
    } else if (response.menu === "Add Departments") {
      addDepartment();
    } else {
      process.exit();
    }
  });
}

function viewEmployee() {
  db.promise()
    .query(
      "SELECT CONCAT(employee.first_name,' ',employee.last_name) AS Employee, role.title AS Title, role.salary AS Salary, CONCAT(manager.first_name,' ',manager.last_name) AS Manager, department.department_name AS Department FROM employee LEFT JOIN role ON employee.role_id=role.id LEFT JOIN department ON role.department_id=department.id LEFT JOIN employee manager ON manager.id=employee.manager_id"
    )
    // square brackets around response objcet to exclude "noise"/extraneous buffer data info
    .then(([response]) => {
      printTable(response);
      init();
    });
}

async function addEmployee() {
  const [roles] = await db.promise().query("SELECT * FROM role");
  //   from inquirer, name shows on the page and value is our response
  const roleArray = roles.map((role) => ({ name: role.title, value: role.id }));
  const [managers] = await db.promise().query("SELECT * FROM employee");
  //   from inquirer, name shows on the page and value is our response
  const managerArray1 = managers.map((manager) => ({
    name: manager.first_name + " " + manager.last_name,
    value: manager.id,
  }));
  const managerArray2 = [...managerArray1, { name: "none", value: null }];
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the employee's first name?",
        name: "firstName",
      },
      {
        type: "input",
        message: "What is the employee's last name?",
        name: "lastName",
      },
      {
        type: "list",
        message: "What is the employee's role?",
        choices: roleArray,
        name: "role",
      },
      {
        type: "list",
        message: "Who is the employee's manager?",
        choices: managerArray2,
        name: "managerID",
      },
    ])
    .then((response) => {
      console.log(response);
      db.promise()
        .query("INSERT INTO employee SET ?", {
          first_name: response.firstName,
          last_name: response.lastName,
          role_id: response.role,
          manager_id: response.managerID,
        })
        .then(() => {
          viewEmployee();
        });
      init();
    });
}

// function updateEmployee()

function viewRole() {
  db.promise()
    .query(
      "SELECT role.title AS Title, role.salary AS Salary, department.department_name AS Department FROM role LEFT JOIN department ON role.department_id=department.id"
    )
    // square brackets around response objcet to exclude "noise"/extraneous buffer data info
    .then(([response]) => {
      printTable(response);
      init();
    });
}

async function addRole() {
  const [departments] = await db.promise().query("SELECT * FROM department");
  //   from inquirer, name shows on the page and value is our response
  const deptArray = departments.map((dept) => ({
    name: dept.department_name,
    value: dept.id,
  }));
  inquirer
    .prompt([
      {
        type: "input",
        name: "roleTitle",
        message: "What is the name of the new role?",
      },
      {
        type: "input",
        message: "What is the salary of this new role?",
        name: "salary",
      },
      {
        type: "list",
        message: "What department is the new role within?",
        choices: deptArray,
        name: "department",
      },
    ])
    .then((response) => {
      db.promise()
        .query("INSERT INTO role SET ?", {
          title: response.roleTitle,
          salary: response.salary,
          department_id: response.department,
        })
        .then(() => {
          viewRole();
        });
      init();
    });
}

function viewDepartment() {
  db.promise()
    .query("SELECT department.department_name AS Department FROM department")
    // square brackets around response objcet to exclude "noise"/extraneous buffer data info
    .then(([response]) => {
      printTable(response);
      init();
    });
}

function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      name: "name",
      message: "What is the name of the new department",
    })
    .then((response) => {
      db.promise()
        .query("INSERT INTO department SET ?", {
          department_name: response.name,
        })
        .then(([response]) => {
          if (response.affectedRows > 0) {
            viewDepartment();
          } else {
            console.log("Department not created; Error entry");
            init();
          }
        });
    });
}

init();
