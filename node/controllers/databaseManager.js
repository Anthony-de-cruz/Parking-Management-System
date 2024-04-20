var pg = require("pg");
const { Pool } = pg;

const pool = new Pool({
  host: "pms-db",
  user: "postgres",
  password: "password",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const query = async (text, params) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log("executed query", { text, duration, rows: res.rowCount });
  return res;
};

module.exports = { query };
