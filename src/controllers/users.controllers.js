import { pool } from '../db.js'
import bcrypt from "bcryptjs";

export const getUsers = async (req, res) => {
    const response = await pool.query("SELECT * FROM users ORDER BY id ASC");
    res.status(200).json(response.rows);
}

export const getUserById = async (req, res) => {
    const {id} = req.params
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id])
    
    if (rows.length === 0) {
        return res.status(404).json({ message: "User not found"})
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
          "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
            [username, email, hashedPassword]
        );
    
        res.status(201).json({message: "Usuario creado exitosamente", user: rows[0]});

    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export const deleteUser = async (req, res) => {
    const id = parseInt(req.params.id);
    const { rowCount } = await pool.query("DELETE FROM users where id = $1", [id,]);

    if (rowCount === 0) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.sendStatus(204);
}

export const updateUser = async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, email } = req.body;
    const { rows } = await pool.query(
        "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
        [name, email, id]
    );

    return res.json(rows[0]);
}
