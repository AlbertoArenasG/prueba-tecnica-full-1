# Aplicación de Análisis de Campañas Publicitarias

## Instrucciones
1. Crea un repositorio publico en tu cuenta de github.
2. Proveer instrucciones para instalar y levantar en ambiente local la APP

La evaluación tendra la siguiente forma:

* Back End: 35%
* Front End: 35%
* Estructura y legilibilidad del código, incluyendo el uso de buenas prácticas: 30%
* Bonus points: 20% extra (10% unit tests, 10% deployment en la nube)

## Objetivo
Sobre este este esqueleto, construir un API HTTP y una interfaz de aplicación para visualizar y analizar datos de campañas publicitarias.

## Funcionalidades Principales

### Vista Principal de Campañas
- Tabla con todas las campañas publicitarias
- Información detallada: nombre, tipo, fechas, impactos y alcance
- Paginación de resultados (5 elementos por página) directamente desde el backend (`/campaigns?page=1&limit=5`)

### Sistema de Filtros
- **Por Tipo de Campaña:** (parámetro `tipo_campania` aceptando `mensual` o `catorcenal`)
- **Navegación:** (parámetros `page` 1-indexado y `limit` para controlar la paginación)
- **Rango de Fechas:** endpoint `/campaigns/search-by-date?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD&page=1&limit=5`
- **Por Rango de Fechas:**
  - Búsqueda de campañas activas en períodos específicos

### Visualización Detallada
Al seleccionar una campaña, se pueden ver:

1. **Resumen de Sitios**
   - Ventana con gráficas de resumen de sitios
   - Datos desde `bd_campanias_sitios.csv` y el endpoint `/campaigns/{id}` (campo `site_summary`)

2. **Resumen de Períodos**
   - Ventana con gráficas de desempeño por período
   - Datos desde `bd_campanias_periodos.csv` y el endpoint `/campaigns/{id}` (`periods` + `period_summary`)

3. **Resumen de Campaña**
   - Ventana con gráficas de resumen general
   - Datos desde `bd_campanias_agrupado.csv` y el endpoint `/campaigns/{id}` (`general_summary`)

## Stack Tecnológico

### Backend

#### FastAPI (Python)
- Framework web moderno y rápido
- Validación automática con Pydantic
- Documentación automática (Swagger/OpenAPI)
- Soporte asíncrono

#### SQLAlchemy
- ORM para Python
- Manejo de base de datos
- Modelado de datos

#### Uvicorn
- Servidor ASGI para Python
- Alto rendimiento
- Hot-reload en desarrollo

### Frontend

#### React con TypeScript
- Framework UI
- Tipado estático
- Componentes funcionales y hooks

#### Bibliotecas React
- `@tanstack/react-table`: Manejo de tablas
- `react-hook-form`: Gestión de formularios
- `zod`: Validación de esquemas
- `axios`: Cliente HTTP

#### Vite
- Bundler y herramienta de desarrollo
- Hot Module Replacement (HMR)
- Configuración mínima

#### CSS
- Estilos modulares
- Diseño responsive

## Arquitectura

Sigue un patrón cliente-servidor:
- Backend: API REST
- Frontend: Interfaz de usuario
- Comunicación: HTTP/JSON
- Separación clara de responsabilidades

## Estructura de Datos

### Archivos CSV
- `bd_campanias_agrupado.csv`: Datos generales de campañas
- `bd_campanias_periodos.csv`: Información por períodos
- `bd_campanias_sitios.csv`: Detalles de sitios publicitarios que componen las campañas

## Puesta en Marcha con Docker
1. **Requisitos**: Docker Desktop (o Docker Engine) con soporte para `docker compose`.
2. **Construir e iniciar**:
   ```bash
   docker compose up --build
   ```
   El contenedor del backend leerá los CSV montados en `backend/data`, sembrará la base SQLite (volumen `backend-db`) y expondrá la API en `http://localhost:8080`. El frontend quedará disponible en `http://localhost:4173`.
3. **Re-sembrar datos manualmente** (opcional):  
   ```bash
   docker compose run --rm backend python seed.py
   ```
   Útil cuando se quieran refrescar los datos sin reconstruir imágenes.
