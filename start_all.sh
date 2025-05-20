echo "Construyendo y levantando servicios..."
docker-compose up -d --build

echo "Esperando 10 segundos a que MongoDB y RabbitMQ estén listos..."
sleep 10

echo "Iniciando worker de texto..."
docker exec -d notihelp-app node workers/textWorker.js

echo "Iniciando worker de imagen..."
docker exec -d notihelp-app node workers/imageWorker.js

echo "Iniciando worker de integración de resultados..."
docker exec -d notihelp-app node workers/resultWorker.js

echo "Todos los workers fueron iniciados correctamente."
