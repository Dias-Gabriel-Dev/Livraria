import express from "express";
import AuthController from "../controller/authController.js";
import { validarRegistroUsuario } from "../middlewares/validacaoUsuario.js";
import { validarAtualizacaoPerfil } from "../middlewares/validacaoUsuario.js";
import { validationResult } from "express-validator";
import { autenticarToken } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/registrar", validarRegistroUsuario, AuthController.registrarUsuario);
router.post("/login", validarRegistroUsuario, AuthController.loginUsuario);
router.put("/perfil", autenticarToken, validarAtualizacaoPerfil, async( req, res) => {
    try {
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            return res.status(400).json({ errors: erros.array() });
        }

        const { nome, email } = req.body;

        const usuarioAtualizado = await Usuario.findByIdAndUpdate(
            req.usuario.id,
            { nome, email },
            { new: true }
        );

        res.status(200).json({ message: "Perfil atualizado com sucesso!", usuario: usuarioAtualizado});
    } catch (error) {
        res.status(500).json({ message: "Erro interno do servidor. Porr favor, tente novamente mais tarde."});  
    }
});

export default router;