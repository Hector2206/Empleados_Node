const express = require('express');
const nominas = express.Router();
const db = require('../config/database');

// Calcular bono según porcentaje de asistencia
function calcularBono(salario, porcentaje) {
    if (porcentaje >= 99) return salario * 0.04;
    if (porcentaje >= 95) return salario * 0.02;
    return 0;
}

// Generar nómina para un empleado en un mes
nominas.post('/generar/:empleado_id', async (req, res) => {
    const { empleado_id } = req.params;
    const { mes, anio } = req.query;

    try {
        // Total de días del mes
        const totalDias = await db.query(
            "SELECT COUNT(*) as total FROM asistencias WHERE empleado_id = ? AND MONTH(fecha) = ? AND YEAR(fecha) = ?",
            [empleado_id, mes, anio]
        );
        const diasAsistidos = await db.query(
            "SELECT COUNT(*) as asistidos FROM asistencias WHERE empleado_id = ? AND MONTH(fecha) = ? AND YEAR(fecha) = ? AND presente = 1",
            [empleado_id, mes, anio]
        );
        const empleado = await db.query("SELECT sueldo FROM employees WHERE id = ?", [empleado_id]);
        if (!empleado.length) return res.status(404).json({ code: 404, message: "Empleado no encontrado" });

        const total = totalDias[0].total;
        const asistidos = diasAsistidos[0].asistidos;
        const porcentaje = total > 0 ? (asistidos / total) * 100 : 0;
        const bono = calcularBono(empleado[0].sueldo, porcentaje);
        const totalPagar = empleado[0].sueldo + bono;

        // Guarda la nómina
        await db.query(
            "INSERT INTO nominas (empleado_id, fecha, salario_base, bono, total) VALUES (?, ?, ?, ?, ?)",
            [empleado_id, `${anio}-${mes}-01`, empleado[0].sueldo, bono, totalPagar]
        );

        return res.status(201).json({
            code: 201,
            message: "Nómina generada",
            data: { salario_base: empleado[0].sueldo, bono, total: totalPagar, porcentaje }
        });
    } catch (err) {
        return res.status(500).json({ code: 500, message: "Error al generar nómina" });
    }
});

// Obtener todas las nóminas de un empleado
nominas.get('/empleado/:empleado_id', async (req, res) => {
    const { empleado_id } = req.params;
    try {
        const rows = await db.query(
            "SELECT * FROM nominas WHERE empleado_id = ? ORDER BY fecha DESC",
            [empleado_id]
        );
        return res.status(200).json({ code: 200, message: rows });
    } catch (err) {
        return res.status(500).json({ code: 500, message: "Error al obtener nóminas" });
    }
});

// Obtener la nómina de un empleado para un mes y año específico
nominas.get('/empleado/:empleado_id/mes', async (req, res) => {
    const { empleado_id } = req.params;
    const { mes, anio } = req.query;
    try {
        const rows = await db.query(
            "SELECT * FROM nominas WHERE empleado_id = ? AND MONTH(fecha) = ? AND YEAR(fecha) = ?",
            [empleado_id, mes, anio]
        );
        return res.status(200).json({ code: 200, message: rows });
    } catch (err) {
        return res.status(500).json({ code: 500, message: "Error al obtener nómina del mes" });
    }
});

// Obtener historial de bonos de un empleado
nominas.get('/empleado/:empleado_id/bonos', async (req, res) => {
    const { empleado_id } = req.params;
    try {
        const rows = await db.query(
            "SELECT fecha, bono FROM nominas WHERE empleado_id = ? AND bono > 0 ORDER BY fecha DESC",
            [empleado_id]
        );
        return res.status(200).json({ code: 200, message: rows });
    } catch (err) {
        return res.status(500).json({ code: 500, message: "Error al obtener bonos" });
    }
});

// Pagar nómina a todos los empleados para el mes y año actual
nominas.post('/pagar-todos', async (req, res) => {
    const hoy = new Date();
    const mes = hoy.getMonth() + 1;
    const anio = hoy.getFullYear();

    try {
        const empleados = await db.query("SELECT id, sueldo FROM employees");
        for (const emp of empleados) {
            // Calcula asistencias
            const totalDias = await db.query(
                "SELECT COUNT(*) as total FROM asistencias WHERE empleado_id = ? AND MONTH(fecha) = ? AND YEAR(fecha) = ?",
                [emp.id, mes, anio]
            );
            const diasAsistidos = await db.query(
                "SELECT COUNT(*) as asistidos FROM asistencias WHERE empleado_id = ? AND MONTH(fecha) = ? AND YEAR(fecha) = ? AND presente = 1",
                [emp.id, mes, anio]
            );
            const total = totalDias[0].total;
            const asistidos = diasAsistidos[0].asistidos;
            const porcentaje = total > 0 ? (asistidos / total) * 100 : 0;
            let bono = 0;
            if (porcentaje >= 99) bono = emp.sueldo * 0.04;
            else if (porcentaje >= 95) bono = emp.sueldo * 0.02;
            const totalPagar = emp.sueldo + bono;

            // Evita duplicados para el mismo mes
            const existe = await db.query(
                "SELECT * FROM nominas WHERE empleado_id = ? AND MONTH(fecha) = ? AND YEAR(fecha) = ?",
                [emp.id, mes, anio]
            );
            if (existe.length === 0) {
                await db.query(
                    "INSERT INTO nominas (empleado_id, fecha, salario_base, bono, total) VALUES (?, ?, ?, ?, ?)",
                    [emp.id, `${anio}-${mes}-01`, emp.sueldo, bono, totalPagar]
                );
            }
        }
        return res.status(201).json({ code: 201, message: "Nómina pagada a todos los empleados" });
    } catch (err) {
        return res.status(500).json({ code: 500, message: "Error al pagar nómina a todos" });
    }
});

module.exports = nominas;