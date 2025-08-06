# Driver Matching API

A backend microservice for real-time assignment of drivers to incoming delivery or ride-hailing orders based on proximity, driver availability, and matching rules.

## 🚀 Features

* Geospatial driver-order matching using the Haversine formula
* Asynchronous job processing via BullMQ (Redis Queue)
* Real-time driver availability management with Redis
* Modular and scalable codebase using NestJS
* Prisma ORM with MySQL support
* WebSocket-ready architecture for real-time updates (optional)
* Scoring logic for best-match driver selection

---

## 🧠 Core Concepts

* **Order Matching**: Orders are matched to the closest available drivers based on geolocation and last active time.
* **Atomicity**: Prevents race conditions using Redis `SPOP` to atomically select and assign drivers.
* **Real-Time State**: Driver locations and availability are stored in Redis.

---

## 📦 Tech Stack

| Tech    | Purpose                        |
| ------- | ------------------------------ |
| NestJS  | Backend framework              |
| Prisma  | ORM for MySQL                  |
| Redis   | In-memory store (driver state) |
| BullMQ  | Job queue for async matching   |
| ioredis | Redis client for Node.js       |
| Jest    | Unit & integration tests       |

---

## 📁 Project Structure

```bash
src/
├── matching/              # Matching logic & services
├── orders/                # Order-related logic
├── drivers/               # Driver location & Redis logic
├── prisma/                # Prisma client and schema
└── main.ts                # App entry point
```

---

## 🧪 Setup & Installation

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/driver-matching-api.git
cd driver-matching-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file with the following:

```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/driver_matching"
REDIS_URL="redis://localhost:6379"
```

### 4. Prisma Setup

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Start the App

```bash
npm run start:dev
```

---

## 🔁 Order Lifecycle

```
pending → matched → accepted → in_transit → completed
                ↘ rejected (then retry)
```

---

## 📌 API Endpoints

| Method | Route                       | Description                         |
| ------ | --------------------------- | ----------------------------------- |
| POST   | `/orders`                   | Create a new order                  |
| POST   | `/drivers/availability`     | Set driver as available/unavailable |
| GET    | `/drivers/nearby`           | Debug available drivers             |
| POST   | `/matching/assign/:orderId` | Match order with best driver        |
| PATCH  | `/orders/:id/status`        | Update order status                 |

---

## 🧮 Matching Algorithm

### Scoring Model

```
score = distance * 0.6 + idleTime * 0.4
```

### Distance Calculation

Using the Haversine formula to calculate kilometers between driver and pickup location.

### Atomic Assignment

Driver IDs are stored in a Redis set (`drivers:available`). When an order comes in:

1. We use `SPOP` to pop a single driver atomically.
2. Validate that the driver has location and is available.
3. Assign the driver and update their status to unavailable.

---

## 🧪 Testing

```bash
npm run test
```

Unit tests and integration tests are written using Jest and cover critical flows like:

* Order creation
* Driver matching
* Redis-based driver management

---

## 🌐 Future Improvements

* WebSocket gateway for real-time order updates
* Fallback matching (e.g., round-robin)
* Support for different scoring weights or configurations
* Driver state TTL in Redis
* Geo-indexing with Redis sorted sets

---

## 👤 Author

**Ayobami Adeleke**

---

## 📄 License

MIT
