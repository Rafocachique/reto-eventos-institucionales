import React, { useState } from 'react';
import { UserPlus, Image as ImageIcon, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { apiService } from '../../services/api';

export default function UserPortal() {
  const [formData, setFormData] = useState({
    dni: '',
    nombre: ''
  });
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    if (!imagenFile) {
      setStatus('error');
      setMessage('Debe adjuntar la imagen del DNI');
      return;
    }
    
    const data = new FormData();
    data.append('dni', formData.dni);
    data.append('nombre', formData.nombre);
    data.append('imagen', imagenFile);

    try {
      // Uso de la capa de servicios para la petición
      const response = await apiService.crearInscripcion(data);
      setStatus('success');
      setMessage(response.data.mensaje || '¡Inscripción registrada con éxito!');
      setFormData({ dni: '', nombre: '' });
      setImagenFile(null);
      
      const label = document.getElementById('file-label');
      if (label) label.innerText = `Haz clic para subir la imagen del DNI`;
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.error || 'Error al procesar la inscripción');
    }
  };

  return (
    <div className="app-container">
      <div style={{ maxWidth: '450px', margin: 'auto', width: '100%' }}>
        
        {/* Cabecera */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }} className="animate-fade-in">
          <img src="/LogoOficial.png" alt="Logo Institucional" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%', marginBottom: '1rem', border: '2px solid var(--primary)', boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)' }} />
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Colegiatura 2026
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Portal Oficial de Inscripción de Eventos
          </p>
        </div>

        {/* Tarjeta Glassmorphism */}
        <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSubmit}>
            
            <div className="input-group">
              <label className="input-label">DNI del Colegiado</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Ej. 12345678"
                value={formData.dni}
                onChange={(e) => setFormData({...formData, dni: e.target.value})}
                required
                maxLength={8}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Nombres Completos</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Ej. Juan Perez"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Foto del DNI del Menor (Requerido para parentesco)</label>
              <div style={{ position: 'relative', border: '2px dashed var(--glass-border)', padding: '1.5rem', borderRadius: '0.75rem', textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.2)', transition: 'all 0.3s ease', cursor: 'pointer' }}>
                <input 
                  type="file" 
                  accept="image/*"
                  required
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImagenFile(file);
                      const label = document.getElementById('file-label');
                      if (label) label.innerText = `Archivo cargado: ${file.name}`;
                    }
                  }}
                />
                <ImageIcon style={{ color: 'var(--text-muted)', margin: '0 auto', marginBottom: '0.5rem' }} size={32} />
                <p id="file-label" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Haz clic para subir la imagen del DNI</p>
              </div>
            </div>

            {/* Mensajes de Alerta */}
            {status === 'error' && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', color: '#fca5a5', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <AlertCircle size={20} />
                <span style={{ fontSize: '0.875rem' }}>{message}</span>
              </div>
            )}

            {status === 'success' && (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', color: '#6ee7b7', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <CheckCircle size={20} />
                <span style={{ fontSize: '0.875rem' }}>{message}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="btn-primary"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <><Loader2 className="animate-spin" size={20} /> Procesando...</>
              ) : (
                <><UserPlus size={20} /> Solicitar Inscripción</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
