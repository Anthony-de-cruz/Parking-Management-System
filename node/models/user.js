const { Pool } = require("pg")

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "User",
  password: "password",
  port: 5432
})

module.exports = pool



const pool = require("./db")

async function createRecord(username, password, email) {
  try {
    const result = await pool.query(
      "INSERT INTO users (username, password, email) VALUES ($1, $2) RETURNING id",
      [username, password, email]
    )
    console.log(`New record added with ID: ${result.rows[0].id}`)
  } catch (err) {
    console.error("Error creating record:", err)
  } finally {
    pool.end()
  }
}

createRecord("John Doe", "john@example.com")

