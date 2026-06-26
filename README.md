# 🎓 Colegiatura 2026 - Portal de Eventos MVP

Este proyecto es el Producto Mínimo Viable (MVP) para el sistema de inscripción de eventos de la institución. Fue construido siguiendo un enfoque de "Domain-Driven Design" (Capas) y control avanzado de concurrencia.

## 🚀 Tecnologías Utilizadas

- **Frontend:** React + Vite + TypeScript (Vanilla CSS, Glassmorphism, Lucide Icons)
- **Backend:** Node.js + Express + TypeScript
- **Base de Datos:** PostgreSQL (Alojado en Supabase)
- **ORM:** Prisma v7 (con adaptador `pg` para conexión directa y segura)
- **Simulador API:** json-server (Mock de padrón de colegiados externos)

## 📦 Instrucciones de Arranque (Docker / Local)

El proyecto está diseñado para arrancar fácilmente utilizando `docker-compose`.

1. Clonar el repositorio y entrar a la carpeta principal:
   ```bash
   git clone <tu-repositorio>
   cd InscripcionEventosMVP
   ```

2. Levantar toda la orquestación (Base de datos, Backend, Frontend y Servidor Mock):
   ```bash
   docker-compose up --build -d
   ```
   *(Nota: Actualmente las bases de datos de producción apuntan a Supabase, pero el docker-compose está preparado para ambientes locales).*

3. **Accesos:**
   - Portal de Usuarios: `http://localhost:5173` (o `http://localhost:5174` si el puerto base está ocupado)
   - Dashboard Administrador: `/admin` (ej: `http://localhost:5174/admin`)
   - Mock API (Padrón): `http://localhost:3004/colegiados`

## 🔐 Lógica de Concurrencia y Aforo Estricto (Transacciones)

Uno de los requerimientos más críticos de este sistema es el límite de aforo (50 cupos) en eventos de alta demanda. 

Para resolver problemas de **"Race Conditions"** (donde dos administradores intentan aprobar inscripciones en el mismo milisegundo), se implementó una arquitectura basada en **Transacciones Serializables de Prisma** (`Prisma.$transaction`).

**¿Cómo funciona?**
1. Cuando un administrador hace clic en "Aprobar", el sistema inicia un túnel transaccional seguro con PostgreSQL con el nivel máximo de aislamiento (`Serializable`).
2. Dentro del bloqueo, el sistema cuenta a los aprobados.
3. Si los aprobados son menores a 50, se actualiza el estado a `APROBADO` y se consume el cupo.
4. Si dos administradores disparan la acción al mismo tiempo en el cupo 49, la base de datos pondrá en cola la segunda petición y, al resolver la primera, rechazará la segunda automáticamente informando que *"El aforo máximo ha sido alcanzado"*.

## 📧 Envío de Correos y Parentesco (Simulaciones)

Tal cual dictan los requerimientos técnicos:
- **Carga de DNI:** El portal Frontend cuenta con un `input type="file"` que permite al usuario buscar un archivo real en su computadora, leyendo su metadato y simulando exitosamente el flujo de Subida de Documentos de Parentesco.
- **Notificaciones (Correos):** Cada vez que el Administrador **Aprueba** o **Rechaza** una solicitud en el Dashboard, el Backend emite un log estandarizado (`[SISTEMA DE CORREOS]`) en la consola del servidor. Esto simula el trigger hacia un servicio externo como SendGrid o AWS SES.

---
*Desarrollado para la evaluación técnica.*
