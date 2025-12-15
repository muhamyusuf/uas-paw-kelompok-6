# Backend Audit Report
> Laporan lengkap hasil audit backend Python Pyramid - UAS Pemrograman Aplikasi Web Kelompok 6

**Tanggal Audit:** 11 Desember 2025  
**Stack Teknologi:** Python Pyramid, PostgreSQL, SQLAlchemy, Alembic, JWT

---

## Table of Contents
1. [Status Pengembangan](#status-pengembangan)
2. [Entity Relationship Diagram (ERD)](#entity-relationship-diagram-erd)
3. [Dokumentasi API Endpoints](#dokumentasi-api-endpoints)

---

## Status Pengembangan

### ✅ Komponen Selesai

| Komponen | Status | Keterangan |
|----------|--------|------------|
| **Database Models** | ✅ Selesai | 5 model lengkap dengan relationships |
| **User Model** | ✅ Selesai | UUID, name, email, password_hash, role, timestamps |
| **Destination Model** | ✅ Selesai | UUID, name, description, photo_url, country, timestamps |
| **Package Model** | ✅ Selesai | UUID, agent_id, destination_id, name, duration, price, itinerary, max_travelers, contact_phone, images |
| **Booking Model** | ✅ Selesai | UUID, package_id, tourist_id, travel_date, travelers_count, total_price, status, payment fields |
| **Review Model** | ✅ Selesai | UUID, package_id, tourist_id, booking_id, rating (1-5), comment, timestamps |
| **Auth - Register** | ✅ Selesai | POST /api/auth/register dengan validasi & JWT |
| **Auth - Login** | ✅ Selesai | POST /api/auth/login dengan bcrypt & JWT |
| **Auth - Me** | ✅ Selesai | GET /api/auth/me dengan token validation |
| **Alembic Migrations** | ✅ Selesai | Database migration setup |
| **Database Connection** | ✅ Selesai | PostgreSQL dengan SQLAlchemy |

### ⏳ Komponen Belum Diimplementasikan

| Komponen | Status | Keterangan |
|----------|--------|------------|
| **Destination Endpoints** | ❌ Belum | CRUD untuk destinations |
| **Package Endpoints** | ❌ Belum | CRUD untuk packages |
| **Booking Endpoints** | ❌ Belum | CRUD untuk bookings |
| **Review Endpoints** | ❌ Belum | CRUD untuk reviews |
| **File Upload** | ❌ Belum | Upload gambar untuk packages dan payment proof |
| **Role-Based Authorization** | ⚠️ Parsial | Validasi role di login, tapi belum di endpoint lain |

---

## Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS {
        UUID id PK
        VARCHAR(100) name
        VARCHAR(100) email UK
        VARCHAR(255) password_hash
        ENUM role "tourist | agent"
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    DESTINATIONS {
        UUID id PK
        VARCHAR(100) name
        TEXT description
        VARCHAR(500) photo_url
        VARCHAR(100) country
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    PACKAGES {
        UUID id PK
        UUID agent_id FK
        UUID destination_id FK
        VARCHAR(200) name
        INTEGER duration "in days"
        DECIMAL(10-2) price
        TEXT itinerary
        INTEGER max_travelers
        VARCHAR(20) contact_phone
        ARRAY images "String[]"
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    BOOKINGS {
        UUID id PK
        UUID package_id FK
        UUID tourist_id FK
        DATE travel_date
        INTEGER travelers_count
        DECIMAL(10-2) total_price
        ENUM status "pending | confirmed | cancelled | completed"
        TIMESTAMP created_at
        TIMESTAMP completed_at
        BOOLEAN has_reviewed
        ENUM payment_status "unpaid | pending_verification | verified | rejected"
        VARCHAR(500) payment_proof_url
        TIMESTAMP payment_proof_uploaded_at
        TIMESTAMP payment_verified_at
        TEXT payment_rejection_reason
    }

    REVIEWS {
        UUID id PK
        UUID package_id FK
        UUID tourist_id FK
        UUID booking_id FK
        INTEGER rating "1-5 CHECK constraint"
        TEXT comment
        TIMESTAMP created_at
    }

    USERS ||--o{ PACKAGES : "agent creates"
    USERS ||--o{ BOOKINGS : "tourist books"
    USERS ||--o{ REVIEWS : "tourist writes"
    DESTINATIONS ||--o{ PACKAGES : "has"
    PACKAGES ||--o{ BOOKINGS : "has"
    PACKAGES ||--o{ REVIEWS : "receives"
    BOOKINGS ||--o| REVIEWS : "has"
```

---

## Dokumentasi API Endpoints

### Base URL
```
http://localhost:6543
```

---

## 🔐 Authentication Endpoints

### POST `/api/auth/register`
**Deskripsi:** Register/signup user baru (tourist atau agent)

#### Request
**Headers:**
```
Content-Type: application/json
```

**Body:**
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
| `name` | string | ✅ | Nama lengkap user |
| `email` | string | ✅ | Email user (unique) |
| `password` | string | ✅ | Password (akan di-hash dengan bcrypt) |
| `role` | enum | ✅ | Role user: `"tourist"` atau `"agent"` |

#### Responses

**✅ 200 OK - Registrasi Berhasil**
```json
{
  "message": "User registered",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "tourist"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**❌ 400 Bad Request - Validasi Gagal**
```json
{
  "error": "[{'type': 'missing', 'loc': ('email',), 'msg': 'Field required', 'input': {...}}]"
}
```
*Terjadi ketika field required tidak dikirim atau format tidak valid.*

**❌ 409 Conflict - Email Sudah Terdaftar**
```json
{
  "error": "duplicate key value violates unique constraint \"users_email_key\""
}
```
*Terjadi ketika email sudah digunakan oleh user lain.*

---

### POST `/api/auth/login`
**Deskripsi:** Login user dengan email dan password

#### Request
**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123",
  "role": "tourist"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | ✅ | Email user terdaftar |
| `password` | string | ✅ | Password user |
| `role` | enum | ✅ | Role yang divalidasi: `"tourist"` atau `"agent"` |

#### Responses

**✅ 200 OK - Login Berhasil**
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

**❌ 200 OK - Password Salah**
```json
{
  "message": "Password salah"
}
```
*Catatan: Sebaiknya menggunakan status 401 untuk konsistensi.*

**❌ 400 Bad Request - Validasi Gagal**
```json
{
  "error": "[{'type': 'missing', 'loc': ('email',), 'msg': 'Field required', 'input': {...}}]"
}
```
*Terjadi ketika field required tidak dikirim.*

**❌ 401 Unauthorized - User Tidak Ditemukan**
```json
{
  "message": "User tidak ditemukan"
}
```
*Terjadi ketika email tidak terdaftar di database.*

**❌ 500 Internal Server Error**
```json
{
  "error": "Internal Server Error"
}
```
*Terjadi ketika ada kesalahan database atau sistem.*

---

### GET `/api/auth/me`
**Deskripsi:** Mendapatkan informasi user yang sedang login

#### Request
**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

*Tidak memerlukan request body.*

#### Responses

**✅ 200 OK - Berhasil**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "tourist"
}
```

**❌ 401 Unauthorized - Token Tidak Ada**
```json
{
  "error": "Missing Token"
}
```
*Terjadi ketika header Authorization tidak disertakan.*

**❌ 401 Unauthorized - Format Header Invalid**
```json
{
  "error": "Invalid Authorization header format"
}
```
*Terjadi ketika format bukan `Bearer {token}`.*

**❌ 401 Unauthorized - Token Expired**
```json
{
  "error": "Token expired"
}
```
*Terjadi ketika token JWT sudah expired (>30 menit).*

**❌ 401 Unauthorized - Token Invalid**
```json
{
  "error": "Invalid token"
}
```
*Terjadi ketika token tidak valid atau telah dimanipulasi.*

**❌ 401 Unauthorized - User Tidak Ditemukan**
```json
{
  "message": "User tidak ditemukan"
}
```
*Terjadi ketika user dalam token tidak ada di database.*

**❌ 500 Internal Server Error**
```json
{
  "error": "Internal Server Error"
}
```
*Terjadi ketika ada kesalahan database atau sistem.*

---

## JWT Token Specification

| Property | Value |
|----------|-------|
| **Algorithm** | HS256 |
| **Secret Key** | `"secret"` |
| **Expiration** | 30 menit |

**Payload Structure:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "tourist",
  "exp": 1702310400
}
```

> ⚠️ **Security Warning:** Secret key `"secret"` sebaiknya diganti dengan environment variable yang aman di production.

---

## Database Schema Details

### Enum Types

**user_role:**
- `tourist` - Pengguna yang memesan paket wisata
- `agent` - Agen yang membuat paket wisata

**booking_status:**
- `pending` - Booking baru, belum dikonfirmasi
- `confirmed` - Booking dikonfirmasi
- `cancelled` - Booking dibatalkan
- `completed` - Perjalanan selesai

**payment_status:**
- `unpaid` - Belum membayar
- `pending_verification` - Menunggu verifikasi pembayaran
- `verified` - Pembayaran terverifikasi
- `rejected` - Pembayaran ditolak

---

## Rekomendasi Pengembangan Selanjutnya

### 1. **Endpoints yang Perlu Dibuat**

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/destinations` | GET | List semua destinations |
| `/api/destinations` | POST | Buat destination baru (admin) |
| `/api/destinations/{id}` | GET | Detail destination |
| `/api/destinations/{id}` | PUT | Update destination |
| `/api/destinations/{id}` | DELETE | Hapus destination |
| `/api/packages` | GET | List semua packages |
| `/api/packages` | POST | Buat package baru (agent) |
| `/api/packages/{id}` | GET | Detail package |
| `/api/packages/{id}` | PUT | Update package (agent) |
| `/api/packages/{id}` | DELETE | Hapus package (agent) |
| `/api/bookings` | GET | List bookings user |
| `/api/bookings` | POST | Buat booking baru (tourist) |
| `/api/bookings/{id}` | GET | Detail booking |
| `/api/bookings/{id}/payment` | POST | Upload bukti bayar |
| `/api/bookings/{id}/verify` | POST | Verifikasi pembayaran (agent) |
| `/api/reviews` | GET | List reviews package |
| `/api/reviews` | POST | Buat review (tourist) |

### 2. **Security Improvements**
- Gunakan environment variable untuk JWT secret
- Implementasi refresh token
- Rate limiting
- Input sanitization

### 3. **Error Handling**
- Konsistensi status code (login password salah seharusnya 401)
- Structured error response format

---

*Dokumen ini di-generate otomatis oleh Antigravity AI pada 11 Desember 2025*
