const mysql = require("mysql2");
var {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
} = require("./config.js");

//const create_pool = pool.createPool(config);

var pool = mysql.createPool({
  user: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  database: DB_NAME,
  port: DB_PORT,
  connectTimeout: 10000,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
module.exports = pool;
//CMD
//mysql -u root -p
//CREATE DATABASE namedb;
//use namedb;
