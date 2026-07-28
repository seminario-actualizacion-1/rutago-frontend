# 🚍 [**RutaGo**](https://rutago.seminario1.eleueleo.com/) - Frontend

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat&logo=vite)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=flat&logo=javascript)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=flat&logo=leaflet)
![Axios](https://img.shields.io/badge/Axios-1.7-5A29E4?style=flat&logo=axios)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3)

## Sistema Inteligente de Consulta y Monitoreo de Rutas de Transporte en Tiempo Real

<a id="url-del-proyecto"></a>
## URL del proyecto:

https://rutago.seminario1.eleueleo.com/

---

RutaGo es una plataforma web diseñada para facilitar la movilidad urbana e intermunicipal mediante la consulta de rutas, horarios, ubicación de vehículos y administración del sistema desde una única plataforma.

---

## 📑 Tabla de Contenido

- [URL del proyecto](#url-del-proyecto)
- [Objetivo General](#objetivo-general)
- [Problemática](#problemática)
- [Usuarios del Sistema](#usuarios-del-sistema)
- [Funcionalidades](#funcionalidades)
- [Variables de entorno](#variables-de-entorno)
- [Scripts disponibles](#scripts-disponibles)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Roles y rutas protegidas](#roles-y-rutas-protegidas)
- [Componentes principales](#componentes-principales)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Arquitectura](#arquitectura)
- [Frontend](#frontend)
- [Usuarios de prueba](#usuarios-de-prueba)
- [URLs desplegadas](#urls-desplegadas)
- [Instalación](#instalación)
- [Metodología Scrum](#metodología-scrum)
- [Equipo](#equipo)
- [Estado del Proyecto](#estado-del-proyecto)
- [Control de Versiones](#control-de-versiones)
- [Licencia](#licencia)
- [Checklist de Evaluación](#checklist-de-evaluación--fase-2)
- [Repositorios](#repositorios)

---

<a id="objetivo-general"></a>
# 🎯 Objetivo General

Desarrollar una aplicación web que permita a los usuarios consultar rutas, horarios y ubicación de vehículos en tiempo real, optimizando la movilidad y reduciendo los tiempos de espera.

---

<a id="problematica"></a>
# ❗ Problemática

Actualmente muchos pasajeros desconocen la ubicación de los vehículos, los horarios reales de salida y posibles retrasos de las rutas, ocasionando pérdidas de tiempo e incertidumbre.

RutaGo busca solucionar esta problemática mediante una plataforma moderna, sencilla y accesible.

---

<a id="usuarios-del-sistema"></a>
# 👥 Usuarios del Sistema

- 👤 Pasajeros
- 🚌 Conductores
- 🏢 Entidades transportadoras
- ⚙️ Administradores

---

<a id="funcionalidades"></a>
# ⚙️ Funcionalidades

### ✅ Completado

#### Usuarios

- ✅ Registro
- ✅ Inicio de sesión
- ✅ Cerrar sesión
- ✅ Gestión de perfil

#### Pasajeros

- ✅ Buscar rutas
- ✅ Consultar horarios
- ✅ Ver buses disponibles
- ✅ Consultar información del vehículo
- ✅ Solicitar y unirse a viajes

#### Administrador

- ✅ Gestión de Vehículos
- ✅ Gestión de Rutas
- ✅ Gestión de Horarios
- ✅ Gestión de Conductores
- ✅ Gestión de Viajes
- ✅ Gestión de Comunas
- ✅ Gestión de Barrios
- ✅ Gestión de Entidades
- ✅ Gestión de Pasajeros

### 🚧 En desarrollo

- ⏳ Recuperación de contraseña
- ⏳ Seguimiento GPS en tiempo real
- ⏳ Estado de buses
- ⏳ Notificaciones automáticas

---

<a id="variables-de-entorno"></a>
## ⚙️ Variables de entorno

Crear archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost:8082/api
```

---

<a id="scripts-disponibles"></a>
## 📦 Scripts disponibles

```bash
npm run dev
npm run build    # construir para produccion
npm run preview  # vista previa de la build
```

---

<a id="estructura-del-proyecto"></a>
## 📁 Estructura del proyecto

```
rutago-frontend/
├── .github/
│   └── workflows/          # GitHub Actions
├── dist/                   # Build de producción
├── public/
│   └── RutaGo.svg          # Favicon
├── src/
│   ├── api/                # Cliente Axios con interceptor
│   ├── assets/
│   ├── components/
│   │   ├── ActionsMenu/
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── DashboardLayout/
│   │   ├── Footer/
│   │   ├── Input/
│   │   ├── Logo/
│   │   ├── MapaCrearRuta/
│   │   ├── MapaRutas/
│   │   ├── MapaSelector/
│   │   ├── Modal/
│   │   ├── Navbar/
│   │   ├── Pagination/
│   │   ├── PasswordInput/
│   │   ├── ProtectedRoute.jsx
│   │   ├── Sidebar/
│   │   └── TableToolbar/
│   ├── config/             # Config (roles, constantes)
│   ├── context/            # React Context (LayoutContext)
│   ├── hooks/              # Custom hooks (useAuth)
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
│   │   ├── RecuperarPassword/
│   │   ├── Registro/
│   │   ├── Rutas/
│   │   ├── Usuarios/
│   │   ├── Vehiculos/
│   │   └── Viajes/
│   ├── services/           # Llamadas a la API (un archivo por módulo)
│   ├── styles/             # Estilos globales
│   ├── App.jsx             # Router principal con rutas protegidas
│   ├── App.css
│   ├── AppLayout.jsx       # Layout con sidebar
│   ├── index.css
│   └── main.jsx            # Punto de entrada
├── index.html
├── .env.example
├── .env.production
├── .gitignore
├── eslint.config.js
├── package.json
├── vite.config.js
└── README.md
```

---

<a id="roles-y-rutas-protegidas"></a>
## 👥 Roles y rutas protegidas

| Rol             | Rutas accesibles                     |
| --------------- | ------------------------------------ |
| Administrador   | Todos los módulos de gestión         |
| Conductor       | Dashboard, Viajes, Perfil            |
| Pasajero        | Dashboard (consulta), Viajes, Perfil |
| Entidad Externa | Dashboard, Vehículos, Perfil         |

Cada ruta verifica el rol mediante el componente `ProtectedRoute` con la prop `allowedRoles`.

---

<a id="componentes-principales"></a>
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
| Button          | Botón reutilizable con estado disabled                 |
| Input           | Campo de texto reutilizable                            |
| PasswordInput   | Campo de contraseña con toggle de visibilidad          |
| Card            | Tarjeta contenedora                                    |
| MapaRutas       | Mapa con Leaflet para visualizar rutas                 |
| MapaCrearRuta   | Mapa interactivo para dibujar nuevas rutas             |
| MapaSelector    | Mapa para seleccionar ubicaciones                      |
| DashboardLayout | Layout general con Sidebar + Navbar                    |
| Footer          | Pie de página                                          |
| Logo            | Componente del logotipo                                |

---

<a id="tecnologias-utilizadas"></a>
## 🛠 Tecnologías Utilizadas

| Tecnología | Uso |
| ---------- | --- |

- ⚛️ **React 18** — UI Framework
- ⚡ **Vite 6** — Bundler y dev server
- 🗺️ **Leaflet** + **react-leaflet** — Mapas interactivos
- 📍 **leaflet-geosearch** — Búsqueda de ubicaciones
- 🔌 **Axios** — Cliente HTTP
- 🧭 **React Router DOM** — Enrutamiento
- 🎨 **CSS3** — Estilos
- 🔍 **ESLint** — Calidad de código
- 🚀 **GitHub Actions** — CI/CD

---

<a id="arquitectura"></a>
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

<a id="frontend"></a>
# 💻 Frontend

## Páginas implementadas

| Página                | Estado |
| --------------------- | ------ |
| Home (público)        | ✅     |
| Login                 | ✅     |
| Registro              | ✅     |
| Recuperar contraseña  | ⏳     |
| Dashboard por rol     | ✅     |
| Acceso Denegado (403) | ✅     |
| Perfil                | ✅     |
| Vehículos CRUD        | ✅     |
| Rutas CRUD            | ✅     |
| Conductores CRUD      | ✅     |
| Pasajeros CRUD        | ✅     |
| Comunas CRUD          | ✅     |
| Barrios CRUD          | ✅     |
| Entidades CRUD        | ✅     |
| Horarios CRUD         | ✅     |
| Viajes                | ✅     |
| Usuarios CRUD         | ✅     |

---

<a id="usuarios-de-prueba"></a>
## 👥 Usuarios de prueba

| Rol             | Correo               | Contraseña           |
| --------------- | -------------------- | -------------------- |
| Administrador   | admin@rutago.com     | admin123456          |
| Conductor       | conductor@rutago.com | conductor123456      |
| Pasajero        | pasajero@rutago.com  | pasajero123456       |
| Entidad Externa | entidad@rutago.com   | entidadExterna123456 |

---

<a id="urls-desplegadas"></a>
## 🔗 URLs desplegadas

| Servicio | URL                                        |
| -------- | ------------------------------------------ |
| Frontend | https://rutago.seminario1.eleueleo.com/    |
| Backend  | https://rutago.seminario1.eleueleo.com/api |

---

<a id="instalacion"></a>
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

<a id="cicd-y-deploy"></a>
## 🚀 CI/CD y Deploy

### Workflow

`.github/workflows/blank.yml`

### Flujo de despliegue automático

```
Push a main
     ↓
Checkout código
     ↓
Node.js setup
     ↓
npm install
     ↓
npm run build
     ↓
rsync dist/ → VPS
     ↓
Recarga del servidor web (Nginx)
```

El frontend se despliega automáticamente al hacer push a `main`, generando el build de producción y sincronizándolo con el VPS.

---

<a id="metodologia-scrum"></a>
# 📋 Metodología Scrum

Herramienta utilizada:

**Trello**

---

<a id="equipo"></a>
# 👨‍💻 Equipo

| Rol           | Integrante          |
| ------------- | ------------------- |
| Scrum Master  | Edward Suárez       |
| Backend       | Cristian Valderrama |
| Frontend      | Stefany Potosí      |
| Base de Datos | Santiago Estupiñán  |
| QA            | Sebastian Guapi     |

---

<a id="estado-del-proyecto"></a>
# 📊 Estado del Proyecto

## ✅ Completado

- Sistema de autenticación (registro, login).
- Roles: Administrador, Conductor, Pasajero, Entidad Externa.
- Dashboard con vista por rol.
- CRUD completo de: Usuarios, Vehículos, Rutas, Horarios, Conductores, Pasajeros, Entidades, Comunas, Barrios, Viajes.
- Sidebar colapsable con iconos Lucide.
- TableToolbar con búsqueda, filtros y ordenamiento configurable.
- Protección de rutas por rol (ProtectedRoute).
- Redirección post-login según el rol.
- Navegación responsive (hamburger menu).
- Catálogos dinámicos desde API (estados y tipos de documento).
- Datos reales de Buenaventura (12 comunas, 104 barrios).
- API REST con paginación, búsqueda y ordenamiento.
- Migraciones y seeders con Sequelize.

---

## 🚧 En desarrollo

- Recuperación de contraseña (frontend).
- Ubicación GPS en tiempo real.

---

## 📌 Pendiente

- Seguimiento GPS en tiempo real.
- Estado de buses en tiempo real.
- Notificaciones automáticas.

---

<a id="control-de-versiones"></a>
# 🚀 Control de Versiones

Se utiliza Git y GitHub mediante el flujo de trabajo basado en ramas (Git Flow), permitiendo el desarrollo colaborativo y el control de versiones del proyecto.

---

<a id="licencia"></a>
# 📄 Licencia

Proyecto académico desarrollado con fines educativos para la asignatura Seminario de Actualización.

---

<a id="checklist-de-evaluacion--fase-2"></a>
## ✅ Checklist de Evaluación — Fase 2

### Pruebas Funcionales en Vivo

- [ ] **Verificación de Rutas**: Al ingresar directamente a `/admin` sin autenticar, el sistema redirige al Login.
- [ ] **Prueba de Roles**: Al loguearse con un usuario no-admin, el sistema bloquea el acceso a `/admin` mostrando error 403.
- [ ] **Lectura Transaccional**: El panel administrativo carga datos dinámicos de al menos dos tablas transaccionales.
- [ ] **Cierre de Sesión Efectivo**: Al cerrar sesión, el token se destruye en cliente y no se puede volver atrás con el navegador.

### Pruebas de Despliegue y Automatización

- [ ] **Despliegue por Git**: Último cambio en producción realizado mediante GitHub Actions.
- [ ] **Consistencia de Base de Datos**: Migraciones ejecutadas exitosamente en el pipeline de deploy.
- [ ] **Validación de Documentación**: README con arquitectura, URLs activas y usuarios de prueba.

---

<a id="repositorios"></a>
# 🔗 Repositorios

[**Backend**](https://github.com/seminario-actualizacion-1/rutago-backend)

[**Trello**](https://trello.com/b/zR4MFcBH)
