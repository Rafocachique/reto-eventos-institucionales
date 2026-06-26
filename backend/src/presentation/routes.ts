import { Router } from 'express';
import { InscripcionController } from './InscripcionController';
import { DashboardController } from './DashboardController';
import multer from 'multer';
import path from 'path';

// Configuración de almacenamiento físico (Multer)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});
const upload = multer({ storage });

export class AppRoutes {
  static get routes(): Router {
    const router = Router();
    const inscripcionController = new InscripcionController();
    const dashboardController = new DashboardController();

    // Ruta de prueba de salud del servidor (Healthcheck)
    router.get('/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        message: 'El servidor estructurado en capas está funcionando perfectamente.' 
      });
    });

    // Rutas de Inscripciones (con middleware de subida de imagen)
    router.post('/inscripciones', upload.single('imagen'), inscripcionController.registrar);

    // Rutas del Administrador (Dashboard)
    router.get('/dashboard/inscripciones', dashboardController.listar);
    router.get('/dashboard/metricas', dashboardController.metricas);
    router.post('/dashboard/inscripciones/:id/aprobar', dashboardController.aprobar);
    router.post('/dashboard/inscripciones/:id/rechazar', dashboardController.rechazar);

    return router;
  }
}
