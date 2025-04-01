import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

class AuthController {
    // Função para registrar um novo usuário
    static async registrarUsuario(req, res) {
        try {
            const erros = validationResult(req);
            if (!erros.isEmpty()) {
                return res.status(400).json({ errors: erros.array() });
            }

            const { nome, email, senha, cpf, role = "cliente" } = req.body;
            const roleNormalizado = role.toLowerCase();
            const rolesPermitidos = ["admin", "operador", "cliente"];

            if (!rolesPermitidos.includes(roleNormalizado)) {
                return res.status(400).json({ message: "Nível de acesso inválido" });
            }

            const usuarioExistente = await Usuario.findOne({ $or: [{ email }, { cpf }] });
            if (usuarioExistente) {
                return res.status(400).json({ message: "E-mail ou CPF já cadastrado" });
            }

            const senhaCriptografada = await bcrypt.hash(senha, 10);
            const novoUsuario = await Usuario.create({
                nome,
                email,
                senha: senhaCriptografada,
                cpf,
                role: roleNormalizado
            });

            res.status(201).json({ message: "Usuário registrado com sucesso!", usuario: novoUsuario });
        } catch (error) {
            res.status(500).json({ message: "Erro interno do servidor. Por favor, tente novamente mais tarde." });
        }
    }

    // Função para listar todos os usuários (apenas admin)
    static async listarUsuarios(req, res) {
        try {
            const usuarios = await Usuario.find().select("-senha -cpf");
            res.status(200).json(usuarios);
        } catch (error) {
            res.status(500).json({ message: "Erro ao listar usuários" });
        }
    }

    // Função para atualizar um usuário específico (apenas admin)
    static async atualizarUsuario(req, res) {
        try {
            const erros = validationResult(req);
            if (!erros.isEmpty()) {
                return res.status(400).json({ errors: erros.array() });
            }
    
            if (req.usuario.role !== "admin") {
                return res.status(403).json({ message: "Acesso negado. Apenas administradores podem realizar esta ação." });
            }
    
            const { id } = req.params;
            const { nome, email, senha, cpf, role } = req.body;
    
            // Verifica conflito de CPF
            const usuarioConflito = await Usuario.findOne({ 
                cpf, 
                _id: { $ne: id } // Ignora o próprio usuário
            });
    
            if (usuarioConflito) {
                return res.status(400).json({ message: "CPF já está em uso por outro usuário" });
            }
    
            // Atualiza o usuário
            const usuario = await Usuario.findByIdAndUpdate(
                id,
                { nome, email, senha: senha ? await bcrypt.hash(senha, 10) : undefined, cpf, role },
                { new: true, runValidators: true } // Valida e retorna o novo documento
            );
    
            res.status(200).json({
                message: "Usuário atualizado com sucesso!",
                usuario: {
                    _id: usuario._id,
                    nome: usuario.nome,
                    email: usuario.email,
                    role: usuario.role
                }
            });
    
        } catch (error) {
            if (error.code === 11000) { // Erro de duplicata do MongoDB
                return res.status(400).json({ message: "CPF já cadastrado" });
            }
            res.status(500).json({ message: "Erro interno do servidor" });
        }
    } 
    

    // Função para login de usuários
    static async loginUsuario(req, res) {
        try {
            // Verifica se há erros de validação
            const erros = validationResult(req);
            if (!erros.isEmpty()) {
                return res.status(400).json({ errors: erros.array() });
            }
    
            const { email, senha } = req.body;
    
            // Busca o usuário pelo email
            const usuario = await Usuario.findOne({ email });
            if (!usuario) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }
    
            // Valida a senha
            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                return res.status(401).json({ message: "Senha inválida" });
            }
    
            // Gera o token JWT
            const token = jwt.sign(
                { id: usuario._id, role: usuario.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
            );
    
            res.status(200).json({ message: "Login realizado com sucesso!", token });
        } catch (error) {
            res.status(500).json({ message: "Erro interno do servidor. Por favor, tente novamente mais tarde." });
        }
    }
}

export default AuthController;