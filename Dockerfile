# Imagen base
FROM python:3.11-slim

# Directorio de trabajo
WORKDIR /app

# Copiamos dependencias primero para aprovechar el caché de Docker
COPY requirements.txt .

# Instalamos dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos el resto del código
COPY . .

# Puerto que expone la app
EXPOSE 8000

# Comando de producción
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
