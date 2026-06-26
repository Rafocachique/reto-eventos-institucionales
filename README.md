# Sistema de Inscripción y Validación de Eventos Institucionales (MVP)

Este proyecto es un Producto Mínimo Viable (MVP) para la gestión de inscripciones al evento del "Día del Padre", cumpliendo con reglas estrictas de aforo y elegibilidad.

## Arquitectura

El proyecto está diseñado bajo una arquitectura de capas (N-Tier) y se divide en 3 componentes principales orquestados con Docker:
1. **Base de Datos:** PostgreSQL (Persistencia y control de concurrencia).
2. **API Mock:** Servicio que expone la data de colegiados (json-server).
3. **Backend & Frontend:** API Node.js (Reglas de Negocio) y Next.js (Portal de Usuario y Administrador).

## Requisitos Previos
- [Docker](https://www.docker.com/) y Docker Compose instalados.
- Node.js v18+ (Para desarrollo local opcional).

## Instrucciones de Arranque
*(Se actualizará en los siguientes commits)*
