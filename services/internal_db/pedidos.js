import "dotenv/config";
import mysql from "mysql";

const hacerPedido = async (datosPedido) => {
  return new Promise((resolve, reject) => {
    const con = mysql.createPool({
      host: MYSQL_PRIVATE_URL,
      user: MYSQLUSER,
      password: MYSQLPASSWORD,
      database: MYSQL_DATABASE,
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
          "OCURRIO UN ERROR AL INSERTAR PEDIDO EN NUESTRA BASE DE DATOS.."
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
