var express = require("express");
var router = express.Router();
var pool = require("../services/internal_db/db.js");
/* const session = require("express-session"); */
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express", session: req.session });
});

router.post("/login", async function (request, response, next) {
  var user_email_address = request.body.user_email_address;

  var user_password = request.body.user_password;

  if (user_email_address && user_password) {
    q = `SELECT * FROM clientes WHERE user_email = "${user_email_address}"`;
    pool.query(q, function (err, rows, fields) {
      if (err) throw err;
      console.log(rows);
      if (rows.length > 0) {
        for (var count = 0; count < rows.length; count++) {
          if (rows[count].user_password == user_password) {
            //aca podemos inicializar variables necesarias para el template al que nos dirigimos, en este caso views/index.ejs
            request.session.user_id = rows[count].usr_id;
            request.session.nombre_fantasia = rows[count].nombre_fantasia;
            request.session.nombre = rows[count].nombre;

            response.redirect("/");
          } else {
            response.send("Incorrect Password");
          }
        }
      } else {
        response.send("Incorrect Email Address");
      }
      response.end();
    });
  } else {
    response.send("Please Enter Email Address and Password Details");
    response.end();
  }

  //const user_data = con.queryUserLogin(user_email_address);
});

router.get("/logout", function (request, response, next) {
  request.session.destroy();

  response.redirect("/");
});

module.exports = router;
