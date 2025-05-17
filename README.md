# 🌦️ Weather Subscription API

A NestJS-based API for managing weather subscriptions, providing weather data via external API integration and enabling user-defined update frequencies per city.

---

## 📦 Features

- ✅ Subscribe to weather updates by email and city.
- 🔁 Choose update frequency: `hourly` or `daily`.
- 🌐 Integration with [WeatherAPI.com](https://www.weatherapi.com/) for live weather data.
- 📊 PostgreSQL with TypeORM.
- 🧪 Unit tested using Jest.

---

## 🚀 Technologies

- **NestJS**
- **PostgreSQL**
- **TypeORM**
- **Swagger (OpenAPI)**
- **Docker & Docker Compose**
- **Jest**

---

## ⚙️ Environment Variables

Create a `.env` file in the root:

```env
WEATHER_API_KEY=your_weatherapi_key_here
PORT=your_server_port_here

POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
```

## How to run

to run this application through Docker you need to run this command:

```bash
docker-compose up --build
```

## 📚 API Docs

Once the server is running, access Swagger UI at:

```bash
http://localhost:{your_server_port}/docs
```
