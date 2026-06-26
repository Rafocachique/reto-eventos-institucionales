import { ColegiadoRepository } from '../data/ColegiadoRepository';
import { prisma } from '../data/prismaClient';

export class InscripcionService {
  private colegiadoRepo = new ColegiadoRepository();

  /**
   * Valida si un colegiado cumple las reglas para inscribirse
   */
  async validarElegibilidad(dni: string) {
    const colegiado = await this.colegiadoRepo.getColegiadoByDni(dni);

    if (!colegiado) {
      return { esElegible: false, motivo: 'DNI no encontrado en el padrón.' };
    }

    if (colegiado.habilitado !== true) {
      return { esElegible: false, motivo: 'El colegiado no se encuentra Habilitado.' };
    }

    if (colegiado.consejo_departamental !== 'Lima') {
      return { esElegible: false, motivo: 'El evento es exclusivo para la sede Lima.' };
    }

    if (colegiado.es_administrativo) {
      return { esElegible: false, motivo: 'El personal administrativo no puede participar.' };
    }

    return { esElegible: true, colegiado };
  }

  /**
   * Registra una nueva inscripción si cumple todas las reglas
   */
  async crearInscripcion(dni: string, nombre: string, urlImagenDniMenor: string) {
    const validacion = await this.validarElegibilidad(dni);
    
    if (!validacion.esElegible) {
      throw new Error(validacion.motivo); // Rechazado por reglas de negocio
    }

    // Guardar en la base de datos a través de Prisma
    const nuevaInscripcion = await prisma.inscripcion.create({
      data: {
        dniColegiado: dni,
        nombre: nombre,
        urlImagenDniMenor: urlImagenDniMenor
        // estado: 'PENDIENTE' es automático por el default del schema
      }
    });

    return nuevaInscripcion;
  }
}
