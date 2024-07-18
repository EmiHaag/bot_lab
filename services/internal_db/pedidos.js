import "dotenv/config";
import mysql from "mysql";

const hacerPedido = async (datosPedido) => {
  return new Promise((resolve, reject) => {
    const con = mysql.createPool({
      host: process.env.HOST,
      user: process.env.USER_DB,
      password: process.env.PASSWORD_DB,
      database: process.env.DATABASE,
      charset: "utf8mb4",
      debug: true,
    });
    const q_str =
      "INSERT INTO " +
      process.env.TABLE_PEDIDOS +
      //" (usr_id) VALUES (" +
      " (usr_id, pedido, nombre_cliente_final, direccion) VALUES (" +
      datosPedido.pedido[0].usr_id +
      ",'" +
      JSON.stringify(datosPedido.pedido) +
      "','" +
      datosPedido.name +
      "','" +
      datosPedido.direccion +
      "')";
    con.query(q_str, function (error, results) {
      if (error) {
        console.log(
          "OCURRIO UN ERROR AL OBTENER DATOS DE LA BASE DE DATOS TABLE USER :",
          error.message
        );
        console.log(error);
        console.log(datosPedido);
      } else {
        resolve(results);
        2;
      }
    });
  });
};
export default { hacerPedido };
