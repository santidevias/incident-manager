# Aplicación para Gestión de Incidentes
> Aplicación web desarrollada en Angular para el registro, seguimiento y administración eficiente de incidentes.

---

## 🛠️ Stack Tecnológico Planificado

- **Framework & Core:** Angular 20, TypeScript (Strict Mode)
- **Arquitectura & Estado:** Componentes Standalone, Angular Signals, RxJS
- **Navegación & Seguridad:** Angular Router, Guards funcionales
- **Comunicación HTTP:** HttpClient, Interceptores funcionales
- **Formularios:** Reactive Forms
- **Estilos & Maquetación:** HTML semántico, CSS / SCSS, Tailwind CSS v3
- **Pruebas & Calidad:** Pruebas unitarias, ESLint
- **Control de Versiones:** Git
- **API Mock / Backend:** Mockoon

---

## 🚀 Requisitos Previos

Asegúrate de contar con las siguientes herramientas instaladas localmente antes de ejecutar el proyecto:

- [Node.js](https://nodejs.org/) (Versión LTS recomendada para Angular 20+)
- [npm](https://www.npmjs.com/)
- [Angular CLI](https://angular.dev/tools/cli) (Versión 20 o superior)
- [Mockoon](https://mockoon.com/) (Para la simulación de servicios REST)

---

## ⚙️ Instalación y Configuración

Sigue estos pasos para clonar e inicializar el entorno de desarrollo:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/santidevias/incident-manager
   cd incident-manager
   ```

2. **Asegurar rama de trabajo:**
   ```bash
   git checkout master
   ```

3. **Instalar dependencias:**
   ```bash
   npm install
   ```

4. **Ejecutar el servidor de desarrollo:**
   ```bash
   ng serve
   ```
   La aplicación estará disponible en `http://localhost:4200/`.

---

## 🧪 Ejecución de Pruebas Unitarias

Para ejecutar el conjunto de pruebas unitarias de la aplicación con Karma/Jasmine (o Jest según tu config):

```bash
ng test
```

---

## 📂 Estructura del Proyecto

```text
src/
├── app/
│   ├── core/                                  # Guardias, interceptores globales y lógica núcleo del sistema
│   ├── features/                              # Flujos e interfaces principales por características
│   │   ├── authentication/                    # Control de acceso, login y persistencia de sesión
│   │   ├── dashboard/                         # Métricas generales y KPIs de la aplicación (En desarrollo)
│   │   └── incidents/                         # Módulo principal para la administración de incidentes
│   │       ├── components/                    # Componentes internos y reutilizables del módulo
│   │       │   ├── incident-filter-priority/  # Filtros rápidos por criticidad
│   │       │   ├── incident-filter-status/    # Filtros de flujo de estado
│   │       │   ├── incident-modal-form/       # Formulario dinámico (Crear/Editar)
│   │       │   ├── incident-pagination/       # Control de paginado para grandes volúmenes
│   │       │   ├── incident-search/           # Barra de búsqueda global de incidentes
│   │       │   └── incident-table/            # Grilla principal de visualización de datos
│   │       ├── models/                        # Interfaces de TypeScript y tipado estricto de incidentes
│   │       ├── pages/                         # Componentes contenedores de ruta (Vistas principales)
│   │       ├── services/                      # Capa de datos y orquestación de llamadas HTTP
│   │       └── incidents.routes.ts            # Enrutamiento interno del módulo (Lazy Loading)
│   ├── layout/                                # Componentes de estructura global (Header, Sidebar, Footer)
│   └── shared/                                # Elementos transversales libres de estado (Pipes, Directivas)
│   └── environments/                          # Configuración de entornos (Desarrollo / Producción)
│   └── main.ts                                # Punto de entrada de la aplicación (Bootstrap Standalone)
├── angular.json
├── package.json
└── README.md
```

---

## 🔐 Sistema de Autenticación (Login Mock)

Este proyecto utiliza un sistema de autenticación basado en **HTTP** y **Fake JWT** para simular el comportamiento del backend durante la etapa de desarrollo. La API de autenticación se gestiona localmente mediante **Mockoon**.

### 🛠️ Configuración del Entorno de Mock (Mockoon)

Para que el login funcione correctamente, es necesario levantar el servidor local de Mockoon con la configuración del proyecto.

#### 1. Instalación de Mockoon
Descarga e instala la aplicación según tu sistema operativo:
* **Sitio oficial:** [https://mockoon.com](https://mockoon.com)
* **Instalación rápida por comando:**
  * **Windows (Winget):** `winget install mockoon`
  * **Mac (Homebrew):** `brew install --cask mockoon`
  * **Linux (Snap):** `sudo snap install mockoon`

#### 2. Importar el archivo de configuración
El entorno de la API falsa se encuentra en la raíz de este proyecto.
1. Abre **Mockoon**.
2. Ve a `File` > `Import/export` > `Mockoon's format` > `Import from a file (JSON)`.
3. Selecciona el archivo de configuración ubicado en: `.mock/angular-test.json`.
4. Haz clic en el botón de **Play (Start server)** en la esquina superior izquierda.

La API correrá por defecto en `http://localhost:3000`.

### 🚀 Flujo de Inicio de Sesión (Angular)

Al iniciar la aplicación, la primera pantalla visible es la ruta de login (`/login`).

#### 📧 Usuarios y Roles Permitidos
El sistema realiza una **validación estricta por correo electrónico**. Solo se permite el acceso a los siguientes usuarios:

| Correo Electrónico           | Rol Asociado  | Descripción                          |
| :--------------------------- | :------------ | :----------------------------------- |
| **`admin@ias.com.co`**       | `admin`       | Administrador total del sistema      |
| **`soporte@ias.com.co`**     | `soporte`     | Usuario técnico de soporte           |
| **`solicitante@ias.com.co`** | `solicitante` | Usuario final que genera solicitudes |

*Cualquier otro correo ingresado será rechazado por el formulario o el servicio de autenticación.*

### 💾 Persistencia de la Sesión (`localStorage`)

- **Sesión Activa:** Al loguearse con éxito, el token Fake JWT y los datos del usuario se guardan en el `localStorage`. El usuario permanecerá autenticado de forma indefinida, incluso si recarga la página.
- **Retorno al Login:** El usuario será redirigido a `/login` si presiona el botón de **Cerrar Sesión (Logout)** o si borra manualmente el almacenamiento local del navegador.

---

## 🎯 Buenas Prácticas y Decisiones de Diseño

- **Angular Signals:** Implementado para una gestión de estado reactiva, eficiente y síncrona en la UI, reduciendo la necesidad de suscripciones manuales de RxJS en componentes visuales.
- **Componentes Standalone:** Se prescinde por completo de `NgModules` para lograr un diseño modular, cargas más rápidas mediante *lazy loading* y un árbol de dependencias más limpio.
- **Guards e Interceptores Funcionales:** Migración a las nuevas API funcionales de Angular para un código más ligero, legible y fácil de testear.
- **Control de Roles:** La aplicación restringe vistas y acciones específicas dinámicamente según el rol almacenado en el token simulado.

---


## 🎯 Características Funcionales del Módulo de Incidentes

El módulo de incidentes provee un ciclo completo de administración de casos (CRUD completo) diseñado para operar de manera reactiva:

- **Listado y Grilla Dinámica (`incident-table`):** Presentación organizada de incidentes con soporte para paginación controlada local o remotamente.
- **Búsqueda Indexada (`incident-search`):** Filtrado por texto libre para localizar incidentes velozmente.
- **Filtrado Avanzado Segmentado:** Controles dedicados para acotar incidentes por Prioridad (`incident-filter-priority`) y Estado (`incident-filter-status`).
- **Formulario Polimórfico Integrado (`incident-modal-form`):** Interfaz unificada mediante ventanas modales que resuelve de forma inteligente los flujos de creación (POST) y edición (PUT) reutilizando validaciones estrictas, aunque para la prueba técnica solo se actualiza localmente los valores del servicio, el servicio podría reactualizarse usando paginación desde el servidor y reload en los rxResource.

## 🔓 Matriz de Permisos y Control de Acceso (RBAC)

La aplicación implementa un control de acceso estricto por componentes y acciones en el módulo de incidentes, adaptando la interfaz dinámicamente según el rol extraído del usuario autenticado:

| **Rol (`role`)**  | **Ver Incidentes** | **Crear** | **Editar / Actualizar** | **Eliminar** | **Capacidades en la UI**                                                    |
| ----------------- | ------------------ | --------- | ----------------------- | ------------ | --------------------------------------------------------------------------- |
| **`admin`**       | 🌍 Todos            | Sí        | Sí                      | Sí           | Control total del sistema y gestión absoluta de incidentes.                 |
| **`soporte`**     | 🌍 Todos            | Sí        | ⚠️ Solo Estado           | No           | Puede gestionar el flujo del ticket, pero tiene prohibido borrar registros. |
| **`solicitante`** | 🔒 Propios          | Sí        | No                      | No           | Vista restringida a sus propios incidentes en modo de solo lectura.         |

#### 🛠️ Mecanismo de Seguridad en el Frontend
* **Filtrado Reactivo por Señales:** El servicio de incidentes intercepta de forma reactiva el rol actual del usuario. Si el usuario es `solicitante`, las peticiones y recursos (`rxResource`) se parametrizan automáticamente para listar únicamente los registros vinculados a su cuenta.
* **Protección de la UI:** Los botones de acción (Editar, Eliminar) dentro del componente `incident-modal-form` y los accesos del formulario modal se ocultan o deshabilitan usando bloques modernos `@if` evaluando directamente las señales de permisos del usuario o intermente en el servicio para desabilitar inputs el formulario.

## ⚡ Decisiones de Arquitectura y Tecnologías Modernas

Este proyecto se desmarca de arquitecturas tradicionales de Angular al adoptar primitivas modernas de rendimiento y reactividad:

- **Angular Signals & `rxResource`:** Toda la comunicación asíncrona con los mocks de Mockoon aprovecha la nueva API `rxResource`. Esto permite mapear peticiones HTTP directamente a señales reactivas nativas, eliminando la gestión manual de suscripciones de RxJS y simplificando el ciclo de vida de los datos en los componentes.
- **Flujo de Control Moderno (`@if`, `@for`):** Optimización del renderizado en las plantillas HTML reemplazando directivas heredadas (`*ngIf`, `*ngFor`) por bloques sintácticos nativos mucho más eficientes y legibles.
- **Vitest Nativo:** Suite de pruebas unitarias migrada a la configuración moderna y veloz de Angular, utilizando **Vitest** en sustitución de Karma, agilizando drásticamente los tiempos de ejecución en desarrollo local (`ng test`).
- **Planificación del Dashboard:** La arquitectura incluye el espacio modular para el Dashboard de analíticas. Este se encuentra estructurado y listo para integrarse con la misma reactividad basada en señales una vez se completen las especificaciones de negocio del backend.


## ✒️ Autor

- **Santiago Castrillón Sánchez** - [GitHub](https://github.com/santidevias)
