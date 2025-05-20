
# NotiHelp - Sistema Distribuido de Análisis de Noticias

NotiHelp es una plataforma que permite analizar automáticamente noticias enviadas por los usuarios. El sistema utiliza procesamiento distribuido con RabbitMQ y análisis de texto e imagen mediante inteligencia artificial.

## 🧩 Tecnologías utilizadas

- Node.js
- Express
- MongoDB
- RabbitMQ
- Hugging Face (para análisis de texto con IA)
- Sharp + Crypto (para análisis de imágenes)
- Docker y Docker Compose

---

## 🚀 ¿Cómo ejecutar el proyecto?

### 1. Clona o descomprime el repositorio

```bash
cd NotiHelp
```

### 2. Agrega tu token de Hugging Face

Abre `workers/textWorker.js` y reemplaza:

```js
const HF_TOKEN = 'hf_pon_aqui_tu_token_real';
```

por tu token personal desde [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)

---

### 3. Construye y levanta los contenedores

```bash
docker-compose up --build -d
```

Este comando levantará:
- `notihelp-app`: el backend + workers
- `mongo`: base de datos MongoDB
- `rabbitmq`: sistema de colas con interfaz web en el puerto `15672`

---

### 4. Ejecuta los workers

En tres terminales separadas, ejecuta:

```bash
docker exec -it notihelp-app node workers/textWorker.js
docker exec -it notihelp-app node workers/imageWorker.js
docker exec -it notihelp-app node workers/resultWorker.js
```

---

## 🌐 Interfaz Web

Abre en tu navegador:

- [http://localhost:3000/](http://localhost:3000/) → Página principal
- [http://localhost:3000/news/form](http://localhost:3000/news/form) → Enviar nueva noticia
- [http://localhost:3000/news](http://localhost:3000/news) → Ver noticias analizadas

---

## 📦 Estructura del proyecto

```
NotiHelp/
├── workers/               # Workers de texto, imagen y consolidación
├── routes/                # Rutas Express
├── controllers/           # Controladores de lógica
├── models/                # Esquema de noticias
├── data/                  # Conexión Mongo con reintentos
├── public/                # HTMLs de interfaz
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## ✅ Estado actual

- Noticias analizadas con IA real (texto e imagen)
- Guardado persistente en MongoDB
- Página para enviar y ver resultados
- Sistema distribuido y tolerante a errores

--- 

Desarrollado por Harold Nicolás Rodríguez Medina.
