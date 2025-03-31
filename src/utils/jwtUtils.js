import jwt from "jsonwebtoken";

export const gerarToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPRESS_IN || "1h" }
    );
};