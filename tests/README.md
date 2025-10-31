# Playwright Testing Setup

This project includes comprehensive Playwright tests for all components and user flows.

## Test Structure

```
tests/
├── components.test.ts    # Component-level tests (Button, Card, Input, Layout)
├── pages.test.ts         # Page-level tests (Dashboard, API Keys, Usage, etc.)
├── features.test.ts      # Feature tests (Dev Toolbar, Redux, Charts)
├── e2e.test.ts          # End-to-end user workflows
├── example.test.ts      # Basic smoke tests
├── utils/
│   └── helpers.ts       # Test helper functions
└── fixtures/
    └── testData.ts      # Mock data and test fixtures
```

## Running Tests

### Basic Commands
```bash
# Run all tests
npm run test

# Run tests with browser UI
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Debug tests
npm run test:debug

# Show test report
npm run test:report
```

### Specific Test Suites
```bash
# Component tests only
npm run test:components

# Page tests only
npm run test:pages

# Feature tests only
npm run test:features

# End-to-end tests only
npm run test:e2e
```

### Development
```bash
# Run tests in watch mode (not configured yet)
npx playwright test --ui

# Run specific test file
npx playwright test tests/example.test.ts

# Run specific browser
npx playwright test --project=chromium
```

## Test Features

### 🧪 **Component Tests**
- **Button Component**: Tests all variants (primary, secondary, ghost, danger), hover states, disabled states
- **Card Component**: Tests styling, hover effects, content display
- **Input Component**: Tests focus states, validation, labels, placeholders
- **Layout Component**: Tests navigation, active states, dark theme styling, user display

### 📄 **Page Tests**
- **Dashboard Page**: Tests overview display, Halloween banner, navigation
- **API Keys Page**: Tests CRUD operations, security warnings, form validation
- **Usage Page**: Tests chart loading, filtering, responsive design
- **Login Page**: Tests authentication flow, form validation
- **Docs Page**: Tests documentation display, code examples

### ⚡ **Feature Tests**
- **Dev Toolbar**: Tests feature flag toggles, quick actions, state persistence
- **Halloween Banner**: Tests display, dismissal, interactions
- **Redux State**: Tests state management across components and pages
- **Chart Filtering**: Tests time period filters, data format switching
- **Authentication**: Tests login/logout flow, protected routes, session handling

### 🔄 **End-to-End Tests**
- **User Onboarding**: Complete new user workflow from login to key creation
- **API Key Management**: Multi-key creation, management, and lifecycle
- **Analytics Exploration**: Systematic data exploration across time periods
- **Feature Flag Workflow**: Development workflow with feature toggles
- **Error Handling**: Edge cases, form validation, rapid navigation
- **Cross-browser**: Compatibility testing across Chromium, Firefox, WebKit

## Test Utilities

### Helper Classes
- `AuthHelper`: Login/logout functionality
- `APIKeysHelper`: API key creation, copying, hiding, deletion
- `ChartHelper`: Chart interactions, filtering, data verification
- `DevToolbarHelper`: Feature flag management
- `ComponentHelper`: Generic component verification
- `WaitHelper`: Timing and loading utilities

### Mock Data
- User accounts and credentials
- API key samples with different states
- Usage analytics data (daily/hourly)
- Feature flag configurations
- Test selectors and messages

## Configuration

The tests are configured to:
- Run on multiple browsers (Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari)
- Take screenshots on failure
- Generate HTML reports
- Run against `http://localhost:5174` (auto-started dev server)
- Support parallel execution
- Include accessibility testing capabilities

## CI/CD Integration

GitHub Actions workflow (`.github/workflows/playwright.yml`) includes:
- Automated test execution on push/PR
- Multi-browser testing matrix
- Artifact collection for reports
- Test result reporting

## Best Practices

1. **Page Object Pattern**: Using helper classes for reusable page interactions
2. **Test Data Management**: Centralized mock data and fixtures
3. **Assertions**: Comprehensive expect statements for UI and functionality
4. **Error Handling**: Graceful handling of missing elements and edge cases
5. **Performance**: Optimized waits and selectors for fast test execution
6. **Maintenance**: Clear test structure and documentation

## Troubleshooting

### Common Issues
- **Port conflicts**: Tests expect dev server on port 5174
- **Timing issues**: Use proper waits for dynamic content
- **Element selection**: Use data-testid attributes for stable selectors
- **Authentication**: Tests handle login state automatically

### Debugging
```bash
# Run with debug mode
npm run test:debug

# Run single test with console logs
npx playwright test --headed --workers=1 tests/example.test.ts
```

## Coverage

The test suite provides comprehensive coverage for:
- ✅ All React components and their states
- ✅ All application pages and user flows  
- ✅ Authentication and authorization
- ✅ Feature flags and development tools
- ✅ Chart interactions and data filtering
- ✅ Form validation and error handling
- ✅ Responsive design across viewports
- ✅ Cross-browser compatibility
- ✅ Redux state management
- ✅ API key security workflows