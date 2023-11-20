-- Create the Departments table
CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- Create the Roles table
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  salary DECIMAL(10, 2) NOT NULL,
  department_id INT NOT NULL,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Create the Employees table
CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (manager_id) REFERENCES employees(id)
);

-- Sample data for departments (you can add more as needed)
INSERT INTO departments (name) VALUES
  ('Sales'),
  ('Marketing'),
  ('Engineering'),
  ('Finance');

-- Sample data for roles (you can add more as needed)
INSERT INTO roles (title, salary, department_id) VALUES
  ('Sales Associate', 50000.00, 1),
  ('Marketing Manager', 60000.00, 2),
  ('Software Engineer', 80000.00, 3),
  ('Financial Analyst', 70000.00, 4);

-- Sample data for employees (you can add more as needed)
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
  ('John', 'Doe', 1, NULL),
  ('Jane', 'Smith', 2, NULL),
  ('David', 'Johnson', 3, NULL),
  ('Mary', 'Brown', 4, NULL);
