# Backlog del Proyecto & Plan de Entrega

## Plan de Alto Nivel (ejecución ordenada)
1. **Dockerizar el backend** – definir Dockerfile Python/FastAPI con comando productivo y ruta a la base de datos tomada de variables de entorno.
2. **Dockerizar el frontend** – crear Dockerfile Node/Vite (etapas dev + prod) y alinear variables de entorno con la URL del backend.
3. **Orquestación con docker-compose** – stack que levante backend y frontend con red compartida y volúmenes para SQLite + carga de CSV.
4. **Ingesta y seed de datos** – estandarizar la carga desde los CSV provistos hacia SQLite (u otro motor ligero) y automatizarla dentro de los contenedores.
5. **API de listado de campañas** – implementar endpoint paginado `/campaigns` con filtros por tipo y estructura de respuesta consistente.
6. **API de búsqueda por fechas** – exponer `/campaigns/search-by-date` con validaciones, rangos inclusivos y manejo uniforme de fechas.
7. **Detalle y resúmenes de campaña** – enriquecer `/campaigns/{id}` (y rutas auxiliares si aplica) para entregar sitios, periodos y métricas agregadas para las tres ventanas de “Resumen”.
8. **Capa de datos del frontend** – cliente Axios, hooks tipados y manejo de estados que se conecten con la API.
9. **Tabla y paginación en frontend** – tabla con `@tanstack/react-table`, 5 elementos por página y navegación sincronizada con la paginación del backend.
10. **Filtros y vistas detalladas** – selector de tipo de campaña, formulario de rango de fechas con validación y modales/paneles con gráficas alimentadas por el backend.
11. **Pruebas y calidad** – pytest/FastAPI para modelo/endpoints, vitest o react-testing-library para UI y reglas de lint/formato.
12. **Documentación y despliegue** – README con pasos docker/manuales, documentación de la API y notas de despliegue opcional en la nube.

## Backlog
| ID | Área | Tarea | Detalles | Estado | Dependencias |
| --- | --- | --- | --- | --- | --- |
| B1 | DevOps | Dockerfile backend | Dockerfile listo para producción (multi-stage opcional) que ejecute FastAPI vía Uvicorn, instale dependencias desde `backend/requirements.txt`, exponga el puerto y monte volumen para `campaigns.db` y CSV. | [x] Completado | — |
| B2 | DevOps | Dockerfile frontend | Imagen Vite/React con caché de dependencias, paso de build y servidor liviano (p.ej. `vite preview` o `nginx`) configurado con la URL del backend mediante variables. | [x] Completado | B1 |
| B3 | DevOps | Configuración docker-compose | Servicios (backend, frontend, worker opcional), red compartida, archivos `.env`, bind mount del directorio CSV para el seed y comandos dev (`docker compose up`). | [x] Completado | B1-B2 |
| B4 | Datos | Automatizar seed de DB | Usar los CSV como fuente oficial; garantizar que el script se ejecute en el contenedor del backend, sea idempotente y documentar cómo refrescar los datos. | [x] Completado | B3 |
| B5 | Backend | API listado campañas | Ajustar `/campaigns`: paginación servidor (límite 5 por defecto), filtro `tipo_campania` opcional y metadatos (`total`, `page`, `pageSize`). | [x] Completado | B4 |
| B6 | Backend | Búsqueda por fechas | Fortalecer `/campaigns/search-by-date` con validación, parseo seguro y mejoras de rendimiento (índices). Responder con el mismo formato del listado. | [ ] Por hacer | B5 |
| B7 | Backend | Datos de detalle/resumen | Ampliar `/campaigns/{id}` (o rutas nuevas) para entregar los tres datasets de “Resumen” listos para gráficas y agregados útiles. | [ ] Por hacer | B5 |
| B8 | Frontend | Capa cliente API | Centralizar configuración Axios (base URL/env), modelos TS alineados con Pydantic, estados de carga/error y hooks para listar/buscar/detallar. | [ ] Por hacer | B5-B7 |
| B9 | Frontend | Tabla y paginación | Construir tabla con 5 filas por página, columnas requeridas y botones sincronizados con los metadatos de paginación. | [ ] Por hacer | B8 |
| B10 | Frontend | Filtros y búsqueda | Selector de tipo y formulario de rango de fechas usando `react-hook-form` + `zod`; integrar con la recarga del backend manteniendo los parámetros. | [ ] Por hacer | B8 |
| B11 | Frontend | Visualizaciones detalle | Panel/modal con resúmenes de sitios, periodos y campaña usando gráficas sencillas (D3/Recharts) alimentadas por el backend. | [ ] Por hacer | B7-B10 |
| B12 | Calidad | Pruebas y lint | Añadir pytest para CRUD/rutas, smoke tests del seed y vitest/react-testing-library para UI; hacer cumplir via scripts npm/pip y CI. | [ ] Por hacer | B5-B11 |
| B13 | Docs | README y despliegue | Documentar setup docker/manual, variables, flujo de seed y ruta sugerida para despliegue en la nube. | [ ] Por hacer | B1-B12 |
