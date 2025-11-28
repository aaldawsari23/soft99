# 🧪 Testing Guide

## Setup

Install test dependencies:

```bash
npm install
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Coverage

### ✅ Catalog Filters (`src/components/__tests__/CatalogContent.test.tsx`)

Tests the filter functionality on the catalog page:

- ✓ Renders all products initially
- ✓ Filters by category chip clicks
- ✓ Filters by brand chip clicks
- ✓ Searches products by name
- ✓ Clears all filters
- ✓ Shows correct product count
- ✓ Respects initial category from URL params

**Critical for:** Preventing regressions in product filtering logic

---

### ✅ Product Detail Routing (`src/app/(public)/product/[id]/__tests__/page.test.tsx`)

Tests product page routing and data display:

- ✓ Renders product with correct ID
- ✓ Calls `notFound()` for invalid IDs
- ✓ Displays specifications correctly
- ✓ Shows SKU, breadcrumb, badges
- ✓ Formats price with Arabic locale
- ✓ Renders category and brand info

**Critical for:** Ensuring product pages load correctly and handle invalid routes

---

### ✅ WhatsApp Order Button (`src/components/__tests__/CartDrawer.test.tsx`)

Tests cart and WhatsApp integration:

- ✓ Generates correct WhatsApp URL with cart items
- ✓ Calculates total price correctly
- ✓ Shows empty cart message
- ✓ Prevents WhatsApp call when cart is empty
- ✓ Updates quantity correctly
- ✓ Removes items from cart
- ✓ Clears entire cart
- ✓ Closes drawer on button click

**Critical for:** Preventing broken order flows and WhatsApp integration

---

## Test Structure

```
src/
├── components/
│   ├── __tests__/
│   │   ├── CatalogContent.test.tsx
│   │   └── CartDrawer.test.tsx
│   └── ...
├── app/
│   └── (public)/
│       └── product/
│           └── [id]/
│               ├── __tests__/
│               │   └── page.test.tsx
│               └── page.tsx
└── ...
```

## Coverage Goals

- Critical user flows: **100%** (catalog, product detail, cart)
- UI components: **80%**
- Utilities: **90%**

## Best Practices

1. **Test user behavior, not implementation**
   - ✅ `fireEvent.click(button)`
   - ❌ Testing internal state directly

2. **Use data-testid sparingly**
   - Prefer accessible queries: `getByRole`, `getByText`, `getByLabelText`

3. **Mock external dependencies**
   - `next/navigation` (router, params)
   - `window.open` for WhatsApp
   - `localStorage` for cart

4. **Keep tests fast**
   - No network calls
   - No real file system operations
   - Mock heavy computations

## CI/CD Integration

Add to your CI pipeline:

```yaml
- name: Run Tests
  run: npm test

- name: Type Check
  run: npm run type-check

- name: Lint
  run: npm run lint
```

## Debugging Tests

```bash
# Run specific test file
npm test -- CatalogContent

# Run tests matching pattern
npm test -- --testNamePattern="filter"

# Show console logs
npm test -- --verbose
```

## Adding New Tests

When adding new features, create tests in `__tests__` directory next to the component:

```
src/components/MyComponent.tsx
src/components/__tests__/MyComponent.test.tsx
```

Follow the existing test patterns for consistency.
