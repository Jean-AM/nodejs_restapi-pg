import { pool } from '../db.js'

const isValidISBN = (isbn) => /^\d{13}$/.test(isbn);

export const getBooks = async (req, res) => {
    const response = await pool.query("SELECT * FROM books WHERE status = 1 ORDER BY id ASC");
    res.status(200).json(response.rows);
}

export const getInactiveBooks = async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM books WHERE status = 0");

        if (rows.length === 0) {
            return res.status(404).json({ message: "No se encontraron libros con status 0" });
        }

        return res.json(rows);
    } catch (error) {
        console.error("Error al obtener libros con status 0:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const getBookByIsbn = async (req, res) => {
    const { isbn } = req.params;

    try {
        const { rows } = await pool.query("SELECT * FROM books WHERE isbn = $1", [isbn]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Libro no encontrado" });
        }

        return res.json(rows[0]);
    } catch (error) {
        console.error("Error al obtener libro por ISBN:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const createBook = async (req, res) => {
    try {
        const { title, description, publication_year, isbn, pages, cover_image_url } = req.body;

        if (!title || !isbn) {
            return res.status(400).json({ error: "Título e ISBN son obligatorios" });
        }

        if (!isValidISBN(isbn)) {
            return res.status(400).json({ error: "El ISBN debe tener 13 dígitos" });
        }

        if (cover_image_url && !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(cover_image_url)) {
            return res.status(400).json({ error: "URL de imagen no válida" });
        }

        const { rows } = await pool.query(
            `INSERT INTO books (title, description, publication_year, isbn, pages, cover_image_url, status) 
             VALUES ($1, $2, $3, $4, $5, $6, 1) RETURNING *`,
            [title, description || null, publication_year || null, isbn, pages || null, cover_image_url || null]
        );

        res.status(201).json({ message: "Libro creado exitosamente", book: rows[0] });

    } catch (error) {
        console.error("Error al crear libro:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const deleteBook = async (req, res) => {
    const { id } = req.params;

    try {
        const { rows: bookRows } = await pool.query("SELECT * FROM books WHERE id = $1", [id]);

        if (bookRows.length === 0) {
            return res.status(404).json({ message: "Libro no encontrado" });
        }

        // Cambiar el estado del libro a 0 (inactivo)
        const { rowCount } = await pool.query("UPDATE books SET status = 0 WHERE id = $1", [id]);

        if (rowCount === 0) {
            return res.status(400).json({ message: "No se pudo desactivar el libro" });
        }

        return res.status(200).json({ message: "Libro desactivado correctamente" });
    } catch (error) {
        console.error("Error al desactivar libro:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const updateBook = async (req, res) => {
    const id = parseInt(req.params.id);  // Obtener el id desde los parámetros de la URL
    const { title, description, publication_year, pages, cover_image_url, isbn } = req.body;

    try {
        const { rows: bookRows } = await pool.query("SELECT * FROM books WHERE id = $1", [id]);

        if (bookRows.length === 0) {
            return res.status(404).json({ message: "Libro no encontrado" });
        }

        // Actualizar los campos proporcionados, manteniendo los antiguos si no se envían nuevos datos
        const updatedTitle = title || bookRows[0].title;
        const updatedDescription = description || bookRows[0].description;
        const updatedPublicationYear = publication_year || bookRows[0].publication_year;
        const updatedPages = pages || bookRows[0].pages;
        const updatedCoverImageUrl = cover_image_url || bookRows[0].cover_image_url;
        const updatedIsbn = isbn || bookRows[0].isbn; // Permite cambiar el isbn si se pasa uno nuevo

        const { rows } = await pool.query(
            "UPDATE books SET title = $1, description = $2, publication_year = $3, pages = $4, cover_image_url = $5, isbn = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *",
            [updatedTitle, updatedDescription, updatedPublicationYear, updatedPages, updatedCoverImageUrl, updatedIsbn, id]
        );

        return res.json({ message: "Libro actualizado exitosamente", book: rows[0] });
    } catch (error) {
        console.error("Error al actualizar libro:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};




