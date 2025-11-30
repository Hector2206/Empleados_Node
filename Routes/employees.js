const express = require('express');
const employees = express.Router();
const db = require('../config/database');

// Middleware para deshabilitar caché
employees.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

// Crear empleado con nuevos campos
employees.post("/", async (req, res, next) => {
    const {
        nombre, apellidos, telefono, correo, direccion,
        fecha_nacimiento, curp, rfc, horario, sueldo, puesto, antiguedad
    } = req.body;

    if (nombre && apellidos && telefono && correo && direccion &&
        fecha_nacimiento && curp && rfc && horario && sueldo && puesto && antiguedad) {
        let query = `
            INSERT INTO employees
            (nombre, apellidos, telefono, correo, direccion, fecha_nacimiento, curp, rfc, horario, sueldo, puesto, antiguedad)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const rows = await db.query(query, [
            nombre, apellidos, telefono, correo, direccion,
            fecha_nacimiento, curp, rfc, horario, sueldo, puesto, antiguedad
        ]);
        if (rows.affectedRows == 1) {
            return res.status(201).json({ code: 201, message: "Empleado agregado correctamente" });
        }
        return res.status(500).json({ code: 500, message: "Error al agregar empleado" });
    }
    return res.status(500).json({ code: 500, message: "Campos Incompletos" });
});

// Eliminar empleado (sin cambios)
employees.delete("/:id([0-9]{1,3})", async (req, res, next) => {
    const query = `DELETE FROM employees WHERE id=${req.params.id}`;
    const rows = await db.query(query)
    if (rows.affectedRows == 1) {
        return res.status(200).json({ code: 200, message: "Empleado eliminado correctamente" });
    }
    return res.status(404).json({ code: 404, message: "Empleado no encontrado" });
});

// Actualizar empleado con nuevos campos
employees.put("/:id([0-9]{1,3})", async (req, res, next) => {
    const {
        nombre, apellidos, telefono, correo, direccion,
        fecha_nacimiento, curp, rfc, horario, sueldo, puesto, antiguedad
    } = req.body;

    if (nombre && apellidos && telefono && correo && direccion &&
        fecha_nacimiento && curp && rfc && horario && sueldo && puesto && antiguedad) {
        let query = `
            UPDATE employees SET
            nombre=?, apellidos=?, telefono=?, correo=?, direccion=?,
            fecha_nacimiento=?, curp=?, rfc=?, horario=?, sueldo=?, puesto=?, antiguedad=?
            WHERE id=?
        `;
        const rows = await db.query(query, [
            nombre, apellidos, telefono, correo, direccion,
            fecha_nacimiento, curp, rfc, horario, sueldo, puesto, antiguedad, req.params.id
        ]);
        if (rows.affectedRows == 1) {
            return res.status(200).json({ code: 200, message: "Empleado actualizado correctamente" });
        }
        return res.status(404).json({ code: 404, message: "Empleado no encontrado" });
    }
    return res.status(500).json({ code: 500, message: "Campos Incompletos" });
});

// PATCH (actualización parcial, ejemplo solo nombre)
employees.patch("/:id([0-9]{1,3})", async (req, res, next) => {
    if (req.body.nombre) {
        let query = `UPDATE employees SET nombre=? WHERE id=?`;
        const rows = await db.query(query, [req.body.nombre, req.params.id]);
        if (rows.affectedRows == 1) {
            return res.status(200).json({ code: 200, message: "Nombre actualizado correctamente" });
        }
        return res.status(404).json({ code: 404, message: "Empleado no encontrado" });
    }
    return res.status(500).json({ code: 500, message: "Campos incompletos" });
});

// Obtener todos los empleados
employees.get('/search', async (req, res, next) => {
    const { id, nombre, puesto } = req.query;
    let query = "SELECT * FROM employees WHERE 1=1";
    let params = [];

    if (id) {
        query += " AND id = ?";
        params.push(id);
    }
    if (nombre) {
        query += " AND nombre LIKE ?";
        params.push('%' + nombre + '%');
    }
    if (puesto) {
        query += " AND puesto = ?";
        params.push(puesto);
    }

    try {
        const rows = await db.query(query, params);
        res.json({ code: 200, message: rows });
    } catch (err) {
        res.status(500).json({ code: 500, message: "Error en la búsqueda", error: err });
    }
});

employees.get('/', async (req, res, next) => {
    try {
        const rows = await db.query("SELECT * FROM employees");
        res.json({ code: 200, message: rows });
    } catch (err) {
        res.status(500).json({ code: 500, message: "Error al obtener empleados", error: err });
    }
});

// Obtener empleado por ID
employees.get('/:id([0-9]{1,3})', async (req, res, next) => {
    const id = req.params.id;
    if (id >= 0 && id <= 722) {
        const rows = await db.query("SELECT * FROM employees WHERE id = ?", [id]);
        if (rows.length > 0) {
            return res.status(200).json({ code: 200, message: rows[0] });
        }
        return res.status(404).json({ code: 404, message: "Empleado no encontrado" });
    } else {
        return res.status(400).json({ code: 400, message: "ID fuera de rango" });
    }
});

// Obtener empleados por nombre exacto
employees.get('/nombre/:name', async (req, res, next) => {
    const nombre = req.params.name;
    const rows = await db.query("SELECT * FROM employees WHERE nombre = ?", [nombre]);
    if (rows.length > 0) {
        return res.status(200).json({ code: 200, message: rows });
    }
    return res.status(404).json({ code: 404, message: "Empleado no encontrado" });
});

// Obtener todos los empleados (sin filtros)


module.exports = employees;
