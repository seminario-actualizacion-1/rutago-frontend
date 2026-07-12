# 🚍 [**RutaGo**](https://rutago.seminario1.eleueleo.com/) - Frontend

## Sistema Inteligente de Consulta y Monitoreo de Rutas de Transporte en Tiempo Real

## URL del proyecto:

https://rutago.seminario1.eleueleo.com/

---

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

## ⚙️ Variables de entorno

Crear archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost:8082/api
```

---

## 📦 Scripts disponibles

```bash
npm run dev
npm run build    # construir para produccion
npm run preview  # vista previa de la build
```

---

## 📁 Estructura del proyecto

```
rutago-frontend/
├── public/
│   └── RutaGo.svg        # Favicon
├── src/
│   ├── api/              # Cliente Axios con interceptor
│   ├── assets/
│   ├── components/
│   │   ├── ActionsMenu/
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── DashboardLayout/
│   │   ├── Footer/
│   │   ├── Input/
│   │   ├── Logo/
│   │   ├── Modal/
│   │   ├── Navbar/
│   │   ├── Pagination/
│   │   ├── PasswordInput/
│   │   ├── ProtectedRoute.jsx
│   │   ├── Sidebar/
│   │   └── TableToolbar/
│   ├── config/           # Config (roles, estados, constantes)
│   ├── context/          # React Context (LayoutContext)
│   ├── hooks/            # Custom hooks (useAuth)
│   ├── pages/
│   │   ├── AccesoDenegado/
│   │   ├── Barrios/
│   │   ├── Comunas/
│   │   ├── Conductores/
│   │   ├── Dashboard/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ConductorDashboard.jsx
│   │   │   ├── PasajeroDashboard.jsx
│   │   │   ├── EntidadDashboard.jsx
│   │   │   ├── dashboardUtils.js
│   │   │   └── Dashboard.css
│   │   ├── Entidades/
│   │   ├── Home/
│   │   ├── Horarios/
│   │   ├── Login/
│   │   ├── Pasajeros/
│   │   ├── Perfil/
│   │   ├── Registro/
│   │   ├── Rutas/
│   │   ├── Usuarios/
│   │   ├── Vehiculos/
│   │   └── Viajes/
│   ├── services/         # Llamadas a la API (un archivo por módulo)
│   ├── App.jsx           # Router principal con rutas protegidas
│   ├── App.css
│   ├── AppLayout.jsx     # Layout con sidebar
│   ├── index.css
│   └── main.jsx          # Punto de entrada
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 👥 Roles y rutas protegidas

| Rol             | Rutas accesibles                     |
| --------------- | ------------------------------------ |
| Administrador   | Todos los módulos de gestión         |
| Conductor       | Dashboard, Viajes, Perfil            |
| Pasajero        | Dashboard (consulta), Viajes, Perfil |
| Entidad Externa | Dashboard, Vehículos, Perfil         |

Cada ruta verifica el rol mediante el componente `ProtectedRoute` con la prop `allowedRoles`.

---

## 🧩 Componentes principales

| Componente      | Función                                                |
| --------------- | ------------------------------------------------------ |
| Navbar          | Barra superior con hamburger menu, avatar y dropdown   |
| Sidebar         | Menú lateral colapsable con iconos Lucide              |
| TableToolbar    | Buscador con debounce, filtros, ordenamiento por campo |
| Pagination      | Paginación de tablas                                   |
| Modal           | Ventana modal para formularios                         |
| ActionsMenu     | Menú contextual (Editar/Eliminar)                      |
| ProtectedRoute  | Guard de rutas por rol                                 |
| DashboardLayout | Layout general con Sidebar + Navbar                    |

---

## 🛠 Tecnologías Utilizadas

| Tecnología       | Uso                   |
| ---------------- | --------------------- |
| React            | Frontend              |
| Vite             | Entorno de desarrollo |
| JavaScript       | Lógica del sistema    |
| HTML5            | Estructura            |
| CSS3             | Estilos               |
| Express.js       | Backend               |
| MySQL            | Base de datos         |
| Axios            | Consumo de API        |
| React Router DOM | Navegación            |
| Git              | Control de versiones  |
| GitHub           | Repositorio           |
| GitHub Actions   | CI/CD                 |
| Trello           | Gestión Scrum         |
| ESLint           | Calidad del código    |

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

- Home (público)
- Login
- Registro
- Recuperar contraseña
- Dashboard (vista por rol: Admin, Conductor, Pasajero, Entidad) con componentes separados
- Acceso Denegado (página 403)
- Perfil
- Vehículos
- Rutas
- Conductores
- Pasajeros
- Comunas
- Barrios
- Entidades
- Horarios
- Viajes
- Usuarios

---

## Componentes

- Navbar (hamburger menu, avatar con dropdown)
- Sidebar (colapsable, iconos Lucide)
- TableToolbar (búsqueda, filtros, ordenamiento)
- Pagination
- Modal
- ActionsMenu
- Button
- Card
- Input
- Footer
- Logo
- DashboardLayout
- AccesoDenegado
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
- CRUD de Pasajeros
- CRUD de Entidades
- CRUD de Viajes

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
- Perfil Pasajero
- Perfil Entidad
- Viajes
- EstadosVehiculo (catálogo)
- EstadosConductor (catálogo)
- EstadosViaje (catálogo)
- TiposDocumento (catálogo)

---

## 👥 Usuarios de prueba

| Rol             | Correo               | Contraseña |
| --------------- | -------------------- | ---------- |
| Administrador   | admin@rutago.com     | admin123456          |
| Conductor       | conductor@rutago.com | conductor123456      |
| Pasajero        | pasajero@rutago.com  | pasajero123456       |
| Entidad Externa | entidad@rutago.com   | entidadExterna123456 |

---

## 🔗 URLs desplegadas

| Servicio | URL                                        |
| -------- | ------------------------------------------ |
| Frontend | https://rutago.seminario1.eleueleo.com/    |
| Backend  | https://rutago.seminario1.eleueleo.com/api |

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
cd ../rutago-backend
npm install
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm start
```

El backend corre en `http://localhost:8082`.

---

# 📋 Metodología Scrum

Herramienta utilizada:

**Trello**

---

# 👨‍💻 Equipo

| Rol           | Integrante          |
| ------------- | ------------------- |
| Scrum Master  | Edward Suárez       |
| Backend       | Cristian Valderrama |
| Frontend      | Stefany Potosí      |
| Base de Datos | Santiago Estupiñán  |
| QA            | Sebastian Guapi     |

---

# 📊 Estado del Proyecto

## ✅ Completado

- Sistema de autenticación (registro, login, recuperación de contraseña).
- Roles: Administrador, Conductor, Pasajero, Entidad Externa.
- Dashboard con vista por rol.
- CRUD completo de: Usuarios, Vehículos, Rutas, Horarios, Conductores, Pasajeros, Entidades, Comunas, Barrios, Viajes.
- Sidebar colapsable con iconos Lucide.
- TableToolbar con búsqueda, filtros y ordenamiento configurable.
- Protección de rutas por rol (ProtectedRoute).
- Redirección post-login según el rol.
- Navegación responsive (hamburger menu).
- Catálogos: EstadosVehiculo, EstadosConductor, EstadosViaje, TiposDocumento.
- Datos reales de Buenaventura (12 comunas, 104 barrios).
- API REST con paginación, búsqueda y ordenamiento.
- Migraciones y seeders con Sequelize.

---

## 🚧 En desarrollo

- Ubicación GPS en tiempo real.

---

## 📌 Pendiente

- Seguimiento GPS en tiempo real.
- Estado de buses en tiempo real.
- Notificaciones automáticas.

---

# 🚀 Control de Versiones

Se utiliza Git y GitHub mediante el flujo de trabajo basado en ramas (Git Flow), permitiendo el desarrollo colaborativo y el control de versiones del proyecto.

---

# 📄 Licencia

Proyecto académico desarrollado con fines educativos para la asignatura Seminario de Actualización.

---

# 🔗 Repositorios

[**Backend**](https://github.com/seminario-actualizacion-1/rutago-backend)

[**Trello**](https://trello.com/b/zR4MFcBH)
