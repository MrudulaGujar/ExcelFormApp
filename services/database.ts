import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase() {
  if (!db) {
    db = await SQLite.openDatabaseAsync("employee.db");

    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        employeeId TEXT NOT NULL,
        department TEXT NOT NULL,
        createdAt TEXT NOT NULL
      );
    `);
  }

  return db;
}

export async function saveEmployee(
  name: string,
  employeeId: string,
  department: string
) {
  const database = await getDatabase();

  await database.runAsync(
    `
      INSERT INTO employees
      (name, employeeId, department, createdAt)
      VALUES (?, ?, ?, ?)
    `,
    name,
    employeeId,
    department,
    new Date().toISOString()
  );
}

export async function getEmployees() {
  const database = await getDatabase();

  const employees = await database.getAllAsync<{
    id: number;
    name: string;
    employeeId: string;
    department: string;
    createdAt: string;
  }>(
    `
      SELECT *
      FROM employees
      ORDER BY id DESC
    `
  );

  return employees;
}