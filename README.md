# Paystack Store

A simple e-commerce application with integrated Paystack payment processing.

## Features

- User authentication and management
- Product catalog
- Order management
- Paystack payment integration

## Project Structure

```
├── app.js              # Main application entry point
├── package.json        # Project dependencies
├── middleware/
│   └── auth.js         # Authentication middleware
└── models/
    ├── orders.js       # Order model
    ├── products.js     # Product model
    └── user.js         # User model
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your environment variables in `.env`
4. Start the application:
   ```bash
   npm start
   ```

## Requirements

- Node.js
- npm or yarn

## License

MIT
