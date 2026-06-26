import React, { useEffect, useState } from 'react';
import { LayoutDashboard, CheckCircle, XCircle, Clock, Users, ShieldAlert } from 'lucide-react';
import { apiService } from '../../services/api';

export default function AdminDashboard() {
  const [metricas, setMetricas] = useState<any>(null);
  const [inscripciones, setInscripciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para el modal de rechazo personalizado
  const [modalRechazo, setModalRechazo] = useState({
    isOpen: false,
    inscripcionId: '',
    motivo: ''
  });

  const cargarDatos = async () => {
    try {
      const [resMetricas, resInscripciones] = await Promise.all([
        apiService.obtenerMetricas(),
        apiService.obtenerInscripciones()
      ]);
      setMetricas(resMetricas.data);
      setInscripciones(resInscripciones.data);
    } catch (error) {
      console.error("Error cargando dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleAprobar = async (id: string) => {
    try {
      await apiService.aprobarInscripcion(id);
      cargarDatos(); // Se actualiza la tabla visualmente sin alerts molestos
    } catch (error: any) {
      console.error(error.response?.data?.error || "Error al aprobar");
    }
  };

  const handleRechazar = (id: string) => {
    setModalRechazo({ isOpen: true, inscripcionId: id, motivo: '' });
  };

  const confirmarRechazo = async () => {
    const { inscripcionId, motivo } = modalRechazo;
    if (!motivo.trim()) return;
    
    try {
      await apiService.rechazarInscripcion(inscripcionId, motivo);
      setModalRechazo({ isOpen: false, inscripcionId: '', motivo: '' });
      cargarDatos(); // Se actualiza la tabla visualmente
    } catch (error: any) {
      console.error(error.response?.data?.error || "Error al rechazar");
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>;

  return (
    <div className="app-container" style={{ maxWidth: '1400px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <img src="/LogoOficial.png" alt="Logo Institucional" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%', border: '2px solid var(--primary)' }} />
        <LayoutDashboard size={32} color="var(--primary)" />
        <h2>Dashboard de Administración</h2>
      </div>

      {/* Tarjetas de Métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <Users size={20} /> Total Solicitudes
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>{metricas?.total}</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', borderBottom: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fcd34d' }}>
            <Clock size={20} /> Pendientes
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>{metricas?.pendientes}</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', borderBottom: '4px solid var(--success)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6ee7b7' }}>
            <CheckCircle size={20} /> Aprobados
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>{metricas?.aprobados}</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', borderBottom: '4px solid var(--danger)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fca5a5' }}>
            <XCircle size={20} /> Rechazados
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>{metricas?.rechazados}</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', borderBottom: '4px solid var(--primary)', background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(79,70,229,0.1))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a5b4fc' }}>
            <ShieldAlert size={20} /> Cupos Disponibles
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>{metricas?.cuposDisponibles} / {metricas?.aforoMaximo}</div>
        </div>
      </div>

      {/* Tabla de Registros */}
      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Registro en Tiempo Real</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '1rem' }}>DNI</th>
              <th style={{ padding: '1rem' }}>Nombre</th>
              <th style={{ padding: '1rem' }}>Archivo</th>
              <th style={{ padding: '1rem' }}>Fecha</th>
              <th style={{ padding: '1rem' }}>Estado</th>
              <th style={{ padding: '1rem' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inscripciones.map((ins) => (
              <tr key={ins.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem' }}>{ins.dniColegiado}</td>
                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{ins.nombre}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                  <a href={ins.urlImagenDniMenor} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>
                    Ver DNI
                  </a>
                </td>
                <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{new Date(ins.createdAt).toLocaleString()}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '999px', 
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    backgroundColor: ins.estado === 'APROBADO' ? 'rgba(16,185,129,0.2)' : ins.estado === 'RECHAZADO' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)',
                    color: ins.estado === 'APROBADO' ? '#6ee7b7' : ins.estado === 'RECHAZADO' ? '#fca5a5' : '#fcd34d'
                  }}>
                    {ins.estado}
                  </span>
                  {ins.observacionRechazo && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{ins.observacionRechazo}</div>}
                </td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                  {ins.estado === 'PENDIENTE' && (
                    <>
                      <button onClick={() => handleAprobar(ins.id)} style={{ padding: '0.5rem 1rem', background: 'var(--success)', border: 'none', borderRadius: '0.5rem', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>Aprobar</button>
                      <button onClick={() => handleRechazar(ins.id)} style={{ padding: '0.5rem 1rem', background: 'var(--danger)', border: 'none', borderRadius: '0.5rem', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>Rechazar</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {inscripciones.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No hay solicitudes aún.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Rechazo Personalizado (Glassmorphism) */}
      {modalRechazo.isOpen && (
        <div className="animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ padding: '2rem', width: '400px', maxWidth: '90%', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <XCircle color="var(--danger)" /> Motivo de Rechazo
            </h3>
            <textarea 
              className="input-field"
              rows={4}
              placeholder="Ej. DNI borroso, no cumple requisitos..."
              value={modalRechazo.motivo}
              onChange={(e) => setModalRechazo({ ...modalRechazo, motivo: e.target.value })}
              style={{ width: '100%', marginBottom: '1.5rem', resize: 'none', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setModalRechazo({ isOpen: false, inscripcionId: '', motivo: '' })}
                style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border)', borderRadius: '0.5rem', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.3s' }}>
                Cancelar
              </button>
              <button 
                onClick={confirmarRechazo}
                disabled={!modalRechazo.motivo.trim()}
                style={{ padding: '0.75rem 1.5rem', background: 'var(--danger)', border: 'none', borderRadius: '0.5rem', color: 'white', cursor: modalRechazo.motivo.trim() ? 'pointer' : 'not-allowed', fontWeight: 'bold', opacity: modalRechazo.motivo.trim() ? 1 : 0.5, transition: 'all 0.3s' }}>
                Rechazar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
