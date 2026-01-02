import pkg from "pg";
const { Pool } = pkg;
const pool = new  Pool({
host:"localhost",
port : 5432,
user:"postgres",
password:"varad",
database:"maris"
})
console.log(pool)
export default pool