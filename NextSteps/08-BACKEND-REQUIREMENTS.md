# Backend Requirements for Frontend

## APIs Needing Implementation/Fix

### 1. Dashboard Stats (Priority: High)

**Endpoint:** `GET /api/professionals/:id/dashboard-stats`

**Expected Response:**
```json
{
  "currentMonthRevenue": 4230,
  "previousMonthRevenue": 3780,
  "currentMonthAppointments": 78,
  "previousMonthAppointments": 72,
  "currentMonthNewClients": 24,
  "previousMonthNewClients": 25
}
```

**Notes:**
- Frontend currently uses mock fallback
- Should calculate from appointments table
- Revenue from completed appointments only

---

### 2. Popular Services (Priority: High)

**Endpoint:** `GET /api/professionals/:id/popular-services`

**Expected Response:**
```json
[
  {
    "id": "uuid",
    "name": "Service Name",
    "appointmentCount": 32,
    "rating": 4.8
  }
]
```

**Notes:**
- Order by appointmentCount DESC
- Limit to top 5-10 services
- Include average rating from reviews

---

### 3. Upcoming Appointments (Priority: High)

**Endpoint:** `GET /api/appointments/upcoming`

**Query Params:**
- `professionalId` (required)
- `limit` (default: 5)
- `page` (default: 1)

**Expected Response:**
```json
{
  "data": [{
    "id": "uuid",
    "startTime": "ISO8601",
    "endTime": "ISO8601",
    "status": "CONFIRMED",
    "user": { "id", "name", "email", "avatar" },
    "services": [{ "service": { "id", "name", "price", "duration" }}]
  }],
  "pagination": { "total", "page", "pageSize", "totalPages" }
}
```

**Notes:**
- Filter: status IN (PENDING, CONFIRMED)
- Filter: startTime >= now()
- Sort: startTime ASC

---

### 4. Notifications System (Priority: Medium)

**Required Endpoints:**

```
GET  /api/notifications
POST /api/notifications/:id/read
POST /api/notifications/read-all
```

**Notification Types:**
- `APPOINTMENT_CREATED`
- `APPOINTMENT_CONFIRMED`
- `APPOINTMENT_CANCELLED`
- `APPOINTMENT_REMINDER`
- `NEW_REVIEW`
- `SYSTEM`

**Response Format:**
```json
{
  "data": [{
    "id": "uuid",
    "type": "APPOINTMENT_REMINDER",
    "title": "Lembrete de agendamento",
    "message": "Você tem um agendamento em 1 hora",
    "read": false,
    "data": { "appointmentId": "uuid" },
    "createdAt": "ISO8601"
  }],
  "unreadCount": 5
}
```

---

### 5. Gamification System (Priority: Low)

**Required Endpoints:**

```
GET  /api/users/me/achievements
GET  /api/users/me/points
POST /api/users/me/achievements/:id/claim
```

**Achievement Structure:**
```json
{
  "id": "first-booking",
  "title": "Primeiros Passos",
  "description": "Complete seu primeiro agendamento",
  "icon": "star",
  "points": 100,
  "progress": 1,
  "target": 1,
  "completed": true,
  "completedAt": "ISO8601"
}
```

---

### 6. Real-Time Updates (Priority: Medium)

**WebSocket Events Needed:**
- `appointment.created`
- `appointment.updated`
- `appointment.cancelled`
- `notification.new`
- `review.new`

**Connection:**
```
wss://api.iazi.io/ws?token=JWT
```

---

### 7. Forgot Password Flow (Priority: Medium)

**Required Endpoints:**

```
POST /api/auth/forgot-password
  Body: { email }
  Response: { message: "Email sent" }

POST /api/auth/reset-password
  Body: { token, newPassword }
  Response: { message: "Password reset" }
```

---

## Data Model Requirements

### Appointment Status Values
Frontend expects these exact values:
- `PENDING`
- `CONFIRMED`
- `IN_PROGRESS`
- `COMPLETED`
- `CANCELLED`
- `NO_SHOW`

### Date/Time Format
- All times in ISO 8601: `2025-05-15T14:00:00Z`
- Dates only: `2025-05-15`
- Duration: minutes as integer (e.g., `60`)

### Response Formats
Standard paginated response:
```json
{
  "data": [],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

Error response:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": []
}
```
