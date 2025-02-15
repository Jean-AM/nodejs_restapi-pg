import { pool } from '../db.js'

export const getReviews = async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT 
                reviews.id, 
                users.username AS user_name, 
                books.title AS book_title, 
                reviews.rating, 
                reviews.comment, 
                reviews.created_at, 
                reviews.updated_at, 
                reviews.status
            FROM reviews
            JOIN users ON reviews.user_id = users.id
            JOIN books ON reviews.book_id = books.id
            WHERE reviews.status = 1
        `);

        res.json(rows);
    } catch (error) {
        console.error("Error al obtener reseñas activas:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const getReviewById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "Se requiere el id de la reseña" });
    }

    try {
        const { rows } = await pool.query(`
            SELECT * FROM reviews 
            WHERE id = $1
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Reseña no encontrada" });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error("Error al obtener reseña por ID:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const getInactiveReviews = async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT * FROM reviews 
            WHERE status = 0
        `);

        res.json(rows);
    } catch (error) {
        console.error("Error al obtener reseñas inactivas:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const createReview = async (req, res) => {
    const { user_id, book_id, rating, comment } = req.body;

    if (!user_id || !book_id || !rating) {
        return res.status(400).json({ error: "Se requieren user_id, book_id y rating" });
    }

    try {
        const { rows } = await pool.query(`
            INSERT INTO reviews (user_id, book_id, rating, comment) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *
        `, [user_id, book_id, rating, comment || null]);

        res.status(201).json(rows[0]);
    } catch (error) {
        console.error("Error al crear reseña:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};


export const updateReview = async (req, res) => {
    const { id, rating, comment } = req.body;

    if (!id || (!rating && !comment)) {
        return res.status(400).json({ error: "Se requiere id y al menos un campo a actualizar" });
    }

    try {
        const { rowCount } = await pool.query(`
            UPDATE reviews 
            SET rating = COALESCE($1, rating), 
                comment = COALESCE($2, comment), 
                updated_at = CURRENT_TIMESTAMP 
            WHERE id = $3 AND status = 1
        `, [rating, comment, id]);

        if (rowCount === 0) {
            return res.status(404).json({ message: "Reseña no encontrada o inactiva" });
        }

        res.json({ message: "Reseña actualizada correctamente" });
    } catch (error) {
        console.error("Error al actualizar reseña:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const deleteReview = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: "Se requiere el id de la reseña" });
    }

    try {
        const { rowCount } = await pool.query(`
            UPDATE reviews 
            SET status = 0, updated_at = CURRENT_TIMESTAMP 
            WHERE id = $1
        `, [id]);

        if (rowCount === 0) {
            return res.status(404).json({ message: "Reseña no encontrada o ya eliminada" });
        }

        res.json({ message: "Reseña eliminada correctamente" });
    } catch (error) {
        console.error("Error al eliminar reseña:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

