# Restaurant Management System

A full-stack restaurant website with React, Tailwind CSS, Spring Boot, MySQL, payment integration, and role-based authentication.

## Features

### Customer Features
- User registration and login with JWT authentication
- Browse restaurant menu with category filtering
- Add items to cart and manage quantities
- Place orders with delivery details
- Secure payment processing with Stripe
- View order history and tracking
- Responsive design with Tailwind CSS

### Admin Features
- Admin dashboard with role-based access
- Menu management (add, edit, delete menu items)
- Order management and status updates
- View all customer orders
- Real-time order tracking

### Technical Features
- Spring Boot backend with REST APIs
- MySQL database with JPA/Hibernate
- JWT-based authentication with role management
- React frontend with JSX
- Tailwind CSS for styling
- Stripe payment integration
- CORS configuration for frontend-backend communication

## Project Structure

```
restaurant-app/
├── backend/                 # Spring Boot backend
│   ├── src/main/java/com/restaurant/
│   │   ├── controller/      # REST API controllers
│   │   ├── model/          # JPA entities
│   │   ├── repository/     # JPA repositories
│   │   ├── service/        # Business logic
│   │   ├── security/       # JWT authentication
│   │   ├── config/         # Configuration classes
│   │   └── dto/           # Data transfer objects
│   └── pom.xml
└── frontend/               # React frontend
    ├── src/
    │   ├── components/     # React components
    │   ├── contexts/       # React contexts
    │   ├── services/       # API services
    │   └── App.jsx
    └── package.json
```

## Setup Instructions

### Prerequisites
- Java 17+
- Node.js 16+
- MySQL 8.0+
- Maven

### Backend Setup

1. **Create MySQL Database:**
   ```sql
   CREATE DATABASE restaurant_db;
   ```

2. **Configure Database:**
   Update `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/restaurant_db
   spring.datasource.username=your_mysql_username
   spring.datasource.password=your_mysql_password
   ```

3. **Configure Stripe:**
   Add your Stripe keys to `application.properties`:
   ```properties
   stripe.secret.key=sk_test_your_stripe_secret_key
   ```

4. **Run Backend:**
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

   The backend will run on `http://localhost:8080`

### Frontend Setup

1. **Install Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Stripe:**
   Update `frontend/src/components/PaymentForm.jsx`:
   ```javascript
   const stripePromise = loadStripe('pk_test_your_stripe_publishable_key');
   ```

3. **Run Frontend:**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173` (Vite dev server)

## Database Schema

### Users Table
- id, username, email, password, full_name, phone_number, role

### Menu Items Table
- id, name, description, price, category, image_url, available

### Orders Table
- id, user_id, order_date, status, total_amount, delivery_address, phone_number

### Order Items Table
- id, order_id, menu_item_id, quantity, price

### Payments Table
- id, order_id, amount, status, payment_method, transaction_id, stripe_payment_intent_id

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration

### Menu
- `GET /api/menu` - Get all available menu items
- `GET /api/menu/{id}` - Get menu item by ID
- `GET /api/menu/category/{category}` - Get items by category
- `POST /api/menu` - Add menu item (Admin only)
- `PUT /api/menu/{id}` - Update menu item (Admin only)
- `DELETE /api/menu/{id}` - Delete menu item (Admin only)

### Orders
- `GET /api/orders/my` - Get current user's orders
- `GET /api/orders/{id}` - Get order by ID
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders (Admin only)
- `PUT /api/orders/{id}/status` - Update order status (Admin only)

### Payment
- `POST /api/payment/create-payment-intent` - Create Stripe payment intent
- `POST /api/payment/confirm` - Confirm payment and create order

## Usage

### For Customers
1. Register a new account or login
2. Browse the menu and add items to cart
3. Proceed to checkout and enter delivery details
4. Complete payment using Stripe
5. Track order status in "My Orders"

### For Admins
1. Login with admin credentials
2. Access admin dashboard
3. Manage menu items (add/edit/delete)
4. View and manage customer orders
5. Update order statuses

## Default Admin User

To create an admin user, you can manually insert into the database:
```sql
INSERT INTO users (username, email, password, full_name, role) 
VALUES ('admin', 'admin@restaurant.com', '$2a$10$encrypted_password', 'Admin User', 'ADMIN');
```

## Security Features

- JWT-based authentication
- Role-based authorization (USER/ADMIN)
- Password encryption with BCrypt
- CORS configuration
- Input validation
- SQL injection prevention with JPA

## Payment Integration

The application uses Stripe for payment processing:
- Secure payment intent creation
- Card element integration
- Payment confirmation
- Transaction tracking

## Development

### Running Tests
```bash
# Backend
cd backend
mvn test

# Frontend
cd frontend
npm test
```

### Building for Production
```bash
# Backend
cd backend
mvn clean package

# Frontend
cd frontend
npm run build
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check MySQL service is running
   - Verify database credentials in application.properties
   - Ensure database exists

2. **CORS Issues**
   - Check CORS configuration in SecurityConfig
   - Verify frontend URL in allowed origins

3. **Payment Issues**
   - Verify Stripe API keys are correct
   - Check Stripe account is in test mode
   - Ensure payment intent creation is working

4. **Authentication Issues**
   - Check JWT secret key configuration
   - Verify token expiration settings
   - Check role-based access permissions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for educational purposes. Please ensure you have proper licenses for any production use.# aura-de-flora
