const express = require('express');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const { Server } = require("socket.io");

const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Es mejor restringir esto a la URL del frontend en producción
    methods: ["GET", "POST"]
  }
});

// Hacemos 'io' accesible globalmente en la app
app.set('io', io);

io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado vía WebSocket:', socket.id);
  socket.on('disconnect', () => {
    console.log('El cliente se ha desconectado:', socket.id);
  });
});


const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Aumentar límite para las imágenes en base64

app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);

app.get('/api/health', (req, res) => {
    res.json({ message: 'Servidor funcionando correctamente' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
});

httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Para acceder desde otros dispositivos, usa la IP de tu red local.`);
});