# Backend-products

Este proyecto es una API REST sencilla para gestionar productos, con autenticación mediante JWT.

## Requisitos Previos

Asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (recomendado: 18.x o superior)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/) (opcional, para clonar el repositorio)

## Instrucciones para ejecutar el backend

1. Clona el repositorio:

git clone https://github.com/SEnriquezA/Backend-products.git
cd Backend-products

Instala las dependencias:

npm install

Ejecuta la aplicación:

npm start

CRUD de Productos

GET /products - Obtener todos los productos

GET /products/:id - Obtener producto por ID

POST /products - Crear un producto

PUT /products/:id - Actualizar un producto

DELETE /products/:id - Eliminar un producto (requiere token JWT)
