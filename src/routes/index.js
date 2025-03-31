import express from "express";
import livros from "./livrosRoutes.js";
import autores from "./autoresRoutes.js";
import authRoutes from "./authRoutes.js";

const routes = (app) => {
    app.route("/").get((req, res) => {
        res.status(200).send({ titulo: "Curso de Node.js" });
    });

    app.use(express.json(), livros, autores, authRoutes);
};

export default routes;