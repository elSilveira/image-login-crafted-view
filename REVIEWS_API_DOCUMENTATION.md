# IAZI Reviews API Documentation

This document provides comprehensive details about the Reviews feature in the IAZI backend API to facilitate frontend implementation.

## Table of Contents

1. [Overview](#overview)
2. [Review Model](#review-model)
3. [Endpoints](#endpoints)
   - [Get Reviews](#get-reviews)
   - [Get Review by ID](#get-review-by-id)
   - [Get Professional Reviews](#get-professional-reviews)
   - [Create Review](#create-review)
   - [Update Review](#update-review)
   - [Delete Review](#delete-review)
4. [Authentication](#authentication)
5. [Rating Calculation](#rating-calculation)
6. [Error Handling](#error-handling)
7. [Integration Features](#integration-features)
8. [Frontend Implementation Guidelines](#frontend-implementation-guidelines)

## Overview

The Reviews API allows users to create, read, update, and delete reviews for services, professionals, or companies within the IAZI platform. Each review includes a numerical rating (1-5) and an optional comment. The system automatically calculates and updates the average rating and total review count for the reviewed entity (service, professional, or company).

## Review Model

The Review model has the following structure:

| Field          | Type     | Description                                          | Required | Constraints       |
|----------------|----------|------------------------------------------------------|----------|-------------------|
| id             | UUID     | Unique identifier for the review                     | Auto     | Auto-generated    |
| rating         | Float    | Numerical rating                                     | Yes      | Between 1 and 5   |
| comment        | String   | Text review content                                  | No       | Optional          |
| userId         | UUID     | ID of the user who created the review                | Yes      | Valid user ID     |
| serviceId      | UUID     | ID of the service being reviewed                     | No*      | Valid service ID  |
| professionalId | UUID     | ID of the professional being reviewed                | No*      | Valid prof. ID    |
| companyId      | UUID     | ID of the company being reviewed                     | No*      | Valid company ID  |
| updatedAt      | DateTime | Last update timestamp                                | Auto     | Auto-updated      |

*At least one of serviceId, professionalId, or companyId must be provided.

A review can be associated with either a service, a professional, or a company, but it must be associated with at least one of these entities.

## Endpoints

### Get Reviews

Retrieves a list of reviews filtered by service, professional, or company ID.

**URL:** `/reviews`

**Method:** `GET`

**Authentication:** Not required

**Query Parameters:**
- `serviceId` (optional): UUID of service to filter reviews
- `professionalId` (optional): UUID of professional to filter reviews
- `companyId` (optional): UUID of company to filter reviews

**Note:** At least one filter parameter must be provided.

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
[
  {
    "id": "uuid-string",
    "rating": 4.5,
    "comment": "Great service!",
    "userId": "user-uuid-string",
    "serviceId": "service-uuid-string",
    "professionalId": null,
    "companyId": null,
    "updatedAt": "2025-05-18T15:30:00Z",
    "user": {
      "id": "user-uuid-string",
      "name": "User Name",
      "avatar": "avatar-url"
    }
  },
  // ... more reviews
]
```

**Error Responses:**
- **Code:** 400 BAD REQUEST
  - If no filter parameter is provided:
  ```json
  {
    "message": "É necessário fornecer serviceId, professionalId ou companyId para filtrar as avaliações"
  }
  ```
  - If an invalid UUID is provided:
  ```json
  {
    "message": "Formato de ID do serviço inválido."
  }
  ```

### Get Review by ID

Retrieves a single review by its ID.

**URL:** `/reviews/:id`

**Method:** `GET`

**Authentication:** Not required

**URL Parameters:**
- `id`: UUID of the review to retrieve

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "id": "uuid-string",
  "rating": 4.5,
  "comment": "Great service!",
  "userId": "user-uuid-string",
  "serviceId": "service-uuid-string",
  "professionalId": null,
  "companyId": null,
  "updatedAt": "2025-05-18T15:30:00Z",
  "user": {
    "id": "user-uuid-string",
    "name": "User Name",
    "avatar": "avatar-url"
  }
}
```

**Error Responses:**
- **Code:** 400 BAD REQUEST
  ```json
  {
    "message": "Formato de ID inválido."
  }
  ```
- **Code:** 404 NOT FOUND
  ```json
  {
    "message": "Avaliação não encontrada"
  }
  ```

### Get Professional Reviews

Retrieves all reviews for a specific professional, along with professional details.

**URL:** `/reviews/professional/:professionalId`

**Method:** `GET`

**Authentication:** Not required

**URL Parameters:**
- `professionalId`: UUID of the professional to get reviews for

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "professional": {
    "id": "prof-uuid-string",
    "name": "Professional Name",
    "image": "image-url",
    "coverImage": "cover-image-url",
    "bio": "Professional biography",
    "rating": 4.8,
    "totalReviews": 42,
    "role": "Hair Stylist"
  },
  "reviews": [
    {
      "id": "review-uuid-string",
      "rating": 5,
      "comment": "Excellent service!",
      "userId": "user-uuid-string",
      "professionalId": "prof-uuid-string",
      "updatedAt": "2025-05-18T15:30:00Z",
      "user": {
        "id": "user-uuid-string",
        "name": "User Name",
        "avatar": "avatar-url"
      }
    },
    // ... more reviews
  ],
  "count": 42
}
```

**Error Responses:**
- **Code:** 400 BAD REQUEST
  ```json
  {
    "message": "Formato de ID do profissional inválido."
  }
  ```
- **Code:** 404 NOT FOUND
  ```json
  {
    "message": "Profissional não encontrado"
  }
  ```

### Create Review

Creates a new review.

**URL:** `/reviews`

**Method:** `POST`

**Authentication:** Required

**Request Body:**
```json
{
  "rating": 4.5,
  "comment": "Great service!",
  "serviceId": "uuid-string",   // Optional (at least one ID must be provided)
  "professionalId": "uuid-string", // Optional
  "companyId": "uuid-string"    // Optional
}
```

**Success Response:**
- **Code:** 201 CREATED
- **Content:**
```json
{
  "id": "uuid-string",
  "rating": 4.5,
  "comment": "Great service!",
  "userId": "user-uuid-string",
  "serviceId": "service-uuid-string",
  "professionalId": null,
  "companyId": null,
  "updatedAt": "2025-05-18T15:30:00Z"
}
```

**Error Responses:**
- **Code:** 401 UNAUTHORIZED
  ```json
  {
    "message": "Usuário não autenticado."
  }
  ```
- **Code:** 400 BAD REQUEST
  - If required fields are missing:
  ```json
  {
    "message": "Avaliação (rating) e pelo menos um ID de serviço, profissional ou empresa são obrigatórios"
  }
  ```
  - If rating is invalid:
  ```json
  {
    "message": "A avaliação deve ser um valor numérico entre 1 e 5"
  }
  ```
  - If IDs are invalid:
  ```json
  {
    "message": "Formato de ID inválido para serviço, profissional ou empresa."
  }
  ```
- **Code:** 404 NOT FOUND
  ```json
  {
    "message": "Entidade relacionada (serviço, profissional ou empresa) não encontrada."
  }
  ```

### Update Review

Updates an existing review.

**URL:** `/reviews/:id`

**Method:** `PUT`

**Authentication:** Required (must be review owner or admin)

**URL Parameters:**
- `id`: UUID of the review to update

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Updated comment"
}
```

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "id": "uuid-string",
  "rating": 5,
  "comment": "Updated comment",
  "userId": "user-uuid-string",
  "serviceId": "service-uuid-string",
  "professionalId": null,
  "companyId": null,
  "updatedAt": "2025-05-18T15:40:00Z"
}
```

**Error Responses:**
- **Code:** 401 UNAUTHORIZED
  ```json
  {
    "message": "Usuário não autenticado."
  }
  ```
- **Code:** 403 FORBIDDEN
  ```json
  {
    "message": "Não autorizado a atualizar esta avaliação."
  }
  ```
- **Code:** 400 BAD REQUEST
  - If no update data is provided:
  ```json
  {
    "message": "Nenhum dado fornecido para atualização."
  }
  ```
  - If invalid rating:
  ```json
  {
    "message": "A avaliação deve ser um valor numérico entre 1 e 5"
  }
  ```
- **Code:** 404 NOT FOUND
  ```json
  {
    "message": "Avaliação não encontrada para atualização."
  }
  ```

### Delete Review

Deletes a review.

**URL:** `/reviews/:id`

**Method:** `DELETE`

**Authentication:** Required (must be review owner or admin)

**URL Parameters:**
- `id`: UUID of the review to delete

**Success Response:**
- **Code:** 204 NO CONTENT

**Error Responses:**
- **Code:** 401 UNAUTHORIZED
  ```json
  {
    "message": "Usuário não autenticado."
  }
  ```
- **Code:** 403 FORBIDDEN
  ```json
  {
    "message": "Não autorizado a deletar esta avaliação."
  }
  ```
- **Code:** 404 NOT FOUND
  ```json
  {
    "message": "Avaliação não encontrada para exclusão."
  }
  ```

## Authentication

- Authentication is required for all write operations (POST, PUT, DELETE).
- Authentication is not required for read operations (GET).
- The API uses JWT tokens for authentication.
- The authenticated user's ID is automatically used as the `userId` when creating a review.
- Only the review's owner or an admin can update or delete a review.

## Rating Calculation

When a review is created, updated, or deleted, the system automatically recalculates the average rating and total review count for the associated entity (service, professional, or company).

The calculation process:
1. Retrieves all ratings for the entity
2. Calculates the average rating
3. Counts the total number of reviews
4. Updates the entity with the new values

These transactions are performed atomically to ensure data consistency.

## Error Handling

The API follows RESTful error handling principles:
- 400 Bad Request: Invalid data or parameters
- 401 Unauthorized: Missing authentication
- 403 Forbidden: Insufficient permissions
- 404 Not Found: Resource not found
- 500 Internal Server Error: Unexpected server error

Each error response includes a descriptive message to guide troubleshooting.

## Integration Features

The Reviews API integrates with other features of the IAZI platform:

### Gamification System

When a user creates a review, a `REVIEW_CREATED` gamification event is triggered, which may award points or badges based on the platform's gamification rules.

### Activity Logging

Review activities are logged in the user's activity feed:
- Creating a review logs a `NEW_REVIEW` activity
- The activity includes details about what was reviewed and the rating given

## Frontend Implementation Guidelines

### Displaying Reviews

1. Use the `GET /reviews` endpoint with appropriate filters to fetch reviews for a specific entity.
2. Display reviews sorted by most recent first (API returns them sorted by `updatedAt` in descending order).
3. Show the reviewer's name and avatar along with the review content.
4. Implement pagination or infinite scrolling for entities with many reviews.

### User Reviews Management

1. Allow authenticated users to create reviews for services, professionals, or companies they've interacted with.
2. Provide a 1-5 star rating UI component.
3. Provide a text area for optional comments.
4. Allow users to edit or delete their own reviews.
5. Implement appropriate error handling to guide users when validation fails.

### Average Rating Display

1. Display the average rating from the entity's data (service, professional, or company).
2. Show the total number of reviews alongside the average rating.
3. Consider using a visual element like star icons to represent the rating.
4. Update this display when a user adds, edits, or removes their review.

### Security Considerations

1. Never store JWT tokens in localStorage due to XSS vulnerability.
2. Use appropriate measures to prevent CSRF attacks.
3. Validate all input data on the frontend before sending to the API.
4. Handle authentication errors appropriately, redirecting to login when needed.
