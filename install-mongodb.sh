#!/bin/bash

echo "Limpiando intentos anteriores..."
sudo rm -f /etc/apt/sources.list.d/mongodb*.list

echo "Añadiendo clave GPG..."
curl -fsSL https://pgp.mongodb.com/server-6.0.asc | \
  sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg --dearmor

echo "Configurando repositorio para Ubuntu noble..."
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/6.0 multiverse" | \
  sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list > /dev/null

echo "Actualizando lista de paquetes..."
sudo apt update

echo "Instalando MongoDB..."
sudo apt install -y mongodb-org

echo "Iniciando y habilitando MongoDB..."
sudo systemctl start mongod
sudo systemctl enable mongod

echo "MongoDB instalado y corriendo"
