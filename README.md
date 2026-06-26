# 🎓 Colegiatura 2026 - Portal de Eventos MVP

Este proyecto es el Producto Mínimo Viable (MVP) para el sistema de inscripción de eventos de la institución. Fue construido siguiendo un enfoque de "Domain-Driven Design" (Arquitectura en Capas) y control avanzado de concurrencia.

## 🚀 Tecnologías Utilizadas

- **Frontend:** React + Vite + TypeScript (Vanilla CSS, Glassmorphism, Lucide Icons)
- **Backend:** Node.js + Express + TypeScript + Multer
- **Base de Datos:** PostgreSQL
- **ORM:** Prisma v7
- **Simulador API:** json-server (Mock de padrón de colegiados externos)
- **Orquestación:** Docker y Docker Compose

## 📦 Instrucciones de Arranque (Docker)

El proyecto está dockerizado para levantar toda la infraestructura (Base de Datos, Backend, Frontend y API Mock) de forma limpia y replicable con un único comando.

1. Clonar el repositorio y entrar a la carpeta principal:
   ```bash
   git clone <tu-repositorio>
   cd InscripcionEventosMVP
   ```

2. Levantar la orquestación completa:
   ```bash
   docker-compose up --build -d
   ```

3. **Accesos:**
   - **Portal de Usuarios (Frontend):** `http://localhost:5173`
   - **Dashboard Administrador:** `http://localhost:5173/admin`
   - **Backend API:** `http://localhost:3000/api`
   - **Mock API (Padrón):** `http://localhost:3004/colegiados`

## 🔐 Lógica de Concurrencia y Aforo Estricto (Transacciones)

Uno de los requerimientos más críticos de este sistema es el límite de aforo (50 cupos). 
Para resolver problemas de **"Race Conditions"** (donde dos administradores intentan aprobar inscripciones en el mismo milisegundo), se implementó una arquitectura basada en **Transacciones Serializables de Prisma** (`Prisma.$transaction`).

**Flujo de Concurrencia:**
1. Cuando un administrador hace clic en "Aprobar", el sistema inicia un túnel transaccional seguro con PostgreSQL con el nivel máximo de aislamiento (`Serializable`).
2. Dentro del bloqueo, el sistema cuenta a los inscritos.
3. Si los aprobados son menores a 50, se actualiza el estado a `APROBADO` y se consume el cupo.
4. Si dos peticiones llegan al mismo tiempo en el cupo 49, la base de datos pondrá en cola la segunda y, al resolver la primera, rechazará la segunda garantizando que no se supere el aforo.

## 📁 Subida Física de Archivos y Eventos
- **Carga de DNI:** A diferencia de una simulación estática, el sistema implementa una **subida física real**. El archivo viaja mediante `multipart/form-data`, es procesado por `multer` en el backend y almacenado en un directorio local (`public/uploads`). El Dashboard del administrador puede visualizar este archivo físico.
- **Notificaciones (Correos):** Cada vez que se aprueba o rechaza una solicitud, el Backend emite un log estandarizado (`[SISTEMA DE CORREOS]`) en la consola del servidor, simulando un webhook o trigger hacia un servicio de mensajería (AWS SES, SendGrid, etc.).

---
*Desarrollado y estructurado como solución robusta para la evaluación técnica.*
