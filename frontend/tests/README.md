# Restaurant App Testing Guide

## TestSprite Testing

This directory contains comprehensive tests for the Restaurant Management System frontend.

## Prerequisites

1. **Backend Server Running**: Make sure your Spring Boot backend is running on `http://localhost:8080`
2. **Frontend Dev Server Running**: The frontend should be running on `http://localhost:5173`
3. **TestSprite Installed**: Install TestSprite globally or use npx

## Test Coverage

The test suite covers:

### 1. **Core Pages**
- ✅ Home page load and content
- ✅ Menu page and item display
- ✅ Cart functionality
- ✅ Order history
- ✅ Payment page

### 2. **Authentication**
- ✅ User registration flow
- ✅ User login flow
- ✅ Form validation
- ✅ Protected routes

### 3. **User Features**
- ✅ Browse menu items
- ✅ Filter by category
- ✅ Add items to cart
- ✅ Update cart quantities
- ✅ Checkout process

### 4. **Admin Features**
- ✅ Admin dashboard access
- ✅ Menu management
- ✅ Order management

### 5. **UI/UX**
- ✅ Responsive design (mobile/desktop)
- ✅ Navigation between pages
- ✅ Tailwind CSS styling
- ✅ Loading states

### 6. **Performance**
- ✅ Page load times
- ✅ Error handling
- ✅ 404 pages

## Running Tests

### Option 1: Using TestSprite CLI

```bash
# Install TestSprite (if not already installed)
npm install -g testsprite

# Run all tests
testsprite run tests/restaurant-app.test.js

# Run with specific browser
testsprite run tests/restaurant-app.test.js --browser chromium

# Run with screenshots
testsprite run tests/restaurant-app.test.js --screenshots
```

### Option 2: Using npx

```bash
npx testsprite run tests/restaurant-app.test.js
```

### Option 3: Manual Browser Testing

If you prefer manual testing, follow this checklist:

#### Home Page
- [ ] Navigate to http://localhost:5173
- [ ] Verify hero section displays
- [ ] Check all navigation links work
- [ ] Verify feature cards are visible

#### Authentication
- [ ] Click "Sign Up" and fill the form
- [ ] Verify validation works
- [ ] Create a new account
- [ ] Login with credentials
- [ ] Verify redirect after login

#### Menu
- [ ] Navigate to /menu
- [ ] Verify menu items load
- [ ] Test category filtering
- [ ] Add item to cart
- [ ] Verify cart count updates

#### Cart
- [ ] Navigate to /cart
- [ ] Verify items display
- [ ] Update quantities
- [ ] Remove items
- [ ] Fill delivery details
- [ ] Proceed to payment

#### Orders
- [ ] Navigate to /orders
- [ ] Verify order history displays
- [ ] Check order details

#### Admin (if admin user)
- [ ] Navigate to /admin
- [ ] Test menu management
- [ ] Test order management
- [ ] Update order status

## Test Results

Test results will be saved in `./test-results/` directory with:
- Screenshots of each test step
- Video recordings of test runs
- Detailed logs

## Troubleshooting

### Backend Not Running
If tests fail with connection errors:
```bash
cd ../backend
mvn spring-boot:run
```

### Frontend Not Running
```bash
npm run dev
```

### Database Issues
Make sure MySQL is running and the database exists:
```sql
CREATE DATABASE restaurant_db;
```

### CORS Errors
Verify backend CORS configuration allows `http://localhost:5173`

## Test Data

For testing, you can use:

**Test User:**
- Username: `testuser`
- Password: `password123`

**Test Admin:**
- Username: `admin`
- Password: `admin123`

## Continuous Testing

To run tests continuously during development:

```bash
# Watch mode (if supported by TestSprite)
testsprite run tests/restaurant-app.test.js --watch
```

## Notes

- Tests are designed to be independent and can run in any order
- Each test cleans up after itself
- Screenshots are captured on failures
- Tests use realistic user interactions
- Mobile responsive tests included

## Adding New Tests

To add new tests, follow this pattern:

```javascript
test('Description of what you're testing', async ({ page }) => {
  // 1. Navigate to page
  await page.goto('http://localhost:5173/your-page');
  
  // 2. Wait for elements
  await page.waitForSelector('your-selector');
  
  // 3. Interact with elements
  await page.click('button');
  await page.fill('input', 'value');
  
  // 4. Verify results
  await page.waitForSelector('expected-result');
  
  console.log('✓ Test passed');
});
```

## Support

For issues or questions about testing:
1. Check TestSprite documentation
2. Verify all services are running
3. Check browser console for errors
4. Review test-results for screenshots
