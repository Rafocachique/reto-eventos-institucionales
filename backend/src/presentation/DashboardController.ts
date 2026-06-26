import { Request, Response } from 'express';
import { DashboardService } from '../business/DashboardService';

export class DashboardController {
  private service = new DashboardService();

  public listar = async (req: Request, res: Response): Promise<any> => {
    try {
      const inscripciones = await this.service.obtenerInscripciones();
      return res.json(inscripciones);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public metricas = async (req: Request, res: Response): Promise<any> => {
    try {
      const metricas = await this.service.obtenerMetricas();
      return res.json(metricas);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public aprobar = async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const inscripcion = await this.service.aprobarInscripcion(id);
      return res.json({ mensaje: 'Inscripción aprobada exitosamente y cupo descontado.', inscripcion });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  public rechazar = async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const { motivo } = req.body;
      const inscripcion = await this.service.rechazarInscripcion(id, motivo);
      return res.json({ mensaje: 'Inscripción rechazada.', inscripcion });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
