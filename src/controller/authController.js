import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

class AuthController {
    static async registrarUsuario(req, res) {
        try {
            // Verifica se há erros de validação
            const erros = validationResult(req);
            if (!erros.isEmpty()) {
                return res.status(400).json({ errors: erros.array() });
            }

            const { nome, email, senha, cpf, role } = req.body;

            const rolesPermitidos = ["admin", "operador", "cliente"];
            if (!rolesPermitidos.includes(role || "cliente")) {
                return res.status(400).json({ message: "Nível de acesso inválido" });
            }

            const senhaCriptografada = await bcrypt.hash(senha, 10);

            const novoUsuario = await Usuario.create({
                nome,
                email,
                senha: senhaCriptografada,
                cpf,
                role: role || "cliente"
            });

            res.status(201).json({ message: "Usuário registrado com sucesso!", usuario: novoUsuario});
        } catch (error) {
            res.status(500).json({ message: "Erro interno do servidor. Por favor, tente novamente mais tarde." });
        }
    }

    static async loginUsuario(req, res) {
        try {
            // Verifica se há erros de validação
            const erros = validationResult(req);
            if (!erros.isEmpty()) {
                return res.status(400).json({ errors: erros.array() });
            }

            const { email, senha } = req.body;

            const usuario = await Usuario.findOne({ email });
            if (!usuario) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }

            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                return res.status(401).json({ message: "Senha inválida" });
            }

            const token = jwt.sign(
                { id: usuario._id, role: usuario.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPRESS_IN || "1h" }
            );

            res.status(200).json({ message: "Login realizado com sucesso!", token });
        } catch (error) {
            res.status(500).json({ message: "Erro interno do servidor. Por favor, tente novamente mais tarde." });
        }
    }
}

export default AuthController