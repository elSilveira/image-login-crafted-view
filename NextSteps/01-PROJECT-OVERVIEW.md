# Project Overview - IAZI Platform

## Current State Summary

**Project:** IAZI - Professional Services Marketplace  
**Stack:** React + TypeScript + Vite + TailwindCSS + shadcn/ui  
**Backend:** REST API (deployed separately)  
**Deployment:** Railway (Docker-based)

## Core Features Status

| Module | Status | Notes |
|--------|--------|-------|
| Authentication | ✅ Complete | JWT + Refresh Token |
| User Profile | ✅ Complete | CRUD operations |
| Professional Profile | ✅ Complete | Multi-role support |
| Company Registration | ✅ Complete | Full CRUD |
| Services Search | ✅ Complete | Unified search API |
| Booking Flow | ✅ Complete | Multi-service support |
| Calendar (Pro) | ✅ Complete | Day/Week/Month views |
| Reviews System | ✅ Complete | Full integration |
| Dashboard (Pro) | ⚠️ Partial | Mock fallbacks exist |
| Notifications | ⚠️ Partial | UI only, no real-time |
| Gamification | ⚠️ Partial | Mock data only |
| PWA Support | ⚠️ Partial | Basic manifest |
| Company Admin | ✅ Complete | Full dashboard |

## Architecture

```
src/
├── api/           # Centralized API services
├── components/    # Reusable UI components
├── contexts/      # Auth context
├── hooks/         # Custom React hooks
├── lib/           # Utilities & config
├── pages/         # Route pages
└── types/         # TypeScript types
```

## Key Integrations

- **API URL:** `VITE_API_URL` (configurable)
- **Auth:** Bearer token in headers
- **Data Fetching:** TanStack Query (React Query)
- **Forms:** react-hook-form + zod
- **Date Handling:** date-fns

## Deployment

- **Platform:** Railway
- **Build:** Docker multi-stage (nginx)
- **Domain:** www.iazi.io
