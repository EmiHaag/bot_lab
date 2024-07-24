var { PORT } = require("./internal_db/config.js");
var { pool } = require("./internal_db/db.js");
var express = require("express");
var bot = require("@bot-whatsapp/bot");
/* var { getDay } = require("date-fns"); */
/* var QRPortalWeb = require("@bot-whatsapp/portal");
var BaileysProvider = require("@bot-whatsapp/provider/baileys");
var MockAdapter = require("@bot-whatsapp/database/mock");
var menu = require("./internal_db/menu.js"); */
//var user require( "./services/internal_db/user.js";
//var hacerPedido require( "./services/internal_db/pedidos.js";
//var chatgpt require( "./services/openai/chatgpt.js";
const app = express();

app.listen(PORT);

const USER_ID = 1; //nombre Emiliano, nombre empresa: La bona pasta, temporal , luego hay que automatizar--
var nombre_fantasia = "";

console.log("nombre fantasia 2 : ", nombre_fantasia);
const PEDIDO = [];

//console.log(givenMenu);
const flowPrincipal = bot
  .addKeyword(["resto"])
  .addAnswer([
    `Bienvenido/a *`,
    nombre_fantasia,
    `* 🫕`,
    `Tenemos menús diarios variados`,
    `Te gustaria conocerlos ¿?`,
    `Escribe *marito*`,
  ]);
var givenMenu = [];
const flowMenu = bot
  .addKeyword("marito")
  .addAnswer(
    `Hoy tenemos el siguiente menu:`,
    null,
    async (_, { flowDynamic }) => {
      givenMenu = await menu.getMenu(USER_ID);
      const dayNumber = getDay(new Date());
      for (var i = 0; i < givenMenu.length; i++) {
        await flowDynamic("*" + i.toString() + "* - " + givenMenu[i].nombre);
      }
    }
  )
  .addAnswer(
    `Te interesa alguno?`,
    { capture: true },
    async (ctx, { gotoFlow, state, flowDynamic }) => {
      const txt = ctx.body;
      if (typeof givenMenu[parseInt(ctx.body)] === "undefined") {
        return gotoFlow(flowEmpty);
      } else {
        //state.update({ pedido: ctx.body });
        var idx = parseInt(ctx.body);
        PEDIDO.push({
          id_menu_unico: givenMenu[idx].id_menu_unico,
          usr_id: givenMenu[idx].usr_id,
          id_menu_cliente: givenMenu[idx].id_menu_cliente,
          nombre: givenMenu[idx].nombre,
          descripcion: givenMenu[idx].descripcion,
        });
        await flowDynamic("Anotado ✍️, hasta el momento este es tu pedido..");
        //var pedidoIdx = 0;
        for await (const pedido of PEDIDO) {
          await flowDynamic("- *" + pedido.nombre + "* ✅");
        }
      }
    }
  )
  .addAnswer(
    "Querés *1- seguir* pidiendo o *2- finalizar* tu pedido ?",
    { capture: true },
    async (ctx, { gotoFlow, state, flowDynamic }) => {
      if (ctx.body == "seguir" || ctx.body == "Seguir" || ctx.body == "1") {
        await gotoFlow(flowMenu);
      } else if (
        ctx.body == "finalizar" ||
        ctx.body == "Finalizar" ||
        ctx.body == "2"
      ) {
        await gotoFlow(flowPedido);
      } else {
        await gotoFlow(flowEmpty);
      }
    }
  );

const flowEmpty = bot
  .addKeyword(bot.EVENTS.ACTION)
  .addAnswer("*No te he entendido!*", null, async (_, { gotoFlow }) => {
    return gotoFlow(flowMenu);
  });

const flowPedido = bot
  .addKeyword(["pedir"], { sensitive: true })
  .addAnswer(
    "¿Cual es tu nombre?",
    { capture: true },
    async (ctx, { state }) => {
      state.update({ name: ctx.body });
      //console.log(state.getMyState());
    }
  )
  .addAnswer(
    "¿Dirección del pedido?",
    { capture: true },
    async (ctx, { state }) => {
      state.update({ direccion: ctx.body });
      //console.log(state.getMyState());
    }
  )
  .addAnswer(
    "¿Alguna observacion?",
    { capture: true },
    async (ctx, { state }) => {
      state.update({ observaciones: ctx.body });
      //console.log(state.getMyState());
    }
  )
  .addAnswer(
    "Perfecto tu pedido ya fué solicitado, aguardanos a que te notifiquemos..",
    null,
    async (ctx, { state, endFlow }) => {
      state.update({ pedido: PEDIDO });
      const currentState = state.getMyState();
      const pedidoBackEnd = await hacerPedido.hacerPedido(currentState);
      console.log(pedidoBackEnd);
      console.log(currentState);

      //HACER UN FLUSH => PEDIDO = [];
      /*  return endFlow({ body: "Gracias por elegirnos ! " }); */
    }
  );

const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = bot.createFlow([
    flowPrincipal,
    flowMenu,
    flowPedido,
    flowEmpty,
  ]);
  const adapterProvider = bot.createProvider(BaileysProvider);

  bot.createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb({ port: 3005 });
};
/* app.get("/user/" + USER_ID, async (req, res) => {
  const [rows] = await pool.query(`SELECT * require( users WHERE id = ${USER_ID}`);
  nombre_fantasia = rows.nombre_fantasia;
  console.log("nombre fantasia: ", nombre_fantasia);
  //res.json(rows);
  //main();
  //res.send("Servicio disponible");
}); */
module.exports = main;
