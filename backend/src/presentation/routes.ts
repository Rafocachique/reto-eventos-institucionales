import { Router } from 'express';
import { InscripcionController } from './InscripcionController';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new InscripcionController();

    // Ruta de prueba de salud del servidor (Healthcheck)
    router.get('/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        message: 'El servidor estructurado en capas está funcionando perfectamente.' 
      });
    });

    // Rutas de Inscripciones
    router.post('/inscripciones', controller.registrar);

    return router;
  }
}
