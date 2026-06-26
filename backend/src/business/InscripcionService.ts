import { ColegiadoRepository } from '../data/ColegiadoRepository';

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

    if (colegiado.estado !== 'Habilitado') {
      return { esElegible: false, motivo: 'El colegiado no se encuentra Habilitado.' };
    }

    if (colegiado.sede !== 'Lima') {
      return { esElegible: false, motivo: 'El evento es exclusivo para la sede Lima.' };
    }

    if (colegiado.esAdministrativo) {
      return { esElegible: false, motivo: 'El personal administrativo no puede participar.' };
    }

    return { esElegible: true, colegiado };
  }
}
