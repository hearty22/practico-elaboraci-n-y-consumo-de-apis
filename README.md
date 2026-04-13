# Aplicación Full-Stack de Gestión de Tareas

Una aplicación full-stack simple pero potente para gestionar tareas, construida con un stack de tecnología moderno. El proyecto está estructurado como un monorepo con un frontend y un backend separados.

## Tecnologías Utilizadas

### Frontend
- **Framework**: React 18
- **Lenguaje**: TypeScript
- **UI Kit**: Material Tailwind
- **Herramienta de Build**: Vite
- **Enrutamiento**: React Router

### Backend
- **Framework**: Fastify
- **Lenguaje**: TypeScript
- **Base de Datos**: MongoDB (con Mongoose)
- **Autenticación**: JWT (JSON Web Tokens)
- **Validación de Esquemas**: Zod

## Estructura del Proyecto

El repositorio está organizado en dos directorios principales:

- **/frontend**: Contiene la aplicación cliente completa de React.
- **/backend**: Contiene el servidor de Fastify, la lógica de la API y la conexión a la base de datos.

## Cómo Empezar

Sigue estas instrucciones para tener el proyecto funcionando en tu máquina local.

### Prerrequisitos

- Node.js (v18 o superior recomendado)
- npm (o tu gestor de paquetes preferido)
- Una instancia de MongoDB en ejecución (local o en la nube)

### 1. Clonar el Repositorio

```bash
git clone <url-de-tu-repositorio>
cd Practicas
```

### 2. Configurar el Backend

Primero, configura el servidor backend.

```bash
cd backend
```

**Instalar dependencias:**
```bash
npm install
```

**Crear el archivo de entorno:**
Duplica el archivo `.env.example` y renómbralo a `.env`.
```bash
cp .env.example .env
```

**Actualiza las variables de entorno** en el archivo `.env` con tu configuración específica, especialmente tu cadena de conexión de MongoDB y el secreto de JWT.
```
DATABASE_URL="tu_cadena_de_conexion_mongodb"
JWT_SECRET="tu_clave_secreta_super_secreta_para_jwt"
CORS_ORIGIN="http://localhost:5173"
```

**Ejecutar el servidor backend:**
```bash
npm run dev
```
El servidor se iniciará en `http://localhost:3003` por defecto.

### 3. Configurar el Frontend

En una nueva terminal, configura el cliente de React.

```bash
cd ../frontend
```

**Instalar dependencias:**
Se recomienda usar la bandera `--legacy-peer-deps` para evitar posibles conflictos de dependencias.
```bash
npm install --legacy-peer-deps
```

**Crear el archivo de entorno:**
Crea un archivo `.env` en el directorio `frontend` con el siguiente contenido:
```
VITE_API_URL=http://localhost:3003/api
```

**Ejecutar el servidor de desarrollo del frontend:**
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`.