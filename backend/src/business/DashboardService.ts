import { prisma } from '../data/prismaClient';

export class DashboardService {
  /**
   * Obtiene la lista completa de inscripciones ordenadas por la más reciente
   */
  async obtenerInscripciones() {
    return prisma.inscripcion.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Obtiene los contadores para armar las gráficas del administrador
   */
  async obtenerMetricas() {
    const total = await prisma.inscripcion.count();
    const pendientes = await prisma.inscripcion.count({ where: { estado: 'PENDIENTE' } });
    const aprobados = await prisma.inscripcion.count({ where: { estado: 'APROBADO' } });
    const rechazados = await prisma.inscripcion.count({ where: { estado: 'RECHAZADO' } });

    return {
      total,
      pendientes,
      aprobados,
      rechazados,
      aforoMaximo: 50,
      cuposDisponibles: 50 - aprobados
    };
  }

  /**
   * Aprueba una inscripción asegurando estrictamente que no se supere el aforo máximo de 50.
   * Utiliza una Transacción de Prisma (Serializable) para evitar "Race Conditions".
   */
  async aprobarInscripcion(id: string) {
    return prisma.$transaction(async (tx) => {
      // 1. Contar cuántos están aprobados actualmente
      const aprobados = await tx.inscripcion.count({ where: { estado: 'APROBADO' } });
      
      if (aprobados >= 50) {
        throw new Error('El aforo máximo (50) ha sido alcanzado. No se pueden aprobar más inscripciones.');
      }

      // 2. Buscar la inscripción
      const inscripcion = await tx.inscripcion.findUnique({ where: { id } });
      if (!inscripcion) throw new Error('Inscripción no encontrada.');
      if (inscripcion.estado === 'APROBADO') throw new Error('La inscripción ya fue aprobada.');

      // 3. Aprobar si hay cupo
      return tx.inscripcion.update({
        where: { id },
        data: { estado: 'APROBADO' }
      });
    }, {
      isolationLevel: 'Serializable' // Garantía 100% contra concurrencia extrema
    });
  }

  /**
   * Rechaza una inscripción exigiendo un motivo.
   */
  async rechazarInscripcion(id: string, motivo: string) {
    if (!motivo || motivo.trim() === '') {
      throw new Error('Debe proporcionar un motivo de rechazo (ej. "DNI ilegible").');
    }

    return prisma.inscripcion.update({
      where: { id },
      data: { 
        estado: 'RECHAZADO', 
        observacionRechazo: motivo 
      }
    });
  }
}
