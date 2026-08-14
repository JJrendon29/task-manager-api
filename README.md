# Task Manager API

REST API para gestion de tareas con autenticacion JWT, paginacion, filtros y suite de tests automatizados.

## Stack

- **FastAPI** — Framework web moderno con documentacion automatica
- **PostgreSQL** — Base de datos relacional
- **Docker + Docker Compose** — Contenedorizacion completa
- **JWT** — Autenticacion stateless con tokens
- **pytest** — Suite de tests automatizados
- **GitHub Actions** — CI/CD con self-hosted runner

## Arquitectura

```
Cliente HTTP
     ↓
FastAPI (Uvicorn, 2 workers)
     ↓
PostgreSQL (persistencia)
```

Cada usuario solo puede ver y modificar sus propias tareas. Los endpoints estan protegidos con JWT — sin token valido, la API devuelve 401.

## Endpoints

### Autenticacion
| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `POST` | `/auth/register` | Crear cuenta |
| `POST` | `/auth/login` | Obtener token JWT |

### Tareas (requieren autenticacion)
| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `/tasks/` | Listar tareas con paginacion y filtros |
| `POST` | `/tasks/` | Crear tarea |
| `GET` | `/tasks/{id}` | Obtener tarea por ID |
| `PATCH` | `/tasks/{id}` | Actualizar tarea |
| `DELETE` | `/tasks/{id}` | Eliminar tarea |

## Probarlo ahora

**Interfaz web con cuenta demo:**
```
https://tasks.homelab-rendon29.online
```

**Registrar usuario:**
```bash
curl -X POST https://tasks.homelab-rendon29.online/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@example.com", "password": "password123"}'
```

**Hacer login:**
```bash
curl -X POST https://tasks.homelab-rendon29.online/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=usuario@example.com&password=password123"
```

**Crear tarea:**
```bash
curl -X POST https://tasks.homelab-rendon29.online/tasks/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{"title": "Mi tarea"}'
```

**Filtrar tareas por estado:**
```bash
curl "https://tasks.homelab-rendon29.online/tasks/?status=pending" \
  -H "Authorization: Bearer TU_TOKEN"
```

**Documentacion interactiva:**
```
https://tasks.homelab-rendon29.online/docs
```

## Correr localmente

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

## Tests

```bash
docker compose exec api pytest tests/ -v
```

9 tests cubriendo autenticacion y operaciones CRUD completas.

## Estructura

```
task-manager-api/
├── app/
│   ├── models/      # Modelos de base de datos
│   ├── schemas/     # Schemas de validacion
│   ├── routers/     # Endpoints de la API
│   ├── auth.py      # Logica de autenticacion JWT
│   ├── config.py    # Configuracion centralizada
│   ├── database.py  # Conexion a PostgreSQL
│   └── main.py      # Punto de entrada
├── static/          # Interfaz web con cuenta demo
├── tests/           # Suite de tests con pytest
├── .github/
│   └── workflows/   # Pipeline CI/CD
├── Dockerfile
├── docker-compose.yml
└── requirements.txt
```

## CI/CD

Cada push a `main` ejecuta automaticamente:

1. Tests con pytest — si alguno falla, el deploy no procede
2. Deploy con Docker Compose

Pipeline configurado con GitHub Actions y self-hosted runner.
