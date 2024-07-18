import "dotenv/config";
import { createRequire } from "module";
//var mysql = require("mysql");
import mysql from "mysql";

const getUserData = async (user_id) => {
  return new Promise((resolve, reject) => {
    const con = mysql.createPool({
      host: process.env.MYSQLHOST,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQL_DATABASE,
      charset: "utf8mb4",
      debug: true,
    });
    const q_str = "SELECT * from clientes where usr_id = " + user_id;

    con.query(q_str, function (error, results) {
      if (error) {
        console.log(
          "OCURRIO UN ERROR AL OBTENER DATOS DE LA BASE DE DATOS TABLE USER "
        );
      } else {
        /* results.forEach((element) => {
          console.log(element.nombre);
        }); */
        resolve(results[0]);
      }
    });
  });
};

export default { getUserData };
