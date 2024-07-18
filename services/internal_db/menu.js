import "dotenv/config";
import { createRequire } from "module";
//var mysql = require("mysql");
import mysql from "mysql";

const getMenu = async (user_id) => {
  return new Promise((resolve, reject) => {
    const con = mysql.createPool({
      host: process.env.HOST,
      user: process.env.USER_DB,
      password: process.env.PASSWORD_DB,
      database: process.env.DATABASE,
      charset: "utf8mb4",
    });
    const q_str =
      "SELECT * from " +
      process.env.TABLE_MENU +
      " where usr_id = " +
      user_id +
      " AND disponible = 1";

    con.query(q_str, function (error, results) {
      if (error) {
        console.log(
          "OCURRIO UN ERROR AL OBTENER DATOS DE LA BASE DE DATOS MENU"
        );
      } else {
        /* results.forEach((element) => {
          console.log(element.nombre);
        }); */
        resolve(results);
      }
    });
  });
};

export default { getMenu };
