# ServiConnect API Documentation

## Introduction

ServiConnect is a platform that connects users with professionals and service providers. This documentation covers the main functionalities of the backend API, including user management, appointment scheduling, service discovery, and professional profiles.

## Table of Contents

- [API Overview](#api-overview)
- [Authentication](#authentication)
- [Users](#users)
- [Professionals](#professionals)
- [Services](#services)
- [Appointments](#appointments)
- [Search](#search)
- [Notifications](#notifications)

## API Overview

The ServiConnect API is built on Node.js with Express and uses Prisma ORM for database interactions. The API follows RESTful conventions and returns data in JSON format.

Base URL: `http://localhost:3002`

## Authentication

### Login

```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

**Response (200 OK):**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "USER"
  }
}
```

### Register

```
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "your_password",
  "phone": "123456789"
}
```

## Users

### Get User Profile

```
GET /api/users/me
```

**Headers:**
```
Authorization: Bearer {token}
```

### Update User Profile

```
PUT /api/users/me
```

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "phone": "987654321",
  "bio": "Updated bio information"
}
```

## Professionals

### List Professionals

```
GET /api/professionals
```

**Query Parameters:**
- `category` - Filter by category
- `service` - Filter by service offered
- `sort` - Sort by rating, name (default: rating)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### Get Professional Details

```
GET /api/professionals/{id}
```

### Get Professional's Services

```
GET /api/professionals/{id}/services
```

## Services

### List Services

```
GET /api/services
```

**Query Parameters:**
- `category` - Filter by category
- `sort` - Sort by popularity, price (default: popularity)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### Get Service Details

```
GET /api/services/{id}
```

### Get Service Providers

```
GET /api/services/{id}/professionals
```

## Appointments

### List My Appointments

```
GET /api/appointments/me
```

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` - Filter by status (PENDING, CONFIRMED, CANCELLED, COMPLETED)
- `dateFrom` - Start date (format: YYYY-MM-DD)
- `dateTo` - End date (format: YYYY-MM-DD)

### Create Appointment

```
POST /api/appointments
```

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "serviceIds": ["service_id_1", "service_id_2"],
  "professionalId": "professional_id",
  "date": "2025-05-20",
  "time": "14:30",
  "notes": "Optional additional notes"
}
```

### Confirm Appointment

```
PUT /api/appointments/{id}/status
```

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "status": "CONFIRMED"
}
```

### Cancel Appointment

```
PUT /api/appointments/{id}/status
```

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "status": "CANCELLED"
}
```

### Check Availability

```
GET /api/appointments/availability
```

**Query Parameters:**
- `date` - Date to check (format: YYYY-MM-DD)
- `serviceId` - ID of the service
- `professionalId` - ID of the professional

## Search

### Search Everything

```
GET /api/search
```

**Query Parameters:**
- `q` - Search query
- `type` - Type of search (all, professionals, services)
- `category` - Filter by category
- `sort` - Sort criteria
- `page` - Page number
- `limit` - Items per page

### Search Professionals

```
GET /api/search/professionals
```

### Search Services

```
GET /api/search/services
```

## Notifications

### Get My Notifications

```
GET /api/notifications
```

**Headers:**
```
Authorization: Bearer {token}
```

### Mark Notification as Read

```
PUT /api/notifications/{id}/read
```

**Headers:**
```
Authorization: Bearer {token}
```

## Error Handling

The API uses conventional HTTP response codes to indicate success or failure:

- 2xx - Success
- 4xx - Client errors (bad request, unauthorized, etc.)
- 5xx - Server errors

Error responses follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": [
      {
        "field": "field_name",
        "message": "Error description for this field"
      }
    ]
  }
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse. Limits are:
- 100 requests per minute for authenticated users
- 30 requests per minute for unauthenticated users

## Data Models

### User
- id: UUID
- name: String
- email: String
- role: Enum (USER, PROFESSIONAL, ADMIN)
- phone: String (optional)
- avatar: String (optional)
- bio: String (optional)

### Professional
- id: UUID
- name: String
- role: String
- rating: Float
- image: String (optional)
- services: Array of Service
- company: Company (optional)

### Service
- id: UUID
- name: String
- description: String
- price: Decimal
- duration: String
- category: Category
- image: String (optional)

### Appointment
- id: UUID
- startTime: DateTime
- endTime: DateTime
- status: Enum (PENDING, CONFIRMED, CANCELLED, COMPLETED, IN_PROGRESS, NO_SHOW)
- user: User
- professional: Professional
- services: Array of Service
- notes: String (optional)

### ProfessionalService
- professionalId: UUID
- serviceId: UUID
- price: Decimal (optional)
- description: String (optional)
