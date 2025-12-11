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

## Puesta en marcha

### Requisitos
- Docker Desktop o Docker Engine con soporte para `docker compose`.
- Node.js 20+ (sólo si deseas ejecutar el frontend sin contenedores).
- Python 3.11+ y `pip` (sólo si deseas ejecutar el backend sin contenedores).

### Variables de entorno clave
| Servicio  | Variable        | Descripción                                                     | Valor por defecto |
|-----------|-----------------|-----------------------------------------------------------------|-------------------|
| Backend   | `DATABASE_URL`  | Ruta al archivo SQLite usado por FastAPI                        | `sqlite:///./campaigns.db` (en docker se sustituye por `sqlite:////data/campaigns.db`) |
| Backend   | `DATA_DIR`      | Directorio con los CSV que alimentan el seed                    | `./data`          |
| Frontend  | `VITE_API_URL`  | URL del backend consumida por Axios                             | `http://localhost:8080` |

> En `docker-compose.yml` estas variables ya están definidas para ambos servicios. Si corres el proyecto manualmente, exporta las mismas variables en tu terminal.

### Ejecución con Docker (recomendada)
1. Construir e iniciar los servicios:
   ```bash
   docker compose up --build
   ```
   - Backend FastAPI disponible en `http://localhost:8080`.
   - Frontend Vite (modo dev) sirviendo en `http://localhost:4173`.
   - El script `seed.py` se ejecuta automáticamente al iniciar el contenedor del backend; los CSV se montan como read-only y la base SQLite vive en el volumen `backend-db`.
2. Refrescar datos manualmente (opcional):
   ```bash
   docker compose run --rm backend python seed.py
   ```
3. Detener los servicios:
   ```bash
   docker compose down
   ```

### Ejecución manual (sin Docker)
#### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate          # .venv\Scripts\activate en Windows
pip install -r requirements.txt
export DATABASE_URL=sqlite:///./campaigns.db
export DATA_DIR=./data
python seed.py                     # Inicializa campaigns.db desde los CSV
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
La API quedará disponible en `http://localhost:8000`.

#### Frontend
```bash
cd frontend
npm install
export VITE_API_URL=http://localhost:8080
npm run dev -- --host 0.0.0.0 --port 4173
```
La aplicación quedará en `http://localhost:4173`. Ajusta `VITE_API_URL` si el backend corre en otra dirección.

## Pruebas automatizadas
- **Frontend (Vitest + Testing Library)**:
  ```bash
  cd frontend
  npm test
  ```
- **Backend (pytest dentro del contenedor)**:
  ```bash
  docker compose run --rm backend pytest tests
  ```
  Esto levanta una base SQLite aislada (`test.db`) gracias a la configuración en `tests/conftest.py`.

## Endpoints principales
| Método | Ruta                          | Descripción                                    |
|--------|-------------------------------|------------------------------------------------|
| GET    | `/campaigns`                  | Listado paginado con filtro `tipo_campania`.   |
| GET    | `/campaigns/search-by-date`   | Búsqueda por rango de fechas + paginación.     |
| GET    | `/campaigns/{id}`             | Detalle con resúmenes de sitios, periodos y KPIs. |
| GET    | `/health`                     | Health-check sencillo.                         |

Ejemplo de cURL para filtros paginados:
```bash
curl "http://localhost:8080/campaigns?page=1&limit=5&tipo_campania=mensual"
```
Ejemplo de búsqueda por fecha:
```bash
curl "http://localhost:8080/campaigns/search-by-date?start_date=2025-01-01&end_date=2025-06-30&page=1&limit=5"
```

## Notas de despliegue
- El backend es stateless; sólo requiere acceso de lectura a los CSV y un volumen persistente para `campaigns.db`. En la nube se puede usar un volumen administrado (EBS, Azure Disk, etc.) o migrar la DB a un servicio gestionado.
- El frontend es una app Vite/React en modo dev dentro del compose. Para producción se puede ejecutar `npm run build` y servir el contenido estático con Nginx, Vercel o cualquier CDN, ajustando `VITE_API_URL` al dominio del backend.
- Para pipelines CI/CD, se recomienda correr `npm run lint`, `npm test` y `docker compose run --rm backend pytest tests` antes de crear la imagen final.

## Flujo recomendado de verificación
1. `docker compose up --build` para levantar todo.
2. Sembrar datos adicionales si es necesario (`docker compose run --rm backend python seed.py`).
3. Ejecutar las suites de pruebas (frontend + backend).
4. Navegar a `http://localhost:4173`, aplicar filtros de tipo y fechas, abrir el modal de detalle y verificar datos con los endpoints de arriba usando cURL o herramientas como Postman.
