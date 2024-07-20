import { PORT } from "./services/internal_db/config.js";
import { pool } from "./services/internal_db/db.js";
import bot from "@bot-whatsapp/bot";
import { getDay } from "date-fns";
import QRPortalWeb from "@bot-whatsapp/portal";
import BaileysProvider from "@bot-whatsapp/provider/baileys";
import MockAdapter from "@bot-whatsapp/database/mock";
import menu from "./services/internal_db/menu.js";
//import user from "./services/internal_db/user.js";
//import hacerPedido from "./services/internal_db/pedidos.js";
//import chatgpt from "./services/openai/chatgpt.js";
const app = express();

app.listen(PORT);

const USER_ID = 1; //nombre Emiliano, nombre empresa: La bona pasta, temporal , luego hay que automatizar--

app.get("/first-user", async (req, res) => {
  const [rows] = await pool.query(`SELECT * FROM users WHERE ID = ${USER_ID}`);
  res.json(rows);
  //res.send("Servicio disponible");
});

const PEDIDO = [];

//console.log(givenMenu);
const flowPrincipal = bot.addKeyword(["resto"]).addAnswer([
  `Bienvenido/a *`,
  //current_user.nombre_fantasia,
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

  QRPortalWeb();
};

//main();
