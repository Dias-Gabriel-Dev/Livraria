import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema({
    nome: {type: String, default: "cliente"},
    email: {type: String, required: true},
    senha: {type: String, required: true},
    cpf: {type: String, required: true, unique: true, trim: true},
    role: {type: String, required: true},
}, {versionKey: false});

const Usuario = mongoose.model("usuarios", UsuarioSchema);

export default Usuario