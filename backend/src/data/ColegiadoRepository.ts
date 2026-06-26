import axios from 'axios';

export interface ColegiadoMock {
  dni: string;
  nombre: string;
  apellido: string;
  estado: string; // "Habilitado" o "Inhabilitado"
  sede: string;
  esAdministrativo: boolean;
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
      const response = await axios.get<ColegiadoMock[]>(`${this.apiUrl}?dni=${dni}`);
      
      // json-server devuelve un array cuando filtramos por query param
      if (response.data && response.data.length > 0) {
        return response.data[0];
      }
      return null;
    } catch (error) {
      console.error(`[ColegiadoRepository] Error consultando DNI ${dni}:`, error);
      return null;
    }
  }
}
