# API-Universidad

**ESTADO:** ✅ Frontend Funcional - Login y Dashboards Operacionales

Proyecto académico desarrollado para el curso de **Base de Datos 2**, enfocado en la construcción de una plataforma universitaria con arquitectura distribuida, respaldos automatizados y simulación de alta disponibilidad.

---

## 🚀 ESTADO ACTUAL DEL PROYECTO

### ✅ Frontend COMPLETAMENTE FUNCIONAL

**Corregido y Operacional:**
- ✅ Login funcional con validación de email institucional
- ✅ Dashboard Admin con 6 módulos navegables
- ✅ Dashboard Docente con 6 módulos navegables  
- ✅ Sistema de temas (Claro, Oscuro, Coquette)
- ✅ Configuración personal para docentes
- ✅ Logout y redirección correcta
- ✅ Responsive design en todos los dispositivos

**Correcciones Realizadas:**
1. Renombrada exportación `Notas` → `ControlNotas`
2. Implementado componente `ConfiguracionDoc` vacío
3. Unificada navegación post-logout
4. Sincronizados tipos TypeScript entre componentes

📖 Ver detalles: [`CAMBIOS_REALIZADOS.md`](./CAMBIOS_REALIZADOS.md)

---

## 📋 GUÍA RÁPIDA DE USO

### Instalación y Ejecución

```bash
cd frontend
npm install
npm run dev
```

Acceder en: `http://localhost:5173`

### Credenciales de Prueba

| Rol | Email | Acceso |
|-----|-------|--------|
| Admin | `admin@miumg.edu.gt` | Dashboard Admin |
| Docente | `docente@miumg.edu.gt` | Dashboard Docente |
| Estudiante | `estudiante@miumg.edu.gt` | Login solo (no implementado) |

✅ La contraseña puede ser cualquier valor en modo mock.

📖 Ver detalles: [`INSTRUCCIONES_EJECUCION.md`](./INSTRUCCIONES_EJECUCION.md)

---

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
