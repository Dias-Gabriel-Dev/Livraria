import mongoose from "mongoose";

async function conectaNaDataBase() {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Conexão com o banco feita com sucesso!");
    } catch (erro) {
        console.error("Erro ao conectar no banco de dados:", erro);
        process.exit(1); // Encerra o processo em caso de erro
    }
}

export default conectaNaDataBase;



