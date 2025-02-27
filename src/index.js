const express = require('express');
const cors = require('cors');
const path = require('path'); // Asegúrate de importar path
const authRoutes = require('./routes/auth');
const pedidosRoutes = require('./routes/pedidos');

const app = express();
app.use(cors());
app.use(express.json());

// Sirve archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/pedidos', pedidosRoutes);

// Ruta para cargar la página principal (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
