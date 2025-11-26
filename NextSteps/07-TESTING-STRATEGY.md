# Testing Strategy

## Current State

**Test Coverage:** ~1%  
**Test Files:** 1 (`ProfessionalProfileSettings.test.tsx`)  
**Framework:** Not configured

---

## Recommended Setup

### Install Dependencies
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event msw
```

### Vitest Config
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});
```

### Setup File
```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

## Priority Test Areas

### Critical Path Tests

1. **Authentication Flow**
   - Login success/failure
   - Token refresh
   - Logout

2. **Booking Flow**
   - Service selection
   - Time slot selection
   - Confirmation
   - Multi-service booking

3. **Profile Management**
   - View profile
   - Edit profile
   - Address management

### Component Tests

| Component | Priority | Complexity |
|-----------|----------|------------|
| Navigation | High | Low |
| BookingCalendar | High | Medium |
| ServiceSelector | High | Medium |
| AppointmentCard | Medium | Low |
| ReviewForm | Medium | Medium |
| SearchDropdown | Medium | Medium |

---

## Test Examples

### API Mock with MSW
```typescript
// src/test/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/appointments', (req, res, ctx) => {
    return res(ctx.json({ data: [] }));
  }),
  rest.post('/api/auth/login', async (req, res, ctx) => {
    const { email } = await req.json();
    if (email === 'test@test.com') {
      return res(ctx.json({ accessToken: 'token', user: {} }));
    }
    return res(ctx.status(401));
  }),
];
```

### Component Test
```typescript
// src/components/__tests__/Navigation.test.tsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navigation from '../Navigation';

describe('Navigation', () => {
  it('renders logo', () => {
    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );
    expect(screen.getByAltText(/iazi/i)).toBeInTheDocument();
  });
});
```

### Integration Test
```typescript
// src/pages/__tests__/Login.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';

const wrapper = ({ children }) => (
  <QueryClientProvider client={new QueryClient()}>
    <BrowserRouter>{children}</BrowserRouter>
  </QueryClientProvider>
);

describe('Login Page', () => {
  it('submits login form', async () => {
    render(<Login />, { wrapper });
    
    await userEvent.type(screen.getByLabelText(/email/i), 'test@test.com');
    await userEvent.type(screen.getByLabelText(/senha/i), 'password');
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));
    
    await waitFor(() => {
      expect(screen.queryByText(/erro/i)).not.toBeInTheDocument();
    });
  });
});
```

---

## Coverage Goals

| Phase | Target | Timeline |
|-------|--------|----------|
| Phase 1 | 30% | 2 weeks |
| Phase 2 | 50% | 4 weeks |
| Phase 3 | 70% | 8 weeks |

Focus areas by phase:
1. Critical user flows
2. Form components
3. Edge cases
