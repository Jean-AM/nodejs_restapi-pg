import { pool } from '../db.js'

export const getCategoriesByBook = async (req, res) => {
    const { id } = req.params;

    try {
        const { rows } = await pool.query(`
            SELECT categories.* FROM categories
            JOIN book_categories ON categories.id = book_categories.category_id
            WHERE book_categories.book_id = $1
        `, [id]);

        res.json(rows);
    } catch (error) {
        console.error("Error al obtener categorías:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const addCategoryToBook = async (req, res) => {
    const { book_id, category_id } = req.body;

    if (!book_id || !category_id) {
        return res.status(400).json({ error: "Se requieren book_id y category_id" });
    }

    try {
        await pool.query(
            "INSERT INTO book_categories (book_id, category_id) VALUES ($1, $2)", 
            [book_id, category_id]
        );

        res.status(201).json({ message: "Categoría asignada al libro correctamente" });
    } catch (error) {
        console.error("Error al asignar categoría:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const updateCategoryForBook = async (req, res) => {
    const { book_id, old_category_id, new_category_id } = req.body;

    if (!book_id || !old_category_id || !new_category_id) {
        return res.status(400).json({ error: "Se requieren book_id, old_category_id y new_category_id" });
    }

    try {
        const { rowCount } = await pool.query(
            "UPDATE book_categories SET category_id = $1 WHERE book_id = $2 AND category_id = $3",
            [new_category_id, book_id, old_category_id]
        );

        if (rowCount === 0) {
            return res.status(404).json({ message: "Relación no encontrada o ya actualizada" });
        }

        res.json({ message: "Categoría del libro actualizada correctamente" });
    } catch (error) {
        console.error("Error al actualizar categoría:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const removeCategoryFromBook = async (req, res) => {
    const { book_id, category_id } = req.body;

    if (!book_id || !category_id) {
        return res.status(400).json({ error: "Se requieren book_id y category_id" });
    }

    try {
        const { rowCount } = await pool.query(
            "DELETE FROM book_categories WHERE book_id = $1 AND category_id = $2",
            [book_id, category_id]
        );

        if (rowCount === 0) {
            return res.status(404).json({ message: "Relación no encontrada" });
        }

        res.json({ message: "Categoría eliminada del libro correctamente" });
    } catch (error) {
        console.error("Error al eliminar categoría:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};