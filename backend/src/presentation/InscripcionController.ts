import { Request, Response } from 'express';
import { InscripcionService } from '../business/InscripcionService';

export class InscripcionController {
  private service = new InscripcionService();

  public registrar = async (req: Request, res: Response): Promise<any> => {
    try {
      const { dni, nombre, urlImagenDniMenor } = req.body;

      if (!dni || !nombre || !urlImagenDniMenor) {
        return res.status(400).json({ error: 'Faltan datos obligatorios (dni, nombre, urlImagenDniMenor)' });
      }

      const inscripcion = await this.service.crearInscripcion(dni, nombre, urlImagenDniMenor);
      
      return res.status(201).json({ 
        mensaje: 'Inscripción registrada exitosamente.', 
        inscripcion 
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
