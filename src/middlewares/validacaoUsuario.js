import { body } from "express-validator";

export const validarRegistroUsuario = [
    body("nome")
        .isString().withMessage("O nome deve ser um texto.")
        .isLength({ min: 3, max: 50}).withMessage("O nome deve ter entre 3 a 50 caracteres"),
    body("email")
        .isEmail().withMessage("O e-mail deve ser válido."),
    body("senha")
        .isLength({ min: 6}).withMessage("A senha deve ter no mínimo 6 caracteres"),
    body("cpf")
        .isLength({ min: 11, max: 11}).withMessage(" O CPF deve ter exatamente 11 caracteres.")
        .isNumeric().withMessage("O CPF deve conter apenas números."),
    body("role")
        .optional()
        .isIn(["admin", "operador", "cliente"]).withMessage("O nível de acesso deve serr admin, operador ou cliente.")
];

export const validarLoginUsuario = [
    body("email")
        .isEmail().withMessage("O e-mail deve ser válido."),
    body("senha")
        .notEmpty().withMessage("A senha é obrigatória.")
];

export const validarAtualizacaoPerfil = [
    body("nome")
        .optional()
        .isString().withMessage("O nome deve se ruma string.")
        .isLength({ min: 3, max: 50}).withMessage("O nome deve ter entre 3 e 50 caracteres."),
    body("email")
    .optional()
    .isEmail().withMessage("O e-mail deve ser válido.")    
];


const validarRegistro = [
    body("nome")
        .notEmpty().withMessage("O nome é obrigatório."),
    body("email")
        .isEmail().withMessage("O e-mail deve ser válido."),
    body("senha")
        .isLength({ min: 6 }).withMessage("A senha deve ter pelo menos 6 caracteres."),
    body("cpf").notEmpty().withMessage("O CPF é obrigatório."),
];

export default validarRegistro;