import jwt from "jsonwebtoken";

export const autenticarToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ message: "Acesso. Token não fornecido"});
    }

    try {
        const tokenSemBearer = token.startsWith("Bearer ") ? token.slice(7,token.length) : token;

        const decoded = jwt.verify(tokenSemBearer, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: "Token inválido ou expirado."});
    }
};