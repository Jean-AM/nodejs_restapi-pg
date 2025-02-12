import { pool } from '../db.js'

export const getCategories = async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM categories WHERE status = 1 ORDER BY id ASC");
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener categorías:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const getCategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        const { rows } = await pool.query("SELECT * FROM categories WHERE id = $1 AND status = 1", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Categoría no encontrada o inactiva" });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error("Error al obtener categoría por ID:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const getInactiveCategories = async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM categories WHERE status = 0 ORDER BY id ASC");
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener categorías inactivas:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const createCategories = async (req, res) => {
    const categories = req.body;

    if (!Array.isArray(categories) || categories.length === 0) {
        return res.status(400).json({ error: "Debe enviar un array con al menos una categoría" });
    }

    for (const category of categories) {
        if (!category.name || typeof category.name !== "string") {
            return res.status(400).json({ error: "El nombre de la categoría es obligatorio y debe ser una cadena de texto" });
        }
    }

    try {
        const values = categories.map(cat => `('${cat.name}')`).join(", ");
        const query = `INSERT INTO categories (name) VALUES ${values} RETURNING *`;

        const { rows } = await pool.query(query);
        res.status(201).json({ message: "Categorías creadas correctamente", categories: rows });
    } catch (error) {
        console.error("Error al crear categorías:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const { rowCount } = await pool.query(
            "UPDATE categories SET name = COALESCE($1, name), updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND status = 1",
            [name, id]
        );

        if (rowCount === 0) {
            return res.status(404).json({ message: "Categoría no encontrada o inactiva" });
        }

        res.status(200).json({ message: "Categoría actualizada correctamente" });
    } catch (error) {
        console.error("Error al actualizar categoría:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const { rowCount } = await pool.query("UPDATE categories SET status = 0 WHERE id = $1", [id]);

        if (rowCount === 0) {
            return res.status(404).json({ message: "Categoría no encontrada o ya eliminada" });
        }

        res.status(200).json({ message: "Categoría desactivada correctamente" });
    } catch (error) {
        console.error("Error al eliminar categoría:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

