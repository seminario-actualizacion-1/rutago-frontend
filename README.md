# 🚍 RutaGo

## Sistema Inteligente de Consulta y Monitoreo de Rutas de Transporte en Tiempo Real

RutaGo es una plataforma web diseñada para mejorar la experiencia de los usuarios del transporte urbano e intermunicipal mediante herramientas de consulta de rutas, horarios y seguimiento de vehículos en tiempo real.

---

## 🎯 Objetivo General

Desarrollar una aplicación web que permita a los usuarios consultar rutas, horarios y ubicación de vehículos en tiempo real, optimizando la experiencia de movilidad y reduciendo los tiempos de espera.

---

## ❗ Problemática

Actualmente muchos pasajeros desconocen la ubicación exacta de los vehículos, los horarios reales de llegada y posibles retrasos en las rutas. Esta situación genera incertidumbre, pérdida de tiempo y dificultades para planificar desplazamientos.

RutaGo busca solucionar esta problemática mediante una plataforma accesible y fácil de usar.

---

## 👥 Usuarios del Sistema

- 👤 Pasajeros
- 🚌 Conductores
- 🏢 Empresas Transportadoras
- ⚙️ Administradores

---

## ⚙️ Funcionalidades Principales

- Registro de usuarios.
- Inicio y cierre de sesión.
- Gestión de perfiles.
- Consulta de rutas por destino.
- Visualización de buses disponibles.
- Consulta de horarios.
- Seguimiento GPS en tiempo real.
- Estado de los vehículos.
- Gestión de rutas y horarios.
- Notificaciones automáticas (futuras versiones).

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Uso |
|------------|-----|
| React | Frontend |
| Vite | Entorno de desarrollo |
| JavaScript | Lógica de negocio |
| Express.js | Backend |
| MySQL | Base de datos |
| GitHub | Control de versiones |
| GitHub Actions | Integración continua |
| ESLint | Calidad de código |
| Trello | Gestión Scrum |

---

## 🌐 Arquitectura General

```text
Frontend (React + Vite)
          │
          ▼
      API REST
     (Express.js)
          │
          ▼
        MySQL
```

---

## 💻 Frontend

### Tecnologías

- React
- Vite
- JavaScript
- HTML5
- CSS3
- ESLint

### Características

- Interfaz moderna y responsiva.
- Hot Module Replacement (HMR).
- Arquitectura escalable.
- Componentes reutilizables.
- Compatible con dispositivos móviles y escritorio.

---

## 🔧 Backend

### Tecnologías Propuestas

- Node.js
- Express.js

### Funcionalidades

- Gestión de usuarios.
- Gestión de rutas.
- Gestión de buses.
- Gestión de horarios.
- Autenticación y autorización.
- API REST.

---

## 🗄️ Base de Datos

### Motor

MySQL

### Entidades Principales

- Usuario
- Rol
- Bus
- Ruta
- Horario
- Ubicación
- Historial

---

## 🚀 Integración Continua

El proyecto utiliza GitHub y GitHub Actions para automatizar tareas de integración y control de versiones.

---

## 💻 Frontend

### Correr proyecto

```bash
# Desde la carpeta rutago-frontend/

# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Build para producción
npm run build
```

### Url local

http://localhost:5173

---

## 🚀 Integración Continua

## 📋 Metodología Scrum

Herramienta utilizada:

**Trello**

### Equipo Scrum

| Rol | Integrante |
|------|------------|
| Scrum Master | Edward |
| Desarrollador Backend | Cristian Valderrama |
| Desarrolladora Frontend | STEFANY Potosí |
| Administrador de Base de Datos | Santiago Estupiñán |
| QA Tester | Guap |

---

## 📊 Estado del Proyecto

### Completado

- Configuración de React + Vite.
- Configuración de ESLint.
- Configuración de GitHub Actions.
- Estructura inicial del Frontend.

### En Desarrollo

- Componentes React.
- Consulta de rutas.
- Diseño de interfaces.

### Pendiente

- Integración con Express.js.
- Conexión con MySQL.
- Geolocalización en tiempo real.
- Sistema de notificaciones.

---

## 📄 Licencia

Proyecto académico desarrollado con fines educativos para la implementación de soluciones tecnológicas orientadas al monitoreo y seguimiento de rutas de transporte en tiempo real.

## 🔗 Enlaces

- Backend: https://github.com/seminario-actualizacion-1/rutago-backend
