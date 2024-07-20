import { createPool } from "mysql2/promise";

const getUserData = async (user_id) => {
  return new Promise((resolve, reject) => {
    var con;
    try {
      con = mysql.createPool({
        host: process.env.HOST,
        user: process.env.USER_DB,
        password: process.env.PASSWORD_DB,
        database: process.env.DATABASE,
        port: process.env.PORT,
        connectTimeout: 10000,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        charset: "utf8mb4",
        debug: true,
      });
    } catch (error) {
      "OCURRIO UN ERROR AL CONECTAR A LA BASE DE DATOS :",
        process.env.DATABASE,
        " error ==> ";
      error.message, error.stack;
      con.end();
    }
    try {
      const q_str =
        "SELECT * from " +
        process.env.TABLE_CLIENTES +
        " where usr_id = " +
        user_id;

      con.query(q_str, function (error, results) {
        if (error) {
          console.log(
            "OCURRIO UN ERROR AL OBTENER DATOS DE LA BASE DE DATOS TABLE USER :",
            error.message,
            error.stack
          );
          throw error;
        } else {
          resolve(results[0]);
        }
      });
    } catch (error) {
      console.log(error);
      con.end();
      resolve(error);
    }
  });
};

export default { getUserData };
