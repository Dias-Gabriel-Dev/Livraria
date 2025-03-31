import dotenv from "dotenv";
dotenv.config();
import express from "express";
import conectaNaDataBase from "./src/config/dbConnect.js";
import routes from "./src/routes/index.js";

conectaNaDataBase(); // Inicializa a conexão com o banco

const app = express();

app.use(express.json());
routes(app);

const PORT = 3000;

app.listen(PORT, () => {
    console.log("servidor escutando!");  
});

export default app;
