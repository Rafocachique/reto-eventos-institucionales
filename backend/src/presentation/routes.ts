import { Router } from 'express';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // Ruta de prueba de salud del servidor (Healthcheck)
    router.get('/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        message: 'El servidor estructurado en capas está funcionando perfectamente.' 
      });
    });

    // Aquí agregaremos luego las rutas de inscripciones y dashboard

    return router;
  }
}
