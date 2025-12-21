import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Surendar@19",
  database: "rmkzapoutdb",
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;
