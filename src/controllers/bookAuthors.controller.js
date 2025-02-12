import { pool } from '../db.js'

export const getBooksByAuthor = async (req, res) => {
    const { id } = req.params;
    console.log("Author ID recibido:", id);

    try {
        const { rows } = await pool.query(`
            SELECT books.* FROM books
            JOIN book_authors ON books.id = book_authors.book_id
            WHERE book_authors.author_id = $1
        `, [id]);

        res.json(rows);
    } catch (error) {
        console.error("Error al obtener libros del autor:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const addAuthorToBook = async (req, res) => {
    const { book_id, author_id } = req.body;

    if (!book_id || !author_id) {
        return res.status(400).json({ error: "Se requiere book_id y author_id" });
    }

    try {
        await pool.query("INSERT INTO book_authors (book_id, author_id) VALUES ($1, $2)", [book_id, author_id]);
        res.status(201).json({ message: "Autor asignado al libro correctamente" });
    } catch (error) {
        console.error("Error al asignar autor:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const updateAuthorInBook = async (req, res) => {
    const { book_id, author_id, new_author_id } = req.body;

    if (!book_id || !author_id || !new_author_id) {
        return res.status(400).json({ error: "Se requieren book_id, author_id y new_author_id" });
    }

    try {
        const { rowCount: existingRelation } = await pool.query(
            "SELECT * FROM book_authors WHERE book_id = $1 AND author_id = $2",
            [book_id, author_id]
        );

        if (existingRelation === 0) {
            return res.status(404).json({ message: "Relación original no encontrada" });
        }

        const { rowCount } = await pool.query(
            "UPDATE book_authors SET author_id = $1 WHERE book_id = $2 AND author_id = $3",
            [new_author_id, book_id, author_id]
        );

        if (rowCount === 0) {
            return res.status(400).json({ message: "No se pudo actualizar la relación" });
        }

        res.json({ message: "Autor actualizado en el libro correctamente" });
    } catch (error) {
        console.error("Error al actualizar autor en el libro:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const removeAuthorFromBook = async (req, res) => {
    const { book_id, author_id } = req.body;

    if (!book_id || !author_id) {
        return res.status(400).json({ error: "Se requiere book_id y author_id" });
    }

    try {
        const { rowCount } = await pool.query(
            "DELETE FROM book_authors WHERE book_id = $1 AND author_id = $2",
            [book_id, author_id]
        );

        if (rowCount === 0) {
            return res.status(404).json({ message: "Relación no encontrada" });
        }

        res.json({ message: "Autor eliminado del libro correctamente" });
    } catch (error) {
        console.error("Error al eliminar autor:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};




