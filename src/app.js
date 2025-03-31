import express from "express";
import conectaNaDataBase from "./config/dbConnect.js";
import routes from "./routes/index.js";

conectaNaDataBase(); 

const app = express();

app.use(express.json());
routes(app);

export default app;

