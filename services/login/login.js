import { PORT } from "./services/internal_db/config.js";
import { pool } from "./services/internal_db/db.js";
import express from "express";

const app = express();

app.listen(PORT);
