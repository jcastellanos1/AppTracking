const express = require('express');
const jwt = require('jsonwebtoken');
const connection = require('../db');

const router = express.Router();

// Middleware para verificar JWT
const verificarToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: 'No token provided' });

    jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Token inválido' });
        req.user = decoded;
        next();
    });
};

// Cliente crea un pedido
router.post('/', verificarToken, (req, res) => {
    if (req.user.rol !== 'cliente') return res.status(403).json({ error: 'Solo los clientes pueden hacer pedidos' });

    const { comida, cantidad } = req.body;
    connection.query(
        'INSERT INTO pedidos (usuario_id, comida, cantidad) VALUES (?, ?, ?)',
        [req.user.id, comida, cantidad],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Pedido registrado' });
        }
    );
});

// Administrador cambia estado de un pedido
router.put('/:id', verificarToken, (req, res) => {
    if (req.user.rol !== 'admin') return res.status(403).json({ error: 'Solo los administradores pueden actualizar pedidos' });

    const { estado } = req.body;
    connection.query(
        'UPDATE pedidos SET estado = ? WHERE id = ?',
        [estado, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Estado del pedido actualizado' });
        }
    );
});

// Obtener pedidos de un cliente o todos (si es admin)
router.get('/', verificarToken, (req, res) => {
    const query = req.user.rol === 'admin' ? 'SELECT * FROM pedidos' : 'SELECT * FROM pedidos WHERE usuario_id = ?';
    const params = req.user.rol === 'admin' ? [] : [req.user.id];

    connection.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

module.exports = router;
