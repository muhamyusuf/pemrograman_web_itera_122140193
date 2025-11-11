# API ENDPOINTS DOCUMENTATION

## Base URL
```
http://localhost:6543
```

## Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/matakuliah` | Get all matakuliah | No |
| GET | `/api/matakuliah/{id}` | Get matakuliah by ID | No |
| POST | `/api/matakuliah` | Create new matakuliah | No |
| PUT | `/api/matakuliah/{id}` | Update matakuliah | No |
| DELETE | `/api/matakuliah/{id}` | Delete matakuliah | No |

---

## 1. GET All Matakuliah

### Request
```http
GET /api/matakuliah HTTP/1.1
Host: localhost:6543
```

### Response (200 OK)
```json
{
  "matakuliahs": [
    {
      "id": 1,
      "kode_mk": "IF101",
      "nama_mk": "Algoritma dan Pemrograman",
      "sks": 3,
      "semester": 1
    },
    {
      "id": 2,
      "kode_mk": "IF102",
      "nama_mk": "Struktur Data",
      "sks": 4,
      "semester": 2
    }
  ]
}
```

---

## 2. GET Matakuliah Detail

### Request
```http
GET /api/matakuliah/1 HTTP/1.1
Host: localhost:6543
```

### Response (200 OK)
```json
{
  "matakuliah": {
    "id": 1,
    "kode_mk": "IF101",
    "nama_mk": "Algoritma dan Pemrograman",
    "sks": 3,
    "semester": 1
  }
}
```

### Response (404 Not Found)
```json
{
  "error": "Matakuliah tidak ditemukan"
}
```

---

## 3. POST Create Matakuliah

### Request
```http
POST /api/matakuliah HTTP/1.1
Host: localhost:6543
Content-Type: application/json

{
  "kode_mk": "IF301",
  "nama_mk": "Pemrograman Web",
  "sks": 3,
  "semester": 5
}
```

### Request Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| kode_mk | string | Yes | Kode mata kuliah (unique) |
| nama_mk | string | Yes | Nama mata kuliah |
| sks | integer | Yes | Jumlah SKS |
| semester | integer | Yes | Semester pengambilan |

### Response (200 OK)
```json
{
  "success": true,
  "matakuliah": {
    "id": 4,
    "kode_mk": "IF301",
    "nama_mk": "Pemrograman Web",
    "sks": 3,
    "semester": 5
  }
}
```

### Response (400 Bad Request) - Missing Field
```json
{
  "error": "Field kode_mk wajib diisi"
}
```

### Response (400 Bad Request) - Invalid Type
```json
{
  "error": "SKS dan semester harus berupa angka"
}
```

---

## 4. PUT Update Matakuliah

### Request
```http
PUT /api/matakuliah/4 HTTP/1.1
Host: localhost:6543
Content-Type: application/json

{
  "sks": 4,
  "semester": 6
}
```

### Request Fields (All Optional)
| Field | Type | Optional | Description |
|-------|------|----------|-------------|
| kode_mk | string | Yes | Kode mata kuliah baru |
| nama_mk | string | Yes | Nama mata kuliah baru |
| sks | integer | Yes | Jumlah SKS baru |
| semester | integer | Yes | Semester baru |

**Note:** Anda bisa update satu atau lebih field sekaligus.

### Response (200 OK)
```json
{
  "success": true,
  "matakuliah": {
    "id": 4,
    "kode_mk": "IF301",
    "nama_mk": "Pemrograman Web",
    "sks": 4,
    "semester": 6
  }
}
```

### Response (404 Not Found)
```json
{
  "error": "Matakuliah tidak ditemukan"
}
```

### Response (400 Bad Request) - Invalid Type
```json
{
  "error": "SKS harus berupa angka"
}
```

---

## 5. DELETE Matakuliah

### Request
```http
DELETE /api/matakuliah/4 HTTP/1.1
Host: localhost:6543
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Matakuliah dengan id 4 berhasil dihapus"
}
```

### Response (404 Not Found)
```json
{
  "error": "Matakuliah tidak ditemukan"
}
```

---

## Error Handling

### HTTP Status Codes
| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request (validation error) |
| 404 | Not Found |
| 500 | Internal Server Error |

### Error Response Format
All errors return JSON with an `error` field:
```json
{
  "error": "Error message here"
}
```

---

## Testing Examples

### PowerShell

```powershell
# GET all
(Invoke-WebRequest -Uri "http://localhost:6543/api/matakuliah" -Method GET).Content

# GET detail
(Invoke-WebRequest -Uri "http://localhost:6543/api/matakuliah/1" -Method GET).Content

# POST
$body = @{kode_mk='IF301'; nama_mk='Pemrograman Web'; sks=3; semester=5} | ConvertTo-Json
(Invoke-WebRequest -Uri "http://localhost:6543/api/matakuliah" -Method POST -Body $body -ContentType "application/json").Content

# PUT
$body = @{sks=4} | ConvertTo-Json
(Invoke-WebRequest -Uri "http://localhost:6543/api/matakuliah/4" -Method PUT -Body $body -ContentType "application/json").Content

# DELETE
(Invoke-WebRequest -Uri "http://localhost:6543/api/matakuliah/4" -Method DELETE).Content
```

### curl (Linux/macOS/Windows)

```bash
# GET all
curl -X GET http://localhost:6543/api/matakuliah

# GET detail
curl -X GET http://localhost:6543/api/matakuliah/1

# POST
curl -X POST http://localhost:6543/api/matakuliah \
  -H "Content-Type: application/json" \
  -d '{"kode_mk":"IF301","nama_mk":"Pemrograman Web","sks":3,"semester":5}'

# PUT
curl -X PUT http://localhost:6543/api/matakuliah/4 \
  -H "Content-Type: application/json" \
  -d '{"sks":4,"semester":6}'

# DELETE
curl -X DELETE http://localhost:6543/api/matakuliah/4
```

---

## Database Schema

### Table: matakuliah

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique identifier |
| kode_mk | TEXT | UNIQUE, NOT NULL | Course code |
| nama_mk | TEXT | NOT NULL | Course name |
| sks | INTEGER | NOT NULL | Credit hours |
| semester | INTEGER | NOT NULL | Semester number |

### SQL Table Creation
```sql
CREATE TABLE matakuliah (
    id SERIAL PRIMARY KEY,
    kode_mk TEXT UNIQUE NOT NULL,
    nama_mk TEXT NOT NULL,
    sks INTEGER NOT NULL,
    semester INTEGER NOT NULL
);
```

---

## Sample Data

Initial data seeded in database:

```json
[
  {
    "id": 1,
    "kode_mk": "IF101",
    "nama_mk": "Algoritma dan Pemrograman",
    "sks": 3,
    "semester": 1
  },
  {
    "id": 2,
    "kode_mk": "IF102",
    "nama_mk": "Struktur Data",
    "sks": 4,
    "semester": 2
  },
  {
    "id": 3,
    "kode_mk": "IF201",
    "nama_mk": "Basis Data",
    "sks": 3,
    "semester": 3
  }
]
```

---

## Notes

1. All endpoints return JSON
2. Content-Type must be `application/json` for POST/PUT requests
3. ID in URL must be integer
4. kode_mk must be unique across all records
5. sks and semester must be positive integers
6. No authentication required (for development)

---

**Last Updated:** November 10, 2025
**Version:** 1.0
**Author:** Muhammad Yusuf (122140193)
