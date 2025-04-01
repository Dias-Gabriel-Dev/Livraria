import express from "express";
import AuthController from "../controller/authController.js";
import { validarRegistroUsuario, validarAtualizacaoPerfil } from "../middlewares/validacaoUsuario.js";
import { autenticarToken, verificarAdmin } from "../middlewares/authMiddleware.js";
import Usuario from "../models/Usuario.js";
import { validationResult } from "express-validator"; // Adicione esta linha

const router = express.Router();

// Rota para listar usuários (apenas admin)
router.get("/usuarios", autenticarToken, verificarAdmin, AuthController.listarUsuarios);

// Rota para registrar um novo usuário
router.post("/registrar", validarRegistroUsuario, AuthController.registrarUsuario);

// Rota para login
router.post("/login", AuthController.loginUsuario);

// Rota para atualizar o próprio perfil (CORRIGIDA)
router.put("/perfil", autenticarToken, validarAtualizacaoPerfil, async (req, res) => {
    try {
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            return res.status(400).json({ errors: erros.array() });
        }

        const { nome, email } = req.body; // Extrai apenas campos permitidos

        // Verifica conflitos de email (CPF foi removido da validação)
        const usuarioExistente = await Usuario.findOne({ 
            email,
            _id: { $ne: req.usuario.id } // Exclui o próprio usuário
        });

        if (usuarioExistente) {
            return res.status(400).json({ message: "E-mail já está em uso" }); // Corrigido para 'res'
        }

        // Atualiza usuário
        const usuarioAtualizado = await Usuario.findByIdAndUpdate(
            req.usuario.id,
            { nome, email },
            { new: true }
        );

        res.status(200).json({
            message: "Perfil atualizado com sucesso!",
            usuario: usuarioAtualizado
        });
    } catch (error) {
        console.error("Erro detalhado:", error); // Log para debug
        res.status(500).json({
            message: "Erro interno do servidor. Por favor, tente novamente mais tarde."
        });
    }
}); 

// Rota para atualizar qualquer usuário (apenas admin)
router.put("/usuarios/:id", autenticarToken, verificarAdmin, AuthController.atualizarUsuario);

export default router;