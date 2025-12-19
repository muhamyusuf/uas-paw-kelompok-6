# Wonderfull Inn - Travel Package Booking Platform

Proyek ini mengangkat tema Travel Package Booking, sebuah aplikasi web yang dirancang untuk memudahkan pengguna dalam mencari, memilih, dan melakukan pemesanan paket wisata secara online.

## Member of Developers

| Nama | NIM | Role |
|-------|------|----------|
| Muhammad Yusuf | 122140193 | Frontend |
| Daniel Calvin Simanjuntak | 123140004 | Backend |
| Reyhan Capri Moraga | 123140022 | Backend |
| Faiq Ghozy Erlangga | 123140139 | Backend |
| Martino Kelvin | 123140165 | Frontend |


##  Features

### Core Features

1. **User Authentication** - Register, Login with Tourist and Travel Agent roles
2. **Package Management** - Agent: Full CRUD packages | Tourist: Browse and view packages
3. **Destination Catalog** - Browse destinations with photos, descriptions, and packages
4. **Booking System** - Tourist: Book packages (date, travelers), view all bookings
5. **Booking Management** - Agent: View and manage bookings (confirm/cancel)
6. **Reviews System** - Tourist: Write reviews after trip | View package ratings ⭐

### Additional Features

- ✅ Fully responsive design (desktop & mobile optimized)
- ✅ Real-time form validation with Zod
- ✅ Loading states and error handling
- ✅ Protected routes with role-based access
- ✅ 404 page and error boundary
- ✅ Success pages with auto-redirect
- ✅ Dashboard for both Tourist and Agent roles
- ✅ Search and filter functionality
- ✅ Toast notifications for user feedback


## Frontend Tech Stack

- **Framework:** React 19.2.1 + Vite 7.2.4
- **Language:** TypeScript 5.9.3
- **Routing:** React Router 7.9.6
- **State Management:** Zustand 5.0.9 with persist middleware
- **Styling:** Tailwind CSS 4.1.17
- **UI Components:** Shadcn UI (Radix UI primitives)
- **Form Validation:** Zod 4.1.13
- **HTTP Client:** Axios 1.13.2
- **Animations:** Framer Motion 12.23.25
- **Icons:** Lucide React
- **Date Handling:** date-fns
- **Notifications:** Sonner
- **Security:** CryptoJS (SHA-256 password hashing)

## Backend Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.14+ | Runtime |
| Pyramid | 2.0.2 | Web Framework |
| SQLAlchemy | 2.0.44 | ORM |
| PostgreSQL | - | Database |
| Alembic | 1.17.2 | Database Migration |
| PyJWT | 2.10.1 | JWT Authentication |
| bcrypt | 5.0.0 | Password Hashing |
| Pydantic | 2.12.5 | Request Validation |
| Waitress | 3.0.2 | WSGI Server |
| hupper | 1.12.1 | Hot Reload |


## Frontend Setup

### Prerequisites

- Node.js 18+ or Bun 1.2+
- Git

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd React-Vite-Frontend
```

2. Install dependencies

```bash
bun install
# or
npm install
```

3. Create environment file

```bash
cp .env.example .env
```

4. Update `.env` with your configuration

```env
# API Configuration
VITE_API_URL=http://localhost:6543

# App Configuration
VITE_APP_NAME=Wonderfull Inn
VITE_APP_VERSION=1.0.0

# Feature Flags (optional)
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_TRACKING=false
```

5. Run development server

```bash
bun run dev
# or
npm run dev
```

6. Open browser at `http://localhost:5173`

### Build for Production

```bash
bun run build
# or
npm run build
```

### Code Quality Scripts

```bash
# Lint code
bun run lint

# Auto-fix linting issues
bun run lint:fix

# Format code with Prettier
bun run format

# Check code formatting
bun run format:check
```

### Preview Production Build

```bash
bun run preview
# or
npm run preview
```

## Backend Setup

### Installation

1. postgres
2. python314+

### Setup postgres:

1. Masuk ke shell psql dan buat database

```sh
CREATE DATABASE uas_pengweb;
```

2. Buat user/role

```sh
CREATE USER alembic_user WITH PASSWORD '12345';
CREATE USER app_prod_user WITH PASSWORD '12345';
```

3. Berikan hak akses koneksi database tadi ke semua user diatas

```sh
GRANT CONNECT ON DATABASE uas_pengweb TO alembic_user;
GRANT CONNECT ON DATABASE uas_pengweb TO app_prod_user;
```

4. Masuk ke database

```sh
\c uas_pengweb
```

5. (Setup user alembic) Berikan akses ke alembic_user, line 2 dan 3 opsional jika db kosong

```sh
GRANT USAGE, CREATE ON SCHEMA public TO alembic_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO alembic_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO alembic_user;
```

6. (Setup user prod) Berikan akses ke user prod

```sh
GRANT USAGE ON SCHEMA public TO app_prod_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_prod_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_prod_user;
```

7. Beri akses tabel yang dibuat alembic nanti ke user prod

```sh
ALTER DEFAULT PRIVILEGES FOR ROLE alembic_user IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_prod_user;

ALTER DEFAULT PRIVILEGES FOR ROLE alembic_user IN SCHEMA public
GRANT USAGE, SELECT ON SEQUENCES TO app_prod_user;
```

### Setup Python

1. Clone repository

```sh
git clone https://github.com/Tugas-Besar-Pemrograman-Aplikasi-Web/Pyramid-Backend.git
```

2. Masuk ke root repository

```sh
cd backend
```

3. Buat virtual env

```sh
python -m venv env
```

4. Source activate

```sh
.\env\Scripts\activate
```

5. Install dependensi

```sh
pip install -r requirements.txt
```

### Setup Alembic:

1. Upgrade head

```sh
alembic upgrade head
```

2. Autogenerate migration

```sh
alembic revision --autogenerate -m "initiate"
```

### Run aplikasi:

1. Run main.py

```sh
python main.py
```

---

## Docker Setup

### Requirements:
- Docker
- Docker Compose

### Quick Start dengan Docker Compose

1. **Masuk ke folder backend**

```sh
cd backend
```

2. **Build dan jalankan containers**

```sh
docker-compose up --build
```

Perintah ini akan:
- Build Docker image untuk Pyramid backend
- Create PostgreSQL 15 container
- Auto-initialize database dengan `init-db.sql`
- Auto-run alembic migrations
- Start Pyramid server di port 6543

3. **Cek apakah service berjalan**

```bash
docker-compose ps
```

Output yang diharapkan:
```
NAME              STATUS
uas-pengweb-db    Up (healthy)
uas-pyramid-backend  Up
```

## Deployment Link 
### Backend
<https://wonderfull-inn.web.id>

### Frontend
<https://wonderfull-inn.vercel.app>

## API Documentation

## Authentication

### Register User
**POST** `/api/auth/register`

Mendaftarkan user baru (Tourist atau Agent).

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "tourist"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Nama lengkap user |
| email | string | Yes | Email unik user |
| password | string | Yes | Password user |
| role | string | Yes | Role user: `agent` atau `tourist` |

**Response (201 Created):**
```json
{
  "message": "User registered",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "tourist"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Validation error details"
}
```

**Error Response (409 Conflict):**
```json
{
  "error": "Email already exists"
}
```

---

### Login User
**POST** `/api/auth/login`

Login user dan mendapatkan JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | Email user |
| password | string | Yes | Password user |

**Response (200 OK):**
```json
{
  "message": "User login",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "tourist"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401 Unauthorized):**
```json
{
  "message": "User tidak ditemukan"
}
```
atau
```json
{
  "message": "Password salah"
}
```

---

### Get Current User
**GET** `/api/auth/me`

Mendapatkan informasi user yang sedang login.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "tourist"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "message": "User tidak ditemukan"
}
```


---

## Destinations

### GET /api/destinations

**Get all destinations**
**Query Parameters:**

- `page` (optional, default: 1): Page number
- `limit` (optional, default: 10): Items per page

**Response (200 OK):**

```json
[
  {
    "id": "uuid-here",
    "name": "Bali",
    "description": "Island of Gods with stunning beaches",
    "country": "Indonesia",
    "photo": "url-to-image",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

---

### GET /api/destinations/{id}

**Get destination detail**
**Response (200 OK):**

```json
{
  "id": "uuid-here",
  "name": "Bali",
  "description": "Island of Gods with stunning beaches",
  "country": "Indonesia",
  "photo": "url-to-image",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

### POST /api/destinations

**Create new destination (agent only)**
**Headers:**

```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body:**

```
- name: "Bali" (string)
- description: "Island of Gods with stunning beaches" (string)
- country: "Indonesia" (string)
- photo: <binary file> (image file)
```

**Response (201 Created):**

```json
{
  "id": "uuid-here",
  "name": "Bali",
  "description": "Island of Gods with stunning beaches",
  "country": "Indonesia",
  "photo": "url-to-image",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

### PUT /api/destinations/{id}

**Update destination (agent only)**
**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Bali Updated",
  "description": "Updated description",
  "country": "Indonesia"
}
```

**Response (200 OK):**

```json
{
  "id": "uuid-here",
  "name": "Bali Updated",
  "description": "Updated description",
  "country": "Indonesia",
  "photo": "url-to-image",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

### DELETE /api/destinations/{id}

**Delete destination (agent only)**
**Headers:**

```
Authorization: Bearer {token}
```

**Response (200 OK):**

```json
{
  "message": "Destination deleted successfully"
}
```

---


## Packages

### Get All Packages
**GET** `/api/packages`

Mendapatkan semua paket wisata dengan filter opsional.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| destination | string | No | Filter berdasarkan destination ID |
| q / search | string | No | Pencarian berdasarkan nama paket |
| minPrice | number | No | Filter harga minimum |
| maxPrice | number | No | Filter harga maksimum |
| sortBy | string | No | Kolom sort: `price`, `duration`, atau default `created_at` |
| order | string | No | Urutan: `asc` atau `desc` (default: `asc`) |

**Response (200 OK):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "agentId": "660e8400-e29b-41d4-a716-446655440001",
    "destinationId": "770e8400-e29b-41d4-a716-446655440002",
    "name": "Maldives Paradise Retreat",
    "duration": 5,
    "price": 3500.0,
    "itinerary": "Day 1: Arrival...",
    "maxTravelers": 10,
    "contactPhone": "+62812345678",
    "images": ["/packages/image1.jpg", "/packages/image2.jpg"],
    "rating": 4.5,
    "reviewsCount": 15,
    "destinationName": "Maldives",
    "country": "Maldives"
  }
]
```

---

### Get Package Detail
**GET** `/api/packages/{id}`

Mendapatkan detail satu paket berdasarkan ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string (UUID) | Yes | ID paket |

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "agentId": "660e8400-e29b-41d4-a716-446655440001",
  "destinationId": "770e8400-e29b-41d4-a716-446655440002",
  "name": "Maldives Paradise Retreat",
  "duration": 5,
  "price": 3500.0,
  "itinerary": "Day 1: Arrival...",
  "maxTravelers": 10,
  "contactPhone": "+62812345678",
  "images": ["/packages/image1.jpg"],
  "rating": 4.5,
  "reviewsCount": 15,
  "destinationName": "Maldives",
  "country": "Maldives"
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "Package not found"
}
```

---

### Create Package
**POST** `/api/packages`

Membuat paket wisata baru (khusus Agent).

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| destinationId | string | Yes | ID destinasi |
| name | string | Yes | Nama paket |
| duration | integer | Yes | Durasi dalam hari (> 0) |
| price | number | Yes | Harga (> 0) |
| itinerary | string | Yes | Rincian itinerary |
| maxTravelers | integer | Yes | Maksimal traveler (> 0) |
| contactPhone | string | Yes | Nomor kontak |
| images | file[] | No | File gambar (jpg, jpeg, png, gif, webp, max 5MB each) |

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "agentId": "660e8400-e29b-41d4-a716-446655440001",
  "destinationId": "770e8400-e29b-41d4-a716-446655440002",
  "name": "Maldives Paradise Retreat",
  "duration": 5,
  "price": 3500.0,
  "itinerary": "Day 1: Arrival...",
  "maxTravelers": 10,
  "contactPhone": "+62812345678",
  "images": ["/packages/abc123.jpg"],
  "rating": 0,
  "reviewsCount": 0,
  "destinationName": "Maldives",
  "country": "Maldives"
}
```

**Error Response (403 Forbidden):**
```json
{
  "error": "Forbidden : Only agent can access"
}
```

---

### Update Package
**PUT** `/api/packages/{id}`

Mengupdate paket wisata (khusus Agent pemilik paket).

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string (UUID) | Yes | ID paket |

**Request Body:**
```json
{
  "name": "Updated Package Name",
  "duration": 7,
  "price": 4000.0,
  "itinerary": "Updated itinerary...",
  "maxTravelers": 15,
  "contactPhone": "+62898765432",
  "images": ["/packages/newimage.jpg"]
}
```

> Semua field bersifat opsional. Hanya kirim field yang ingin diupdate.

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "agentId": "660e8400-e29b-41d4-a716-446655440001",
  "destinationId": "770e8400-e29b-41d4-a716-446655440002",
  "name": "Updated Package Name",
  "duration": 7,
  "price": 4000.0,
  "itinerary": "Updated itinerary...",
  "maxTravelers": 15,
  "contactPhone": "+62898765432",
  "images": ["/packages/newimage.jpg"],
  "rating": 4.5,
  "reviewsCount": 15,
  "destinationName": "Maldives",
  "country": "Maldives"
}
```

**Error Response (403 Forbidden):**
```json
{
  "error": "Forbidden: You do not own this package"
}
```

---

### Delete Package
**DELETE** `/api/packages/{id}`

Menghapus paket wisata (khusus Agent pemilik paket).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string (UUID) | Yes | ID paket |

**Response (200 OK):**
```json
{
  "message": "Package Successfully Deleted"
}
```

**Error Response (409 Conflict):**
```json
{
  "error": "Cannot delete package, it might have booking sesssion"
}
```

--- 

## Bookings

### Get All Bookings
**GET** `/api/bookings`

Mendapatkan semua booking dengan filter opsional.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| tourist_id | string | No | Filter berdasarkan tourist ID |
| package_id | string | No | Filter berdasarkan package ID |
| status | string | No | Filter status: `pending`, `confirmed`, `cancelled`, `completed` |
| payment_status | string | No | Filter payment status: `unpaid`, `pending_verification`, `verified`, `rejected` |

> **Note:** Tourist hanya bisa melihat booking miliknya sendiri.

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "880e8400-e29b-41d4-a716-446655440003",
      "packageId": "550e8400-e29b-41d4-a716-446655440000",
      "touristId": "990e8400-e29b-41d4-a716-446655440004",
      "travelDate": "2025-02-15",
      "travelersCount": 2,
      "totalPrice": 7000.0,
      "status": "confirmed",
      "createdAt": "2024-12-01T10:00:00",
      "completedAt": null,
      "hasReviewed": false,
      "paymentStatus": "verified",
      "paymentProofUrl": "/payment_proofs/abc123.jpg",
      "paymentProofUploadedAt": "2024-12-01T12:00:00",
      "paymentVerifiedAt": "2024-12-01T14:00:00",
      "paymentRejectionReason": null,
      "package": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Maldives Paradise Retreat",
        "images": ["/packages/image1.jpg"]
      },
      "tourist": {
        "id": "990e8400-e29b-41d4-a716-446655440004",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

---

### Get Booking Detail
**GET** `/api/bookings/{id}`

Mendapatkan detail booking berdasarkan ID.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string (UUID) | Yes | ID booking |

**Response (200 OK):**
```json
{
  "id": "880e8400-e29b-41d4-a716-446655440003",
  "packageId": "550e8400-e29b-41d4-a716-446655440000",
  "touristId": "990e8400-e29b-41d4-a716-446655440004",
  "travelDate": "2025-02-15",
  "travelersCount": 2,
  "totalPrice": 7000.0,
  "status": "confirmed",
  "createdAt": "2024-12-01T10:00:00",
  "completedAt": null,
  "hasReviewed": false,
  "paymentStatus": "verified",
  "paymentProofUrl": "/payment_proofs/abc123.jpg",
  "paymentProofUploadedAt": "2024-12-01T12:00:00",
  "paymentVerifiedAt": "2024-12-01T14:00:00",
  "paymentRejectionReason": null
}
```

**Error Response (403 Forbidden):**
```json
{
  "error": "Forbidden"
}
```

---

### Create Booking
**POST** `/api/bookings`

Membuat booking baru (khusus Tourist).

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "packageId": "550e8400-e29b-41d4-a716-446655440000",
  "travelDate": "2025-02-15",
  "travelersCount": 2,
  "totalPrice": 7000.0
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| packageId | string (UUID) | Yes | ID paket wisata |
| travelDate | string (YYYY-MM-DD) | Yes | Tanggal perjalanan (min 3 hari dari sekarang) |
| travelersCount | integer | Yes | Jumlah traveler (min 1, max sesuai package) |
| totalPrice | number | Yes | Total harga (> 0) |

**Response (201 Created):**
```json
{
  "id": "880e8400-e29b-41d4-a716-446655440003",
  "packageId": "550e8400-e29b-41d4-a716-446655440000",
  "touristId": "990e8400-e29b-41d4-a716-446655440004",
  "travelDate": "2025-02-15",
  "travelersCount": 2,
  "totalPrice": 7000.0,
  "status": "pending",
  "createdAt": "2024-12-06T10:00:00",
  "completedAt": null,
  "hasReviewed": false,
  "paymentStatus": "unpaid",
  "paymentProofUrl": null,
  "paymentProofUploadedAt": null,
  "paymentVerifiedAt": null,
  "paymentRejectionReason": null
}
```

**Error Response (403 Forbidden):**
```json
{
  "error": "Only tourists can create bookings"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Travel date must be at least 3 days in the future"
}
```

---

### Update Booking Status
**PUT** `/api/bookings/{id}/status`

Mengupdate status booking (khusus Agent pemilik paket).

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string (UUID) | Yes | ID booking |

**Request Body:**
```json
{
  "status": "confirmed"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| status | string | Yes | Status baru: `pending`, `confirmed`, `cancelled`, `completed` |

**Response (200 OK):**
```json
{
  "id": "880e8400-e29b-41d4-a716-446655440003",
  "packageId": "550e8400-e29b-41d4-a716-446655440000",
  "touristId": "990e8400-e29b-41d4-a716-446655440004",
  "travelDate": "2025-02-15",
  "travelersCount": 2,
  "totalPrice": 7000.0,
  "status": "confirmed",
  "createdAt": "2024-12-01T10:00:00",
  "completedAt": null,
  "hasReviewed": false,
  "paymentStatus": "verified",
  "paymentProofUrl": "/payment_proofs/abc123.jpg",
  "paymentProofUploadedAt": "2024-12-01T12:00:00",
  "paymentVerifiedAt": "2024-12-01T14:00:00",
  "paymentRejectionReason": null
}
```

---

### Get Bookings by Tourist
**GET** `/api/bookings/tourist/{touristId}`

Mendapatkan semua booking milik tourist tertentu.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| touristId | string (UUID) | Yes | ID tourist |

> **Note:** Tourist hanya bisa melihat booking miliknya sendiri.

**Response (200 OK):**
```json
[
  {
    "id": "880e8400-e29b-41d4-a716-446655440003",
    "packageId": "550e8400-e29b-41d4-a716-446655440000",
    "touristId": "990e8400-e29b-41d4-a716-446655440004",
    "travelDate": "2025-02-15",
    "travelersCount": 2,
    "totalPrice": 7000.0,
    "status": "confirmed",
    "createdAt": "2024-12-01T10:00:00",
    "completedAt": null,
    "hasReviewed": false,
    "paymentStatus": "verified",
    "paymentProofUrl": "/payment_proofs/abc123.jpg",
    "paymentProofUploadedAt": "2024-12-01T12:00:00",
    "paymentVerifiedAt": "2024-12-01T14:00:00",
    "paymentRejectionReason": null
  }
]
```

---

### Get Bookings by Package
**GET** `/api/bookings/package/{packageId}`

Mendapatkan semua booking untuk paket tertentu.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| packageId | string (UUID) | Yes | ID paket |

> **Note:** Agent hanya bisa melihat booking untuk paket miliknya.

**Response (200 OK):**
```json
[
  {
    "id": "880e8400-e29b-41d4-a716-446655440003",
    "packageId": "550e8400-e29b-41d4-a716-446655440000",
    "touristId": "990e8400-e29b-41d4-a716-446655440004",
    "travelDate": "2025-02-15",
    "travelersCount": 2,
    "totalPrice": 7000.0,
    "status": "confirmed",
    "createdAt": "2024-12-01T10:00:00",
    "completedAt": null,
    "hasReviewed": false,
    "paymentStatus": "verified",
    "paymentProofUrl": "/payment_proofs/abc123.jpg",
    "paymentProofUploadedAt": "2024-12-01T12:00:00",
    "paymentVerifiedAt": "2024-12-01T14:00:00",
    "paymentRejectionReason": null
  }
]
```

---

### Upload Payment Proof
**POST** `/api/bookings/{id}/payment-proof`

Upload bukti pembayaran (khusus Tourist pemilik booking).

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string (UUID) | Yes | ID booking |

**Request Body (multipart/form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| proof / file | file | Yes | File bukti pembayaran (jpg, png, gif, max 5MB) |

**Response (200 OK):**
```json
{
  "id": "880e8400-e29b-41d4-a716-446655440003",
  "packageId": "550e8400-e29b-41d4-a716-446655440000",
  "touristId": "990e8400-e29b-41d4-a716-446655440004",
  "travelDate": "2025-02-15",
  "travelersCount": 2,
  "totalPrice": 7000.0,
  "status": "pending",
  "createdAt": "2024-12-01T10:00:00",
  "completedAt": null,
  "hasReviewed": false,
  "paymentStatus": "pending_verification",
  "paymentProofUrl": "/payment_proofs/abc123.jpg",
  "paymentProofUploadedAt": "2024-12-06T10:00:00",
  "paymentVerifiedAt": null,
  "paymentRejectionReason": null
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Cannot upload payment proof for this booking"
}
```

---

### Verify Payment
**PUT** `/api/bookings/{id}/payment-verify`

Verifikasi pembayaran (khusus Agent pemilik paket).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string (UUID) | Yes | ID booking |

**Response (200 OK):**
```json
{
  "id": "880e8400-e29b-41d4-a716-446655440003",
  "packageId": "550e8400-e29b-41d4-a716-446655440000",
  "touristId": "990e8400-e29b-41d4-a716-446655440004",
  "travelDate": "2025-02-15",
  "travelersCount": 2,
  "totalPrice": 7000.0,
  "status": "confirmed",
  "createdAt": "2024-12-01T10:00:00",
  "completedAt": null,
  "hasReviewed": false,
  "paymentStatus": "verified",
  "paymentProofUrl": "/payment_proofs/abc123.jpg",
  "paymentProofUploadedAt": "2024-12-06T10:00:00",
  "paymentVerifiedAt": "2024-12-06T11:00:00",
  "paymentRejectionReason": null
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Booking payment status is not pending verification"
}
```

---

### Reject Payment
**PUT** `/api/bookings/{id}/payment-reject`

Tolak pembayaran dengan alasan (khusus Agent pemilik paket).

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string (UUID) | Yes | ID booking |

**Request Body:**
```json
{
  "reason": "Payment proof is unclear. Please upload a clearer image."
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| reason | string | Yes | Alasan penolakan |

**Response (200 OK):**
```json
{
  "id": "880e8400-e29b-41d4-a716-446655440003",
  "packageId": "550e8400-e29b-41d4-a716-446655440000",
  "touristId": "990e8400-e29b-41d4-a716-446655440004",
  "travelDate": "2025-02-15",
  "travelersCount": 2,
  "totalPrice": 7000.0,
  "status": "pending",
  "createdAt": "2024-12-01T10:00:00",
  "completedAt": null,
  "hasReviewed": false,
  "paymentStatus": "rejected",
  "paymentProofUrl": "/payment_proofs/abc123.jpg",
  "paymentProofUploadedAt": "2024-12-06T10:00:00",
  "paymentVerifiedAt": null,
  "paymentRejectionReason": "Payment proof is unclear. Please upload a clearer image."
}
```

---

### Get Pending Payment Verifications
**GET** `/api/bookings/payment/pending`

Mendapatkan semua booking yang menunggu verifikasi pembayaran (khusus Agent).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
[
  {
    "id": "880e8400-e29b-41d4-a716-446655440003",
    "packageId": "550e8400-e29b-41d4-a716-446655440000",
    "touristId": "990e8400-e29b-41d4-a716-446655440004",
    "travelDate": "2025-02-15",
    "travelersCount": 2,
    "totalPrice": 7000.0,
    "status": "pending",
    "createdAt": "2024-12-01T10:00:00",
    "paymentStatus": "pending_verification",
    "paymentProofUrl": "/payment_proofs/abc123.jpg",
    "paymentProofUploadedAt": "2024-12-06T10:00:00",
    "package": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Maldives Paradise Retreat"
    },
    "tourist": {
      "id": "990e8400-e29b-41d4-a716-446655440004",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
]
```

---

## Reviews

### Create Review
**POST** `/api/reviews`

Membuat review untuk paket setelah trip selesai (khusus Tourist).

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "packageId": "550e8400-e29b-41d4-a716-446655440000",
  "bookingId": "880e8400-e29b-41d4-a716-446655440003",
  "rating": 5,
  "comment": "Amazing experience! The package was well organized and the destination was breathtaking."
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| packageId | string (UUID) | Yes | ID paket |
| bookingId | string (UUID) | Yes | ID booking (harus completed & belum direview) |
| rating | integer | Yes | Rating 1-5 |
| comment | string | Yes | Komentar (min 10 karakter) |

**Response (201 Created):**
```json
{
  "id": "aa0e8400-e29b-41d4-a716-446655440005",
  "packageId": "550e8400-e29b-41d4-a716-446655440000",
  "touristId": "990e8400-e29b-41d4-a716-446655440004",
  "bookingId": "880e8400-e29b-41d4-a716-446655440003",
  "rating": 5,
  "comment": "Amazing experience! The package was well organized...",
  "createdAt": "2024-12-06T10:00:00"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Booking must be completed to leave a review"
}
```

```json
{
  "error": "This booking has already been reviewed"
}
```

---

### Get Reviews by Package
**GET** `/api/reviews/package/{packageId}`

Mendapatkan semua review untuk paket tertentu (Public).

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| packageId | string (UUID) | Yes | ID paket |

**Response (200 OK):**
```json
[
  {
    "id": "aa0e8400-e29b-41d4-a716-446655440005",
    "packageId": "550e8400-e29b-41d4-a716-446655440000",
    "touristId": "990e8400-e29b-41d4-a716-446655440004",
    "bookingId": "880e8400-e29b-41d4-a716-446655440003",
    "rating": 5,
    "comment": "Amazing experience! Highly recommended.",
    "createdAt": "2024-11-20T10:00:00",
    "tourist": {
      "id": "990e8400-e29b-41d4-a716-446655440004",
      "name": "John Doe"
    }
  }
]
```

---

### Get Reviews by Tourist
**GET** `/api/reviews/tourist/{touristId}`

Mendapatkan semua review yang dibuat tourist tertentu.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| touristId | string (UUID) | Yes | ID tourist |

> **Note:** Tourist hanya bisa melihat review miliknya sendiri.

**Response (200 OK):**
```json
[
  {
    "id": "aa0e8400-e29b-41d4-a716-446655440005",
    "packageId": "550e8400-e29b-41d4-a716-446655440000",
    "touristId": "990e8400-e29b-41d4-a716-446655440004",
    "bookingId": "880e8400-e29b-41d4-a716-446655440003",
    "rating": 5,
    "comment": "Amazing experience!",
    "createdAt": "2024-11-20T10:00:00",
    "package": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Maldives Paradise Retreat"
    }
  }
]
```

---

## QRIS Payment

### Get All QRIS
**GET** `/api/qris`

Mendapatkan semua QRIS yang sudah diupload dengan pagination.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | Nomor halaman |
| limit | integer | No | 10 | Jumlah item per halaman (max 100) |

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "bb0e8400-e29b-41d4-a716-446655440006",
      "static_qris_string": "00020126450014com.midtrans...",
      "dynamic_qris_string": "00020126...",
      "foto_qr_path": "storage/qris/qris_code.png",
      "fee_type": "rupiah",
      "fee_value": 10000.0,
      "created_at": "2024-01-01T00:00:00"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50
  }
}
```

---

### Get QRIS Detail
**GET** `/api/qris/{id}`

Mendapatkan detail QRIS berdasarkan ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string (UUID) | Yes | ID QRIS |

**Response (200 OK):**
```json
{
  "id": "bb0e8400-e29b-41d4-a716-446655440006",
  "static_qris_string": "00020126450014com.midtrans...",
  "dynamic_qris_string": "00020126...",
  "foto_qr_path": "storage/qris/qris_code.png",
  "fee_type": "rupiah",
  "fee_value": 10000.0,
  "created_at": "2024-01-01T00:00:00"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "QRIS not found"
}
```

---

### Create/Upload QRIS
**POST** `/api/qris`

Upload gambar QRIS, auto-extract QRIS string, dan generate clean QR code.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| foto_qr | file | Yes | File gambar berisi QR code (jpeg, png, gif, max 5MB) |
| fee_type | string | No | Tipe fee: `persentase` atau `rupiah` |
| fee_value | number | No | Nilai fee (>= 0) |

**Response (201 Created):**
```json
{
  "id": "bb0e8400-e29b-41d4-a716-446655440006",
  "static_qris_string": "00020126450014com.midtrans...",
  "foto_qr_path": "storage/qris/qris_code.png",
  "fee_type": "rupiah",
  "fee_value": 10000.0,
  "created_at": "2024-01-01T00:00:00",
  "message": "QRIS berhasil diupload dan dibersihkan (disimpan sebagai clean QR code)"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Tidak dapat membaca QR code dari gambar. Pastikan gambar berisi QR code yang jelas."
}
```

```json
{
  "error": "QRIS string ini sudah pernah diupload sebelumnya."
}
```

---

### Delete QRIS
**DELETE** `/api/qris/{id}`

Menghapus QRIS berdasarkan ID.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string (UUID) | Yes | ID QRIS |

**Response (200 OK):**
```json
{
  "message": "QRIS berhasil dihapus"
}
```

---

### Preview Dynamic QRIS
**POST** `/api/qris/preview`

Generate preview dynamic QRIS QR code tanpa menyimpan ke database.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "static_qris_string": "00020126450014com.midtrans...",
  "jumlah_bayar": 1000000,
  "fee_type": "rupiah",
  "fee_value": 10000
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| static_qris_string | string | Yes | String QRIS statis |
| jumlah_bayar | number | Yes | Jumlah yang harus dibayar (>= 0) |
| fee_type | string | No | Tipe fee: `persentase` atau `rupiah` |
| fee_value | number | No | Nilai fee (>= 0) |

**Response (200 OK):**
```json
{
  "base64_qr": "iVBORw0KGgoAAAANSUhEUgAA...",
  "dynamic_qris_string": "00020126..."
}
```

---

### Generate Payment
**POST** `/api/payment/generate`

Generate custom QRIS payment dengan amount (auto-fetch QRIS terbaru).

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "amount": 1000000
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| amount | number | Yes | Jumlah pembayaran (> 0) |

**Response (200 OK):**
```json
{
  "qris_id": "bb0e8400-e29b-41d4-a716-446655440006",
  "static_qris_string": "00020126450014com.midtrans...",
  "dynamic_qris_string": "00020126...[custom amount]",
  "amount": 1000000,
  "fee_type": "rupiah",
  "fee_value": 10000.0,
  "total_amount": 1010000.0,
  "foto_qr_url": "http://localhost:6543/qris/dynamic_abc123.png",
  "qr_code_image": "storage/qris/dynamic_abc123.png",
  "created_at": "2024-01-01T00:00:00",
  "message": "Custom QRIS berhasil di-generate. Buka foto_qr_url untuk QR code payment custom."
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "QRIS not found. Silakan upload QRIS terlebih dahulu."
}
```

---

## Analytics

### Agent Statistics
**GET** `/api/analytics/agent/stats`

Mendapatkan statistik dashboard agent.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

> **Note:** Khusus untuk user dengan role `agent`.

**Response (200 OK):**
```json
{
  "totalPackages": 15,
  "totalBookings": 234,
  "pendingBookings": 12,
  "confirmedBookings": 198,
  "completedBookings": 20,
  "cancelledBookings": 4,
  "totalRevenue": 456789.5,
  "averageRating": 4.7,
  "pendingPaymentVerifications": 5
}
```

---

### Agent Package Performance
**GET** `/api/analytics/agent/package-performance`

Mendapatkan performa paket-paket terbaik milik agent.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| limit | integer | No | 5 | Jumlah top paket (1-100) |

> **Note:** Khusus untuk user dengan role `agent`.

**Response (200 OK):**
```json
[
  {
    "packageId": "550e8400-e29b-41d4-a716-446655440000",
    "packageName": "Maldives Paradise Retreat",
    "bookingsCount": 45,
    "revenue": 157500.0,
    "averageRating": 4.8
  },
  {
    "packageId": "550e8400-e29b-41d4-a716-446655440001",
    "packageName": "Bali Adventure Tour",
    "bookingsCount": 38,
    "revenue": 95000.0,
    "averageRating": 4.6
  }
]
```

---

### Tourist Statistics
**GET** `/api/analytics/tourist/stats`

Mendapatkan statistik dashboard tourist.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

> **Note:** Khusus untuk user dengan role `tourist`.

**Response (200 OK):**
```json
{
  "totalBookings": 8,
  "confirmedBookings": 5,
  "pendingBookings": 2,
  "completedBookings": 1,
  "cancelledBookings": 0,
  "totalSpent": 25600.0,
  "reviewsGiven": 1,
  "wishlistCount": 0
}
```

---

## Static Files

Server menyediakan akses ke file statis untuk:

| Path | Description |
|------|-------------|
| `/qris/{filename}` | File QRIS yang diupload |
| `/payment_proofs/{filename}` | Bukti pembayaran |
| `/destinations/{filename}` | Foto destinasi |
| `/packages/{filename}` | Foto paket wisata |

**Example:**
```
http://localhost:6543/qris/qris_code.png
http://localhost:6543/payment_proofs/abc123.jpg
http://localhost:6543/destinations/maldives.jpg
http://localhost:6543/packages/package1.jpg
```

---

## Error Responses

### Common Error Codes

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid request body atau parameter |
| 401 | Unauthorized - Token tidak valid atau expired |
| 403 | Forbidden - Tidak memiliki akses ke resource |
| 404 | Not Found - Resource tidak ditemukan |
| 409 | Conflict - Data sudah ada (duplicate) |
| 500 | Internal Server Error - Error di server |

### Error Response Format
```json
{
  "error": "Error message description"
}
```
atau
```json
{
  "message": "Error message description"
}
```

---
## Screenshot Aplikasi 



--- 

## Link Video Presentasi

