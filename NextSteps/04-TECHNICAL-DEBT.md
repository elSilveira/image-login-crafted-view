# Technical Debt & Refactoring

## Code Quality Issues

### 1. Duplicate API Code
**Location:** `src/lib/api.ts` + `src/api/*.ts`  
**Issue:** Two API implementations exist  
**Action:** Complete migration to `src/api/` structure

```
# Files to consolidate:
src/lib/api.ts              → Remove (legacy)
src/lib/api-services.ts     → Remove
src/lib/api-config.ts       → Keep (config only)
src/api/                    → Primary location
```

### 2. Inconsistent Type Definitions
**Locations:** 
- `src/api/types.ts`
- `src/types/reviews.ts`
- `src/pages/ProfessionalProfile.tsx` (inline types)

**Action:** Centralize all types in `src/types/`

### 3. Multiple App Entry Points
**Files:**
- `src/App.tsx` (main)
- `src/GradualApp.tsx`
- `src/SimpleApp.tsx`
- `src/WorkingApp.tsx`
- `src/TestApp.tsx`
- `src/PwaApp.tsx`

**Action:** Remove unused entry points, keep only `App.tsx`

---

## Component Refactoring

### 4. Large Components
| File | Lines | Recommendation |
|------|-------|----------------|
| CompanyDashboard | ~500+ | Split into sub-components |
| ProfessionalProfile | ~400+ | Extract sections |
| Booking | ~350+ | Extract steps |

### 5. Missing PropTypes/Strict Types
Many components use `any` type:
```typescript
// Bad
const Component = ({ data }: { data: any }) => ...

// Good  
const Component = ({ data }: { data: ServiceData }) => ...
```

---

## Performance Issues

### 6. Bundle Size
```
CompanyDashboard: 390KB (recharts heavy)
index.js: 706KB (main bundle)
```

**Actions:**
- Dynamic import for recharts
- Tree-shake unused Radix components
- Consider lighter chart library

### 7. Unnecessary Re-renders
- Missing `React.memo()` on list items
- Missing `useMemo()` for computed values
- Missing `useCallback()` for handlers

---

## Architecture Improvements

### 8. State Management
**Current:** Context + React Query  
**Issue:** No global UI state management  
**Consider:** Zustand for UI state

### 9. Form Handling
**Current:** Mix of controlled/uncontrolled  
**Action:** Standardize with react-hook-form

### 10. API Response Normalization
**Issue:** Different response shapes handled inline  
**Action:** Create normalization layer

```typescript
// Create src/api/normalizers.ts
export function normalizeAppointment(raw: any): Appointment {
  return {
    id: raw.id,
    startTime: raw.startTime || raw.date,
    // ... normalize fields
  };
}
```

---

## Files to Delete

```
src/GradualApp.tsx
src/SimpleApp.tsx
src/WorkingApp.tsx
src/TestApp.tsx
src/test-main.tsx
src/pages/DebugBookingsPage.tsx
src/pages/TestBookingsList.tsx
src/components/professional/ProfessionalRescheduleModal.tsx.fixed
```

---

## Migration Priority

1. **High:** Remove duplicate API code
2. **High:** Centralize types
3. **Medium:** Split large components
4. **Medium:** Bundle optimization
5. **Low:** Remove test files
