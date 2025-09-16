
CREATE TABLE IF NOT EXISTS departments (
                                           department_id SERIAL PRIMARY KEY,
                                           department_name VARCHAR(100) NOT NULL,
                                           budget NUMERIC(12, 2),
                                           established_date DATE
);

-- Создание таблицы employees с внешним ключом на departments
CREATE TABLE IF NOT EXISTS employees (
                                         employee_id SERIAL PRIMARY KEY,
                                         full_name VARCHAR(150) NOT NULL,
                                         salary NUMERIC(10, 2),
                                         hire_date DATE,
                                         age INTEGER,
                                         department_id INTEGER REFERENCES departments(department_id) ON DELETE SET NULL
);

-- Очистка таблиц перед вставкой (если нужно пересоздать данные)
TRUNCATE TABLE employees, departments RESTART IDENTITY CASCADE;

-- Вставка данных в таблицу departments
INSERT INTO departments (department_name, budget, established_date) VALUES
                                                                        ('IT Department', 500000.00, '2020-03-15'),
                                                                        ('HR Department', 300000.00, '2019-07-22'),
                                                                        ('Finance Department', 700000.00, '2018-11-10'),
                                                                        ('Marketing Department', 400000.00, '2021-01-30');

-- Вставка данных в таблицу employees
INSERT INTO employees (full_name, salary, hire_date, age, department_id) VALUES
                                                                             ('Иван Петров', 85000.00, '2021-06-01', 30, 1),
                                                                             ('Мария Сидорова', 75000.00, '2022-02-15', 28, 1),
                                                                             ('Анна Кузнецова', 65000.00, '2020-09-10', 35, 2),
                                                                             ('Дмитрий Орлов', 90000.00, '2019-11-20', 40, 3),
                                                                             ('Елена Васильева', 70000.00, '2023-03-05', 26, 4),
                                                                             ('Сергей Николаев', 80000.00, '2021-08-12', 33, 3),
                                                                             ('Ольга Михайлова', 60000.00, '2022-11-30', 29, 2);

-- Дополнительно: создание индекса для ускорения поиска по внешнему ключу
CREATE INDEX IF NOT EXISTS idx_employees_department_id ON employees(department_id);