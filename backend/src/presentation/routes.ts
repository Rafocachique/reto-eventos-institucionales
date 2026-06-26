import { Router } from 'express';
import { InscripcionController } from './InscripcionController';
import { DashboardController } from './DashboardController';

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

    // Rutas de Inscripciones
    router.post('/inscripciones', inscripcionController.registrar);

    // Rutas del Administrador (Dashboard)
    router.get('/dashboard/inscripciones', dashboardController.listar);
    router.get('/dashboard/metricas', dashboardController.metricas);
    router.post('/dashboard/inscripciones/:id/aprobar', dashboardController.aprobar);
    router.post('/dashboard/inscripciones/:id/rechazar', dashboardController.rechazar);

    return router;
  }
}
