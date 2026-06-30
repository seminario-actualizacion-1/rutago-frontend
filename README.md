# 🚍 RutaGo

## Sistema Inteligente de Consulta y Monitoreo de Rutas de Transporte en Tiempo Real

RutaGo es una plataforma web diseñada para facilitar la movilidad urbana e intermunicipal mediante la consulta de rutas, horarios, ubicación de vehículos y administración del sistema desde una única plataforma.

---

# 🎯 Objetivo General

Desarrollar una aplicación web que permita a los usuarios consultar rutas, horarios y ubicación de vehículos en tiempo real, optimizando la movilidad y reduciendo los tiempos de espera.

---

# ❗ Problemática

Actualmente muchos pasajeros desconocen la ubicación de los vehículos, los horarios reales de salida y posibles retrasos de las rutas, ocasionando pérdidas de tiempo e incertidumbre.

RutaGo busca solucionar esta problemática mediante una plataforma moderna, sencilla y accesible.

---

# 👥 Usuarios del Sistema

- 👤 Pasajeros
- 🚌 Conductores
- 🏢 Entidades transportadoras
- ⚙️ Administradores

---

# ⚙️ Funcionalidades

## Usuarios

- Registro
- Inicio de sesión
- Recuperación de contraseña
- Cerrar sesión
- Gestión de perfil

## Pasajeros

- Buscar rutas
- Consultar horarios
- Ver buses disponibles
- Consultar información del vehículo

## Administrador

- Gestión de Vehículos
- Gestión de Rutas
- Gestión de Horarios
- Gestión de Conductores
- Gestión de Comunas
- Gestión de Barrios
- Gestión de Entidades
- Gestión de Pasajeros

## Futuras versiones

- Seguimiento GPS en tiempo real
- Estado de buses
- Notificaciones automáticas

---

# 🛠 Tecnologías Utilizadas

| Tecnología | Uso |
|------------|-----|
| React | Frontend |
| Vite | Entorno de desarrollo |
| JavaScript | Lógica del sistema |
| HTML5 | Estructura |
| CSS3 | Estilos |
| Express.js | Backend |
| MySQL | Base de datos |
| Axios | Consumo de API |
| React Router DOM | Navegación |
| Git | Control de versiones |
| GitHub | Repositorio |
| GitHub Actions | CI/CD |
| Trello | Gestión Scrum |
| ESLint | Calidad del código |

---

# 🏗 Arquitectura

```
             Usuario

                │

        Frontend (React)

                │

           Axios (API)

                │

      Backend (Express.js)

                │

            MySQL
```

---

# 💻 Frontend

## Páginas implementadas

- Home
- Login
- Registro
- Recuperar contraseña
- Dashboard
- Perfil
- Vehículos
- Rutas
- Conductores
- Pasajeros
- Comunas
- Barrios
- Entidades

---

## Componentes

- Navbar
- Sidebar
- Button
- Card
- Input
- Footer
- Logo
- DashboardLayout
- ProtectedRoute

---

# 🔧 Backend

## Funcionalidades implementadas

- API REST
- Autenticación
- Roles
- CRUD de Usuarios
- CRUD de Vehículos
- CRUD de Rutas
- CRUD de Horarios
- CRUD de Comunas
- CRUD de Barrios
- CRUD de Conductores
- CRUD de Entidades

---

# 🗄 Base de Datos

Motor:

**MySQL**

## Tablas principales

- Usuarios
- Roles
- Vehículos
- Rutas
- Horarios
- Barrios
- Comunas
- Perfil Conductor
- Perfil Entidad
- Viajes

---

# 🚀 Instalación

## Frontend

```bash
npm install
npm run dev
```

Aplicación local:

```
http://localhost:5173
```

---

## Backend

```bash
npm install
npm start
```

---

# 📋 Metodología Scrum

Herramienta utilizada:

**Trello**

---

# 👨‍💻 Equipo

| Rol | Integrante |
|------|------------|
| Scrum Master | Edward Suárez |
| Backend | Cristian Valderrama |
| Frontend | Stefany Potosí |
| Base de Datos | Santiago Estupiñán |
| QA | Equipo RutaGo |

---

# 📊 Estado del Proyecto

## ✅ Completado

- Configuración del proyecto React + Vite.
- Backend Express.
- Base de datos MySQL.
- Sistema de autenticación.
- Registro.
- Login.
- Recuperación de contraseña.
- Gestión de perfiles.
- Dashboard.
- CRUD de Vehículos.
- CRUD de Rutas.
- CRUD de Horarios.
- Gestión de Comunas.
- Gestión de Barrios.
- API REST.
- Integración Frontend - Backend.
- GitHub Actions.

---

## 🚧 En desarrollo

- Buscador de buses por destino.
- Visualización de buses disponibles.
- Consulta de horarios.
- Vista detallada de buses.

---

## 📌 Pendiente

- Seguimiento GPS en tiempo real.
- Estado de buses en tiempo real.
- Notificaciones automáticas.

---

# 📂 Estructura del Proyecto

```
rutago-frontend
│
├── public
├── src
│   ├── api
│   ├── assets
│   ├── components
│   ├── context
│   ├── hooks
│   ├── pages
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
│
├── package.json
├── vite.config.js
└── README.md
```

---

# 🚀 Control de Versiones

Se utiliza Git y GitHub mediante el flujo de trabajo basado en ramas (Git Flow), permitiendo el desarrollo colaborativo y el control de versiones del proyecto.

---

# 📄 Licencia

Proyecto académico desarrollado con fines educativos para la asignatura Seminario de Actualización.

---

# 🔗 Repositorios

**Frontend**

https://github.com/seminario-actualizacion-1/rutago-frontend

**Backend**

https://github.com/seminario-actualizacion-1/rutago-backend

**Trello**

https://trello.com/b/zR4MFcBH
