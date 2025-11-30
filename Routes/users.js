const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const users = express.Router();
const db = require('../config/database');

users.post("/register", async (req, res, next) => {
    const { username, password } = req.body;

    if (username && password) {
        try {
            // Verifica si el usuario ya existe
            const exists = await db.query("SELECT * FROM users WHERE username = ?", [username]);
            if (exists.length > 0) {
                return res.status(409).json({ code: 409, message: "El usuario ya existe" });
            }

            // Encripta la contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            // Inserta el usuario de forma segura
            const query = "INSERT INTO users (username, password) VALUES (?, ?)";
            const rows = await db.query(query, [username, hashedPassword]);

            if (rows.affectedRows == 1) {
                return res.status(201).json({ code: 201, message: "Usuario registrado correctamente" });
            }
            return res.status(500).json({ code: 500, message: "Ocurrió un error" });
        } catch (err) {
            return res.status(500).json({ code: 500, message: "Error en el servidor" });
        }
    }

    return res.status(400).json({ code: 400, message: "Campos incompletos" });
});

users.post("/login", async(req, res) => {
    const { username, password } = req.body;

    console.log("BODY:", req.body);

    const query = "SELECT * FROM users WHERE username = ?";
    const rows = await db.query(query, [username]);

    console.log("ROWS:", rows);

    if (rows.length === 0) {
        console.log("Usuario NO encontrado en la base");
        return res.status(401).json({ code: 401, message: "Usuario incorrecto" });
    }

    console.log("HASH EN BD:", rows[0].password);
    console.log("PASSWORD ingresado:", password);

    const match = await bcrypt.compare(password, rows[0].password);

    console.log("MATCH RESULT:", match);

    if (match) {
        const token = jwt.sign({
            id: rows[0].id,
            username: rows[0].username
        }, "debugkey");

        return res.status(200).json({ code: 200, message: token });
    }

    return res.status(401).json({ code: 401, message: "Contraseña incorrecta" });
});


users.get("/", async (req, res, next) => {
    const query = "SELECT * FROM users";
    const rows = await db.query(query);

    return res.status(200).json({code: 200, message: rows})
});

module.exports = users;