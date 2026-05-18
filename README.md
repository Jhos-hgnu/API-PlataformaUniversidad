# API-Universidad

Proyecto académico desarrollado para el curso de **Base de Datos 2**, enfocado en la construcción de una plataforma universitaria con arquitectura distribuida, respaldos automatizados y simulación de alta disponibilidad.

## Objetivo del Proyecto

Desarrollar una aplicación web transaccional basada en una arquitectura cliente-servidor utilizando tecnologías modernas de desarrollo web y SQL Server como motor de base de datos.

El proyecto busca implementar:

- Aplicación web transaccional.
- API REST para gestión universitaria.
- Automatización de backups.
- Simulación de alta disponibilidad.
- Replicación y respaldo en servidores distribuidos.
- Escenario académico de continuidad operativa.

---

# Tecnologías Utilizadas

## Frontend

- React
- TypeScript
- Vite
- pnpm

## Backend

- Node.js
- NestJS
- TypeScript
- pnpm

## Base de Datos

- SQL Server
- SQL Server Agent
- Stored Procedures
- Jobs
- Backups automáticos

---

# Arquitectura General

```text
Cliente
   |
   v
Frontend React
   |
   v
Backend NestJS API
   |
   v
SQL Server Principal
   |
   v
Servidor de Respaldo / Alta Disponibilidad
```

---

# Estructura del Proyecto

```text
API-Universidad/
│
├── frontend/      # Aplicación React + TypeScript
├── backend/       # API NestJS
├── docs/          # Documentación, scripts SQL y evidencias
└── README.md
```

---

# Gestión de Dependencias

El proyecto utiliza **pnpm** como gestor de paquetes.

## Instalación de pnpm

```bash
npm install -g pnpm
```

---

# Inicialización del Frontend

```bash
pnpm create vite frontend --template react-ts
cd frontend
pnpm install
pnpm run dev
```

---

# Inicialización del Backend

```bash
nest new backend --package-manager pnpm
cd backend
pnpm install
pnpm run start:dev
```

---

# Objetivos Técnicos

- Implementar una API REST modular.
- Gestionar autenticación y usuarios.
- Manejar operaciones transaccionales.
- Simular infraestructura distribuida utilizando múltiples laptops.
- Automatizar backups en ubicaciones externas.
- Implementar mecanismos de recuperación y continuidad operativa.

---

# Módulos Planeados

- Usuarios
- Cursos
- Inscripciones
- Notas
- Administración

---

# Curso

**Base de Datos 2**

Universidad Mariano Gálvez de Guatemala (UMG)
2026
