const express = require('express');
const cors = require('cors');

const pool = require('./src/config/database');

const productoRoutes = require('./src/routes/productoRoutes');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/api/productos', productoRoutes);

app.get('/', (req, res) => {
    res.json({
        mensaje: 'Bienvenido a WarrantyHub'
    });
});

app.get('/api/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');

        res.json({
            mensaje: 'Conexión con PostgreSQL exitosa',
            fecha: result.rows[0].now
        });

    } catch (error) {
        console.error('Error de conexión:', error);

        res.status(500).json({
            mensaje: 'Error al conectar con PostgreSQL'
        });
    }
});

app.listen(PORT, () => {
    console.log(`WarrantyHub está funcionando en http://localhost:${PORT}`);
});