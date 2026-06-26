import axios from 'axios';

export interface ColegiadoMock {
  dni: string;
  nombre: string;
  habilitado: boolean;
  es_administrativo: boolean;
  consejo_departamental: string;
}

export class ColegiadoRepository {
  // Apuntamos al puerto 3004 que es donde correremos json-server luego
  private readonly apiUrl = 'http://localhost:3004/colegiados';

  /**
   * Consulta el mock API externo para obtener los datos del colegiado
   * @param dni DNI del colegiado a buscar
   * @returns Los datos del colegiado o null si no se encuentra/hay error
   */
  async getColegiadoByDni(dni: string): Promise<ColegiadoMock | null> {
    try {
      // Descargamos todo el padrón y lo filtramos en código para evitar problemas de versiones de json-server
      const response = await axios.get<ColegiadoMock[]>(`${this.apiUrl}`);
      const colegiados = response.data;
      const colegiado = colegiados.find(c => c.dni === dni);
      
      return colegiado || null;
    } catch (error) {
      console.error(`[ColegiadoRepository] Error consultando DNI ${dni}:`, error);
      return null;
    }
  }
}
