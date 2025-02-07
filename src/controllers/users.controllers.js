import { pool } from '../db.js'
import bcrypt from "bcryptjs";

export const getUsers = async (req, res) => {
    const response = await pool.query("SELECT * FROM users WHERE status = 1 ORDER BY id ASC");
    res.status(200).json(response.rows);
}

export const getInactiveUsers = async (req, res) => {
    try {
        const response = await pool.query("SELECT * FROM users WHERE status = 0 ORDER BY id ASC");
        res.status(200).json(response.rows);
    } catch (error) {
        console.error("Error al obtener usuarios inactivos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const getUserById = async (req, res) => {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1 AND status = 1", [id]);

    if (rows.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado o eliminado" });
    }

    res.json(rows[0]);
}

export const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: "El correo ya está registrado" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const { rows } = await pool.query(
            "INSERT INTO users (username, email, password, status) VALUES ($1, $2, $3, 1) RETURNING *",
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: "Usuario creado exitosamente", user: rows[0] });

    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export const deleteUser = async (req, res) => {
    const id = parseInt(req.params.id);
    const { password } = req.body;

    try {
        const { rows: userRows } = await pool.query("SELECT * FROM users WHERE id = $1 AND status = 1", [id]);

        if (userRows.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado o ya eliminado" });
        }

        const user = userRows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Contraseña incorrecta" });
        }

        await pool.query("UPDATE users SET status = 0 WHERE id = $1", [id]);

        return res.json({ message: "Usuario desactivado correctamente" });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export const updateUser = async (req, res) => {
    const id = parseInt(req.params.id);
    const { username, email, password, currentPassword } = req.body;

    try {
        const { rows: userRows } = await pool.query("SELECT * FROM users WHERE id = $1 AND status = 1", [id]);

        if (userRows.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado o eliminado" });
        }

        const user = userRows[0];

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Contraseña actual incorrecta" });
        }

        const updatedUsername = username || user.username;
        const updatedEmail = email || user.email;
        let updatedPassword = user.password;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updatedPassword = await bcrypt.hash(password, salt);
        }

        const { rows } = await pool.query(
            "UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
            [updatedUsername, updatedEmail, updatedPassword, id]
        );

        return res.json({ message: "Usuario actualizado exitosamente", user: rows[0] });
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}
