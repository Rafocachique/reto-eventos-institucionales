import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const apiService = {
  /**
   * Inscripciones (Portal de Usuario)
   */
  crearInscripcion: (data: FormData) => 
    axios.post(`${API_URL}/inscripciones`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    
  /**
   * Dashboard (Administrador)
   */
  obtenerMetricas: () => axios.get(`${API_URL}/dashboard/metricas`),
  obtenerInscripciones: () => axios.get(`${API_URL}/dashboard/inscripciones`),
  aprobarInscripcion: (id: string) => axios.post(`${API_URL}/dashboard/inscripciones/${id}/aprobar`),
  rechazarInscripcion: (id: string, motivo: string) => axios.post(`${API_URL}/dashboard/inscripciones/${id}/rechazar`, { motivo })
};
