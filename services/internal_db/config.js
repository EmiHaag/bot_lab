var config = {
  PORT: process.env.PORT,
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_USER: process.env.DB_USER || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  DB_NAME: process.env.DB_NAME || "bot_pedidos",
  DB_PORT: process.env.DB_PORT || "3306",
};

module.exports = config;
