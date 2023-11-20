const mysql = require('mysql2');
const inquirer = require('inquirer');

// Create a connection to your MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'employeetracker',
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the MySQL database as id ' + db.threadId);

  // Start the application
  startApp();
});

function addRole() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Enter the title of the role:',
        },
        {
          type: 'input',
          name: 'salary',
          message: 'Enter the salary for the role:',
        },
        {
          type: 'input',
          name: 'departmentId',
          message: 'Enter the department ID for the role:',
        },
      ])
      .then((response) => {
        const { title, salary, departmentId } = response;
        db.query(
          'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)',
          [title, salary, departmentId],
          (err) => {
            if (err) {
              console.error('Error adding role: ' + err.stack);
              return;
            }
            console.log('Role added successfully.');
            startApp(); // Continue with the main menu
          }
        );
      });
  }
  
function startApp() {
  inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View all departments':
          viewDepartments();
          break;

        case 'View all roles':
          viewRoles();
          break;

        case 'View all employees':
          viewEmployees();
          break;

        case 'Add a department':
          addDepartment();
          break;

        case 'Add a role':
          addRole();
          break;

        case 'Add an employee':
          addEmployee();
          break;

        case 'Update an employee role':
          updateEmployeeRole();
          break;

        case 'Exit':
          // Exit the application
          console.log('Goodbye!');
          db.end(); // Close the database connection
          break;
      }
    });
}

// Define functions for actions

function viewDepartments() {
  db.query('SELECT * FROM departments', (err, departments) => {
    if (err) {
      console.error('Error fetching departments: ' + err.stack);
      return;
    }
    console.table(departments); // Display departments in a formatted table
    startApp(); // Continue with the main menu
  });
}

function viewRoles() {
  db.query('SELECT * FROM roles', (err, roles) => {
    if (err) {
      console.error('Error fetching roles: ' + err.stack);
      return;
    }
    console.table(roles); // Display roles in a formatted table
    startApp(); // Continue with the main menu
  });
}

function viewEmployees() {
  db.query('SELECT * FROM employees', (err, employees) => {
    if (err) {
      console.error('Error fetching employees: ' + err.stack);
      return;
    }
    console.table(employees); // Display employees in a formatted table
    startApp(); // Continue with the main menu
  });
}
function addEmployee() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'firstName',
          message: 'Enter the first name of the employee:',
        },
        {
          type: 'input',
          name: 'lastName',
          message: 'Enter the last name of the employee:',
        },
        {
          type: 'input',
          name: 'roleId',
          message: 'Enter the role ID of the employee:',
        },
        {
          type: 'input',
          name: 'managerId',
          message: 'Enter the manager ID of the employee (or leave blank if none):',
        },
      ])
      .then((response) => {
        const { firstName, lastName, roleId, managerId } = response;
  
        // Check if the roleId exists in the roles table before inserting
        db.query(
          'SELECT id FROM roles WHERE id = ?',
          [roleId],
          (err, results) => {
            if (err) {
              console.error('Error checking role existence: ' + err.stack);
              return;
            }
  
            if (results.length === 0) {
              console.error('Role with ID ' + roleId + ' does not exist.');
              startApp(); // Continue with the main menu
            } else {
              // Role exists, proceed with inserting the employee
              // Check if managerId exists in the employees table (if provided)
              if (managerId !== '') {
                db.query(
                  'SELECT id FROM employees WHERE id = ?',
                  [managerId],
                  (err, managerResults) => {
                    if (err) {
                      console.error('Error checking manager existence: ' + err.stack);
                      return;
                    }
  
                    if (managerResults.length === 0) {
                      console.error('Manager with ID ' + managerId + ' does not exist.');
                      startApp(); // Continue with the main menu
                    } else {
                      // Manager exists, proceed with inserting the employee
                      db.query(
                        'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
                        [firstName, lastName, roleId, managerId],
                        (err) => {
                          if (err) {
                            console.error('Error adding employee: ' + err.stack);
                            return;
                          }
                          console.log('Employee added successfully.');
                          startApp(); // Continue with the main menu
                        }
                      );
                    }
                  }
                );
              } else {
                // No manager specified, proceed with inserting the employee
                db.query(
                  'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, NULL)',
                  [firstName, lastName, roleId],
                  (err) => {
                    if (err) {
                      console.error('Error adding employee: ' + err.stack);
                      return;
                    }
                    console.log('Employee added successfully.');
                    startApp(); // Continue with the main menu
                  }
                );
              }
            }
          }
        );
      });
  }
  
function addDepartment() {
  inquirer
    .prompt({
      type: 'input',
      name: 'name',
      message: 'Enter the name of the department:',
    })
    .then((response) => {
      const departmentName = response.name;
      db.query(
        'INSERT INTO departments (name) VALUES (?)',
        [departmentName],
        (err) => {
          if (err) {
            console.error('Error adding department: ' + err.stack);
            return;
          }
          console.log('Department added successfully.');
          startApp(); // Continue with the main menu
        }
      );
    });
}

// Similar functions for 'addRole', 'addEmployee', 'updateEmployeeRole'

// Start the application by calling the main menu
