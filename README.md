# Aplicación para Gestión de Incidentes

> Aplicación web desarrollada en Angular para el registro, seguimiento y administración eficiente de incidentes.

---

## 🛠️ Stack Tecnológico Planificado

- **Framework & Core:** Angular 20, TypeScript (Strict Mode)
- **Arquitectura & Estado:** Componentes Standalone, Angular Signals, RxJS
- **Navegación & Seguridad:** Angular Router, Guards funcionales
- **Comunicación HTTP:** HttpClient, Interceptores funcionales
- **Formularios:** Reactive Forms
- **Estilos & Maquetación:** HTML semántico, CSS y SCSS
- **Pruebas & Calidad:** Pruebas unitarias, ESLint
- **Control de Versiones:** Git
- **API Mock / Backend:** Mockoon

---

## 🚀 Requisitos Previos

Asegúrate de contar con las siguientes herramientas instaladas localmente antes de ejecutar el proyecto:

- [Node.js](https://nodejs.org/) (Versión recomendada según compatibilidad de Angular 20+)
- [npm](https://www.npmjs.com/)
- [Angular CLI](https://angular.dev/tools/cli) (Versión 20 o superior)
- [Mockoon](https://mockoon.com/) (Para la simulación de servicios REST)
- [Tailwind](https://tailwindcss.com/) (Para los estilos y mantener el HTML semántico versión v3)

---

## ⚙️ Instalación y Configuración

Sigue estos pasos para clonar e inicializar el entorno de desarrollo:

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/santidevias/incident-manager](https://github.com/santidevias/incident-manager)
   cd incident-manager
   ```

2. **Asegurar rama de trabajo**
   ```bash
   git checkout master
   ```

3. **Instalar dependencias**
   ```bash
   npm install
   ```

4. **Ejecutar el servidor de desarrollo**
   ```bash
   ng serve
   ```

5. **Asegurar rama de trabajo**
   ```bash
   git checkout master

## 🧪 Ejecución de Pruebas Unitarias

Para ejecutar el conjunto de pruebas unitarias de la aplicación:

   ```bash
   ng test
  ```

# 🔐 Sistema de Autenticación (Login Mock)

Este proyecto utiliza un sistema de autenticación basado en **HTTP** y **Fake JWT** para simular el comportamiento del backend durante la etapa de desarrollo. La API de autenticación se gestiona localmente mediante **Mockoon**.

---

## 🛠️ Configuración del Entorno de Mock (Mockoon)

Para que el login funcione correctamente, es necesario levantar el servidor local de Mockoon con la configuración del proyecto.

### 1. Instalación de Mockoon
Descarga e instala la aplicación según tu sistema operativo:
* **Sitio oficial:** [https://mockoon.com](https://mockoon.com)
* **Instalación rápida por comando:**
  * **Windows (Winget):** `winget install mockoon`
  * **Mac (Homebrew):** `brew install --cask mockoon`
  * **Linux (Snap):** `sudo snap install mockoon`

### 2. Importar el archivo de configuración
El entorno de la API falsa se encuentra en la raíz de este proyecto.
1. Abre **Mockoon**.
2. Ve a `File` > `Import/export` > `Mockoon's format` > `Import from a file (JSON)`.
3. Selecciona el archivo de configuración ubicado en: `.mock/angular-test.json`.
4. Haz clic en el botón de **Play (Start server)** en la esquina superior izquierda. La API correrá por defecto en `http://localhost:3000`.

---

## 🚀 Flujo de Inicio de Sesión (Angular)

Al iniciar la aplicación, la primera pantalla visible es la ruta de login (`/login`).

### 📧 Usuarios y Roles Permitidos
El sistema no valida contraseñas (esta lógica corresponde al backend real). Sin embargo, realiza una **validación estricta por correo electrónico**. Solo se permite el acceso a los siguientes tres usuarios:

| Correo Electrónico           | Rol Asociado  | Descripción                          |
| :--------------------------- | :------------ | :----------------------------------- |
| **`admin@ias.com.co`**       | `admin`       | Administrador total del sistema      |
| **`soporte@ias.com.co`**     | `soporte`     | Usuario técnico de soporte           |
| **`solicitante@ias.com.co`** | `solicitante` | Usuario final que genera solicitudes |

*Cualquier otro correo ingresado será rechazado por el formulario o el servicio de autenticación.*

---

## 💾 Persistencia de la Sesión (`localStorage`)

El estado de la sesión se maneja directamente en el navegador de la siguiente manera:

* **Sesión Activa:** Al loguearse con éxito, el token Fake JWT y los datos del usuario se guardan en el `localStorage`. Mientras estos datos existan, el usuario permanecerá autenticado de forma indefinida, incluso si recarga la página o cierra la pestaña.
* **Retorno al Login:** El usuario será redirigido a la pantalla de `/login` únicamente bajo dos condiciones:
  1. Si presiona explícitamente el botón de **Cerrar Sesión (Logout)**, el cual limpia el `localStorage`.
  2. Si el usuario **borra manualmente el almacenamiento del navegador** (caché / Application Store) desde las herramientas de desarrollador.

## ✒️ Autor
- Santiago Castrillón Sánchez

