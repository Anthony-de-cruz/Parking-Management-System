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
  console.log("executed query", { text, params, duration, rows: res.rowCount });
  return res;
};

async function testDB() {
  console.log("EXECUTING TEST QUERY");
  const result = await query("SELECT 1;");
  console.log(result.rows);
}

module.exports = { query, testDB };

