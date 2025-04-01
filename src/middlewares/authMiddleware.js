import jwt from "jsonwebtoken";

// Middleware para autenticar o token JWT
export const autenticarToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ message: "Acesso negado. Token não fornecido." });
    }

    try {
        const tokenSemBearer = token.startsWith("Bearer ") ? token.slice(7) : token;
        const decoded = jwt.verify(tokenSemBearer, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: "Token inválido ou expirado." });
    }
};

// Middleware para verificar se o usuário é admin
export const verificarAdmin = (req, res, next) => {
    if (!req.usuario || req.usuario.role !== "admin") {
        return res.status(403).json({ message: "Acesso negado. Apenas administradores podem realizar esta ação." });
    }
    next();
};