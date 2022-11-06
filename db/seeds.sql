USE cms_db;

INSERT INTO  department (department_name)
VALUES ("Accounting"),
("Business Development"),
("Human Resources"),
("Information Technology");

INSERT INTO  role (title, salary, department_id)
VALUES ("Associate Director", "160000", 1),
("Project Manager", "120000", 2),
("Data Analyst", "80000", 3),
("Jr. Data Analyst", "60000", 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Ed", "Safdie", 1, NULL),
("Russell", "Hall", 2, 1),
("Alex", "LuBoff", 3, 2),
("Katie", "Thompson", 4, 3);