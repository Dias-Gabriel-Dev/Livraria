import { body } from "express-validator";

// Validação para registro de novos usuários
export const validarRegistroUsuario = [
    body("nome")
        .isString().withMessage("O nome deve ser um texto.")
        .isLength({ min: 3, max: 50 }).withMessage("O nome deve ter entre 3 a 50 caracteres"), // ✅ Correção: Removido espaço após "50"
    body("email")
        .isEmail().withMessage("O e-mail deve ser válido."),
    body("senha")
        .isLength({ min: 6 }).withMessage("A senha deve ter no mínimo 6 caracteres"), // ✅ Correção: Pontuação consistente
    body("cpf")
        .isLength({ min: 11, max: 11 }).withMessage("O CPF deve ter exatamente 11 caracteres.") // ✅ Correção: Removido espaço inicial
        .isNumeric().withMessage("O CPF deve conter apenas números."),
    body("role")
        .optional()
        .isIn(["admin", "operador", "cliente"]).withMessage("O nível de acesso deve ser admin, operador ou cliente.") // ✅ Correção: "serr" → "ser"
];

// Validação para login de usuários
export const validarLoginUsuario = [
    body("email")
        .isEmail().withMessage("O e-mail deve ser válido."),
    body("senha")
        .notEmpty().withMessage("A senha é obrigatória.")
];

// Validação para atualização do próprio perfil
export const validarAtualizacaoPerfil = [
    body("nome")
        .optional()
        .isString().withMessage("O nome deve ser uma string.") // ✅ Correção: "se" → "ser"
        .isLength({ min: 3, max: 50 }).withMessage("O nome deve ter entre 3 e 50 caracteres."),
    body("email")
        .optional()
        .isEmail().withMessage("O e-mail deve ser válido.")
];

// Validação para atualização administrativa (apenas admin)
export const validarAtualizacaoAdmin = [
    body("nome").optional().isLength({ min: 3 }),
    body("email").optional().isEmail(),
    body("cpf").optional().isLength({ min: 11, max: 11 }),
    body("role").optional().isIn(["admin", "operador", "cliente"])
];

// ❌ Removido: Validação redundante "validarRegistro" (já substituída por "validarRegistroUsuario")
// Motivo: Duplicação de código que causava conflito de imports
