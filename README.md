# Koywe Challenge - Api de Cotizaciones #Reto

API de Cotización de divisas, incluye una capa de autenticación y los servicios de poder crear y ver tu cotización y ademas ver el listado de monedas disponibles para cotizar.

---

## 🚀 Tecnologías
- [Nestjs](https://docs.nestjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Docker](https://www.docker.com/products/docker-desktop/)
- [Postman](https://www.postman.com/)

## 📋 Requisitos
- Node.js v18
- Docker
- Docker Compose
- Mongo Compass


## ⚙️ Configuración

### Variables de entorno

.env.docker (modo producción)

```bash
DB_URL=mongodb://mongodb:27017/koywe-challenge
PORT=3000
SECRET_JWT=koywe_123
EXPIRATION_MIN=5
BASE_URL_API_CURRENCY=https://api.exchange.cryptomkt.com/api/3
API_CURRENCY_SERVICE_GET_PRICE=/public/price/rate
API_CURRENCY_SERVICE_GET_CURRENCY='/public/currency'
```

.env (modo desarrollador)

```bash
DB_URL=mongodb://localhost:27018/koywe-challenge
PORT=3000
SECRET_JWT=koywe_123
EXPIRATION_MIN=5
BASE_URL_API_CURRENCY=https://api.exchange.cryptomkt.com/api/3
API_CURRENCY_SERVICE_GET_PRICE=/public/price/rate
API_CURRENCY_SERVICE_GET_CURRENCY='/public/currency'
```

##  🚀 Ejecución

###  Modo producción
```bash
# Clonar repositorio
git clone https://github.com/xFernandoc/koywe-challenge
cd koywe-challenge

# Iniciar docker y probar
docker compose up --build
```

#### 💡 El sevidor backend estará disponible en el puerto 3004

###  Modo desarrollador

```bash
# Clonar repositorio
git clone https://github.com/xFernandoc/koywe-challenge
cd koywe-challenge

# Instalar dependencias
npm install

# Ejecución del proyecto
npm run start:dev

```
#### 💡 El sevidor backend estará disponible en el puerto 3000

##  📚 Pasos para ejecutar
1. Crea tu entorno según tu ejecución
2. Ejecuta según lo que deseas, en modo producción usaras docker y en desarollo deberás ejecutar con nodejs
3. Ejecuta los endpoints en algun software de pruebas como `Postman`

## 💡 Notas adicionales
* Usa `docker compose ps` para saber si tus contenedores están activos
* Usa `docker compose down` para apagar todos tus contenedores

## 👨‍💻 Autor
Luis Colchón - [xFernandoc](https://github.com/xFernandoc)