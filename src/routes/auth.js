
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connection = require('../db'); // Ya no necesitas el modelo Usuario

const router = express.Router();

// Registro de usuario
router.post('/register', (req, res) => {
    const { nombre, email, password, rol } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    connection.query(
        'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
        [nombre, email, hashedPassword, rol || 'cliente'],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Usuario registrado' });
        }
    );
});

// Login de usuario
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    connection.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });

        const user = results[0];

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '2h' });

        res.json({ token, user: { id: user.id, nombre: user.nombre, rol: user.rol } });
    });
});

module.exports = router;
