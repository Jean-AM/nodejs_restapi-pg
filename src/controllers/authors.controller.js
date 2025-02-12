import { pool } from '../db.js'

export const getAuthors = async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM authors WHERE status = 1");
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener autores:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const getAuthorById = async (req, res) => {
    const { id } = req.params;

    try {
        const { rows } = await pool.query("SELECT * FROM authors WHERE id = $1", [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: "Autor no encontrado" });
        }
        
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("Error al obtener autor:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const getInactiveAuthors = async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM authors WHERE status = 0");
        
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error al obtener autores inactivos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const createAuthor = async (req, res) => {
    const { name, biography, birth_date, nationality } = req.body;

    if (!name) {
        return res.status(400).json({ error: "El nombre es obligatorio" });
    }

    try {
        const { rows } = await pool.query(
            "INSERT INTO authors (name, biography, birth_date, nationality) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, biography, birth_date, nationality]
        );

        res.status(201).json(rows[0]);
    } catch (error) {
        console.error("Error al crear autor:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const deleteAuthor = async (req, res) => {
    const { id } = req.params;

    try {
        const { rowCount } = await pool.query("UPDATE authors SET status = 0 WHERE id = $1", [id]);

        if (rowCount === 0) {
            return res.status(404).json({ message: "Autor no encontrado" });
        }

        res.status(200).json({ message: "Autor desactivado correctamente" });
    } catch (error) {
        console.error("Error al eliminar autor:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const updateAuthor = async (req, res) => {
    const { id } = req.params;
    const { name, biography, birth_date, nationality } = req.body;

    try {
        const { rowCount } = await pool.query(
            "UPDATE authors SET name = COALESCE($1, name), biography = COALESCE($2, biography), birth_date = COALESCE($3, birth_date), nationality = COALESCE($4, nationality), updated_at = CURRENT_TIMESTAMP WHERE id = $5 AND status = 1",
            [name, biography, birth_date, nationality, id]
        );

        if (rowCount === 0) {
            return res.status(404).json({ message: "Autor no encontrado o inactivo" });
        }

        res.status(200).json({ message: "Autor actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar autor:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};