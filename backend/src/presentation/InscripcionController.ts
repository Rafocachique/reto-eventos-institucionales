import { Request, Response } from 'express';
import { InscripcionService } from '../business/InscripcionService';

export class InscripcionController {
  private service = new InscripcionService();

  public registrar = async (req: Request, res: Response): Promise<any> => {
    try {
      const { dni, nombre } = req.body;
      const file = req.file;

      if (!dni || !nombre || !file) {
        return res.status(400).json({ error: 'Faltan datos obligatorios (dni, nombre, imagen)' });
      }

      // Construir la URL pública apuntando a nuestra carpeta estática servida por Express
      const urlImagenDniMenor = `http://localhost:3000/uploads/${file.filename}`;

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
