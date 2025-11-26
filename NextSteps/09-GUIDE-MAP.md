# Guide Map - Page Routes & Components

## Public Routes

| Route | Page | Components Used | Status |
|-------|------|-----------------|--------|
| `/` | Home | HeroSection, CategorySection, ServicesSection, ProfessionalsSection | ✅ |
| `/login` | Login | Form, Input, Button | ✅ |
| `/register` | Register | Form, Multi-step wizard | ✅ |
| `/forgot-password` | ForgotPassword | Form, Input | ⚠️ |
| `/search` | Search | SearchDropdown, Filters, Results | ✅ |
| `/services` | Services | ServiceFilters, ServicePagination | ✅ |
| `/service/:id` | ServiceDetails | ServiceProviders, ServiceFAQ, Reviews | ✅ |
| `/professional/:id` | ProfessionalProfile | Calendar, Services, Reviews | ✅ |
| `/professionals` | Professionals | List, Filters | ✅ |
| `/company/:id` | CompanyProfile | Services, Staff, Reviews | ✅ |
| `/company/:id/services` | CompanyServices | ServicesList | ✅ |
| `/reviews` | Reviews | ReviewList, Filters | ✅ |

---

## Authenticated Routes (User)

| Route | Page | Components Used | Status |
|-------|------|-----------------|--------|
| `/profile` | UserProfile | Avatar, Form, Addresses | ✅ |
| `/booking-history` | BookingHistory | Calendar, List views | ✅ |
| `/booking/:serviceId` | Booking | Steps, ServiceSelector, TimeSlots | ✅ |
| `/booking/company/:companyId` | CompanyBooking | Same as Booking | ✅ |
| `/booking/reschedule/:appointmentId` | BookingReschedule | Calendar, TimeSlots | ✅ |
| `/notifications` | Notifications | NotificationList, Filters | ⚠️ |
| `/settings` | Settings | Tabs, Forms | ✅ |
| `/gamification` | Gamification | Cards, Progress | ⚠️ Mock |

---

## Professional Area Routes

| Route | Page | Layout | Status |
|-------|------|--------|--------|
| `/profile/professional` | ProfessionalProfileSettings | ProfessionalAreaLayout | ✅ |
| `/profile/professional/services` | ProfessionalServicesAdmin | ProfessionalAreaLayout | ✅ |
| `/profile/professional/dashboard` | ProfessionalDashboard | ProfessionalAreaLayout | ⚠️ |
| `/profile/professional/calendar` | ProfessionalCalendar | ProfessionalAreaLayout | ✅ |
| `/profile/professional/bookings` | ProfessionalBookings | ProfessionalAreaLayout | ✅ |
| `/profile/professional/reviews` | ProfessionalReviews | ProfessionalAreaLayout | ✅ |
| `/profile/professional/reports` | ProfessionalReports | ProfessionalAreaLayout | ⚠️ |
| `/profile/professional/settings` | ProfessionalSettings | ProfessionalAreaLayout | ✅ |

---

## Company Admin Routes

| Route | Page | Status |
|-------|------|--------|
| `/company/register` | CompanyRegister | ✅ |
| `/company/my-company/dashboard` | CompanyDashboard | ✅ |
| `/company/my-company/services` | CompanyServicesAdmin | ✅ |
| `/company/my-company/profile` | CompanyProfileAdmin | ✅ |
| `/company/my-company/settings` | CompanySettingsAdmin | ✅ |
| `/company/my-company/reviews` | CompanyReviewsAdmin | ✅ |
| `/company/my-company/reports` | CompanyReportsAdmin | ⚠️ |
| `/company/my-company/staff` | CompanyStaff | ✅ |
| `/company/my-company/calendar` | CompanyCalendar | ✅ |
| `/company/my-company/staff/:staffId/calendar` | StaffCalendar | ✅ |

---

## Debug/Test Routes (To Remove)

| Route | Page | Action |
|-------|------|--------|
| `/test/bookings` | TestBookingsList | DELETE |
| `/test/debug-bookings` | DebugBookingsPage | DELETE |

---

## Component Hierarchy

```
App.tsx
├── Navigation
├── Routes
│   ├── Home
│   │   ├── HeroSection
│   │   ├── CategorySection
│   │   ├── ServicesSection
│   │   └── ProfessionalsSection
│   │
│   ├── ProfessionalAreaLayout (wrapper)
│   │   ├── ProfessionalTopNav
│   │   └── Outlet (nested routes)
│   │
│   ├── Booking
│   │   ├── ServiceSelector
│   │   ├── BookingTimeSlots
│   │   └── BookingConfirmation
│   │
│   └── CompanyDashboard
│       ├── DashboardStats
│       ├── Charts (recharts)
│       └── Tables
│
├── Toaster
└── NetworkStatus
```

---

## Shared Components

| Component | Location | Used In |
|-----------|----------|---------|
| Navigation | `components/Navigation.tsx` | All pages |
| Button | `components/ui/button.tsx` | Everywhere |
| Card | `components/ui/card.tsx` | Lists, dashboards |
| Form | `components/ui/form.tsx` | All forms |
| Dialog | `components/ui/dialog.tsx` | Modals |
| Sheet | `components/ui/sheet.tsx` | Mobile menus |
| Calendar | `components/ui/calendar.tsx` | Booking, schedules |
| Skeleton | `components/ui/skeleton.tsx` | Loading states |
