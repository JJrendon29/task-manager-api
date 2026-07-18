# Task Manager API

REST API para gestión de tareas personales construida con FastAPI, PostgreSQL y Docker.

## Stack

- **FastAPI** — Framework web moderno con documentación automática
- **PostgreSQL** — Base de datos relacional
- **Docker + Docker Compose** — Containerización y orquestación local
- **JWT** — Autenticación stateless con tokens
- **pytest** — Suite de tests automatizados
- **GitHub Actions** — CI/CD con tests antes de cada deploy

## Arquitectura

```
Cliente HTTP
     ↓
FastAPI (Uvicorn, 2 workers)
     ↓
PostgreSQL (persistencia)
```

## Endpoints

### Autenticación
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/register` | Crear cuenta |
| POST | `/auth/login` | Obtener token JWT |

### Tareas (requieren autenticación)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/tasks/` | Listar tareas con paginación y filtros |
| POST | `/tasks/` | Crear tarea |
| GET | `/tasks/{id}` | Obtener tarea por ID |
| PATCH | `/tasks/{id}` | Actualizar tarea |
| DELETE | `/tasks/{id}` | Eliminar tarea |

## Correr el proyecto

**Requisitos:** Docker y Docker Compose instalados.

```bash
# 1. Clonar el repositorio
git clone git@github.com:JJrendon29/task-manager-api.git
cd task-manager-api

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 3. Levantar los servicios
docker compose up -d --build

# 4. Verificar que funciona
curl http://localhost:8001/health
```

## Correr los tests

```bash
docker compose exec api pytest tests/ -v
```

## Uso de la API

**Registrar usuario:**
```bash
curl -X POST http://localhost:8001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@example.com", "password": "password123"}'
```

**Hacer login:**
```bash
curl -X POST http://localhost:8001/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=usuario@example.com&password=password123"
```

**Crear tarea:**
```bash
curl -X POST http://localhost:8001/tasks/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{"title": "Mi tarea", "description": "Descripción opcional"}'
```

**Filtrar tareas por estado:**
```bash
curl "http://localhost:8001/tasks/?status=pending" \
  -H "Authorization: Bearer TU_TOKEN"
```

## Estructura del proyecto

```
task-manager-api/
├── app/
│   ├── models/      # Modelos de base de datos
│   ├── schemas/     # Schemas de validación
│   ├── routers/     # Endpoints de la API
│   ├── auth.py      # Lógica de autenticación JWT
│   ├── config.py    # Configuración centralizada
│   ├── database.py  # Conexión a PostgreSQL
│   └── main.py      # Punto de entrada
├── tests/           # Suite de tests con pytest
├── .github/
│   └── workflows/   # Pipeline CI/CD
├── Dockerfile
├── docker-compose.yml
└── requirements.txt
```

## CI/CD

Cada push a `main` ejecuta automáticamente:

1. Tests con pytest — si alguno falla, el deploy no procede
2. Deploy con Docker Compose

Pipeline configurado con GitHub Actions y self-hosted runner.
