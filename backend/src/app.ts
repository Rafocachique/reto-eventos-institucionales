import express from 'express';
import path from 'path';
import cors from 'cors';
import { AppRoutes } from './presentation/routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json()); // Para parsear el body en formato JSON
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads'))); // Servir imágenes estáticas

// Definición de las Rutas Principales
app.use('/api', AppRoutes.routes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
