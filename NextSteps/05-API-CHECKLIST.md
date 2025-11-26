# API Endpoints Checklist

## Authentication

| Endpoint | Method | Status | Frontend Usage |
|----------|--------|--------|----------------|
| `/auth/login` | POST | ✅ | AuthContext |
| `/auth/logout` | POST | ✅ | AuthContext |
| `/auth/refresh` | POST | ✅ | API interceptor |
| `/auth/register` | POST | ✅ | Register page |
| `/auth/forgot-password` | POST | ❓ | ForgotPassword page |

---

## Users

| Endpoint | Method | Status | Frontend Usage |
|----------|--------|--------|----------------|
| `/users/me` | GET | ✅ | UserProfile |
| `/users/me` | PUT | ✅ | UserProfile update |
| `/users/me/addresses` | GET | ✅ | Address management |
| `/users/me/addresses` | POST | ✅ | Add address |
| `/users/me/addresses/:id` | PUT | ✅ | Update address |
| `/users/me/addresses/:id` | DELETE | ✅ | Delete address |

---

## Professionals

| Endpoint | Method | Status | Frontend Usage |
|----------|--------|--------|----------------|
| `/professionals` | GET | ✅ | Search, listings |
| `/professionals/:id` | GET | ✅ | Profile page |
| `/professionals/me` | GET | ✅ | Pro dashboard |
| `/professionals/me` | PUT | ✅ | Pro settings |
| `/professionals/:id/services` | GET | ✅ | Service listing |
| `/professionals/:id/availability` | GET | ✅ | Booking slots |
| `/professionals/:id/dashboard-stats` | GET | ⚠️ | Dashboard (mock fallback) |
| `/professionals/:id/popular-services` | GET | ⚠️ | Dashboard (mock fallback) |
| `/professionals/:id/book` | POST | ✅ | Booking flow |

---

## Appointments

| Endpoint | Method | Status | Frontend Usage |
|----------|--------|--------|----------------|
| `/appointments` | GET | ✅ | Calendar, history |
| `/appointments` | POST | ✅ | Create booking |
| `/appointments/me` | GET | ✅ | User history |
| `/appointments/upcoming` | GET | ⚠️ | Dashboard |
| `/appointments/:id` | GET | ✅ | Details view |
| `/appointments/:id/status` | PATCH | ✅ | Status change |
| `/appointments/:id/cancel` | POST | ✅ | Cancel booking |
| `/appointments/:id/reschedule` | POST | ✅ | Reschedule |
| `/appointments/:id/review-status` | GET | ⚠️ | Review check |
| `/appointments/availability` | GET | ✅ | Time slots |

---

## Companies

| Endpoint | Method | Status | Frontend Usage |
|----------|--------|--------|----------------|
| `/companies` | GET | ✅ | Search, listings |
| `/companies` | POST | ✅ | Register company |
| `/companies/:id` | GET | ✅ | Company profile |
| `/companies/:id` | PUT | ✅ | Update company |
| `/companies/:id/services` | GET | ✅ | Company services |
| `/companies/:id/appointments` | GET | ✅ | Company calendar |
| `/companies/:id/staff` | GET | ✅ | Staff management |

---

## Services

| Endpoint | Method | Status | Frontend Usage |
|----------|--------|--------|----------------|
| `/services` | GET | ✅ | Search, listings |
| `/services/:id` | GET | ✅ | Service details |
| `/services/:id/direct-booking-eligibility` | GET | ⚠️ | Quick booking |

---

## Categories

| Endpoint | Method | Status | Frontend Usage |
|----------|--------|--------|----------------|
| `/categories` | GET | ✅ | Home, filters |

---

## Reviews

| Endpoint | Method | Status | Frontend Usage |
|----------|--------|--------|----------------|
| `/reviews` | GET | ✅ | Review lists |
| `/reviews` | POST | ✅ | Submit review |
| `/reviews/:id` | GET | ✅ | Single review |
| `/reviews/:id` | PUT | ✅ | Edit review |
| `/reviews/:id` | DELETE | ✅ | Delete review |
| `/reviews/professional/:id` | GET | ✅ | Pro reviews |

---

## Search

| Endpoint | Method | Status | Frontend Usage |
|----------|--------|--------|----------------|
| `/search` | GET | ✅ | Unified search |
| `/search/quick-booking` | GET | ⚠️ | Quick actions |

---

## Notifications

| Endpoint | Method | Status | Frontend Usage |
|----------|--------|--------|----------------|
| `/notifications` | GET | ⚠️ | Notification list |
| `/notifications/:id/read` | PATCH | ❓ | Mark as read |

---

## Legend

- ✅ Confirmed working
- ⚠️ Needs validation / has fallback
- ❓ Unknown / not tested
- ❌ Not implemented
