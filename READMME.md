# MerchStand API Documentation

MerchStand is a full-stack web application that enables independent bands to create custom merchandise (t-shirts). The back-end API is built using Node.js, Express, and MongoDB, and supports robust CRUD operations, advanced filtering/sorting, pagination, JWT authentication, role-based access control (RBAC), and aggregation endpoints.

---

## Technologies Used

### Server & Framework
- **Node.js & Express:**  
  Provides a fast, scalable, and lightweight server environment along with a minimalistic routing framework.

### Database & ODM
- **MongoDB & Mongoose:**  
  A NoSQL document-oriented database that offers flexible data schemas. Mongoose is used for schema definitions and database interactions.

### Authentication & Security
- **JWT (JSON Web Tokens):**  
  Enables stateless, scalable authentication.
- **bcrypt:**  
  Used to securely hash and compare user passwords.
- **Helmet & CORS:**  
  Helmet sets various HTTP headers for enhanced security, while CORS allows controlled cross-origin resource sharing.

### Testing & Linting
- **Jest & Supertest:**  
  Provides a comprehensive testing framework for unit and integration tests.
- **ESLint (Airbnb Style Guide):**  
  Enforces consistent coding standards and best practices.

---

## Dependent Software and Packages

- **Node.js (v16+ recommended)**
- **MongoDB:**  
  Can be run locally (Community Edition) or through managed services like MongoDB Atlas.
- **NPM/Yarn:**  
  For package management.
- **Packages:**  
  Express, Mongoose, bcrypt, jsonwebtoken, helmet, cors, dotenv, jest, supertest, eslint, etc.

---

## Hardware Requirements

- **Processor:**  
  Modern multi-core CPU (minimum 2 cores recommended).
- **Memory:**  
  At least 4GB of RAM.
- **Storage:**  
  Approximately 500MB or more free space (depending on data volume).

---

## Comparisons to Alternative Technology Choices

- **Express vs. Other Frameworks:**  
  Express is chosen for its simplicity and extensive community support, compared to alternatives like Koa, Hapi, or NestJS.
- **MongoDB vs. Relational Databases:**  
  MongoDB offers schema flexibility and scalability for document-oriented data, whereas relational databases (e.g., PostgreSQL, MySQL) require fixed schemas.
- **JWT vs. Session-based Authentication:**  
  JWT supports stateless authentication, improving scalability compared to server-side session storage.
- **ESLint (Airbnb Style Guide) vs. Other Style Guides:**  
  The Airbnb style guide is widely recognized for enforcing clean, maintainable code.

---

## Purpose of Chosen Technologies

- **Node.js & Express:**  
  Provide a high-performance, scalable server environment.
- **MongoDB & Mongoose:**  
  Allow flexible, schema-less data storage with robust query capabilities.
- **JWT & bcrypt:**  
  Ensure secure, stateless authentication and proper password management.
- **Helmet & CORS:**  
  Enhance security by protecting against common vulnerabilities and controlling resource sharing.
- **Jest & Supertest:**  
  Ensure application reliability through comprehensive testing.
- **ESLint with Airbnb:**  
  Maintains a consistent code style and enforces best practices.

---

## Licensing

- **Project License:**  
  This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
- **Dependencies:**  
  Individual packages (e.g., Express, Mongoose, bcrypt) are subject to their own licenses (mostly MIT or Apache 2.0), which are compatible with the overall MIT license for the project.

---

## Style Guide

- **Coding Standards:**  
  The project follows the Airbnb JavaScript Style Guide.
- **Linting:**  
  ESLint is configured to enforce the Airbnb ruleset, ensuring consistency, readability, and maintainability.
- **Best Practices:**  
  Utilizes modern JavaScript (ES6+) with a focus on modularity, DRY principles, and robust error handling.

---

## API Documentation by Controller

### User Controller
- **POST /user**  
  Create a new user (registration).  
  *Notes:* Open endpoint; no authentication required.

- **GET /user**  
  Retrieve all users.  
  *Query Parameters (optional):*  
  - `genre`: Filter users by genre.  
  - `sort`: Sort by creation date (`asc` or `desc`).

- **GET /user/id=<userId>**  
  Retrieve a specific user by their ID.

- **PUT /user/id=<userId>**  
  Update an existing user.  
  *Notes:* Protected endpoint; requires a valid token and (for example) admin role.

- **DELETE /user/id=<userId>**  
  Delete a user.  
  *Notes:* Protected endpoint; requires a valid token and admin role.

### Auth Controller
- **POST /auth/login**  
  Authenticate a user and return a JWT token containing the user's id, contactEmail, and role.

### Design Controller
- **GET /designs**  
  Retrieve all designs.  
  *Query Parameters (optional):*  
  - `fontId`: Filter designs by fontId.  
  - `sort`: Sort by creation date (`asc` or `desc`).

- **GET /designs/id=<designId>**  
  Retrieve a specific design by its ID.

- **POST /designs**  
  Create a new design.

- **PUT /designs/id=<designId>**  
  Update an existing design.

- **DELETE /designs/id=<designId>**  
  Delete a design.

### Order Controller
- **GET /orders**  
  Retrieve all orders with filtering, sorting, and pagination.  
  *Query Parameters (optional):*  
  - `orderStatus`: Filter by order status.  
  - `userId`: Filter by user ID.  
  - `sort`: Sort by orderDate (`asc` or `desc`).  
  - `page`: Page number (default: 1).  
  - `limit`: Records per page (default: 10).

- **GET /orders/id=<orderId>**  
  Retrieve a specific order by its ID.

- **POST /orders**  
  Create a new order.

- **PUT /orders/id=<orderId>**  
  Update an order.  
  *Notes:* Validates that `orderStatus` is one of: `Pending`, `Paid`, `Shipped`, `Cancelled`.

- **DELETE /orders/id=<orderId>**  
  Soft delete an order (requires a deletion reason in the payload).

- **GET /orders/deleted**  
  Retrieve all soft-deleted orders.

- **GET /orders/groupedByUser**  
  Group orders by user, returning total orders and revenue per user.

- **GET /orders/byDateRange?startDate=<startDate>&endDate=<endDate>**  
  Retrieve orders within a specified date range.  
  *Query Parameters:*  
  - `startDate`: ISO date string marking the start of the range.  
  - `endDate`: ISO date string marking the end of the range.

### Payment Controller
- **GET /payments**  
  Retrieve all payments with filtering, sorting, and pagination.  
  *Query Parameters (optional):*  
  - `paymentMethod`: Filter payments by payment method.  
  - `userId`: Filter payments by user ID.  
  - `sort`: Sort by creation date (`asc` or `desc`).  
  - `page`: Page number (default: 1).  
  - `limit`: Records per page (default: 10).

- **GET /payments/id=<paymentId>**  
  Retrieve a specific payment by its ID.

- **POST /payments**  
  Create a new payment.  
  *Notes:* Validates that `paymentMethod` is one of: `Credit Card`, `Debit Card`, or `Invoice`.

- **PUT /payments/id=<paymentId>**  
  Update an existing payment.  
  *Notes:* Validates `paymentMethod` if provided.

- **DELETE /payments/id=<paymentId>**  
  Soft delete a payment (requires a deletion reason in the payload).

- **GET /payments/deleted**  
  Retrieve all soft-deleted payments.

- **GET /payments/paymentType/<paymentType>**  
  Retrieve payments filtered by payment type.  
  *Notes:* Validates that `<paymentType>` is one of the allowed values.

- **GET /payments/summary**  
  Get an aggregated summary of payments grouped by payment method.

- **GET /payments/groupedByUser**  
  Group payments by user, returning the total number of payments per user.

### Stock Controller
- **GET /stocks**  
  Retrieve all stock items with filtering, sorting, and pagination.  
  *Query Parameters (optional):*  
  - `color`: Filter by color.  
  - `size`: Filter by size.  
  - `sort`: Sort by price (`asc` or `desc`).

- **GET /stocks/id=<stockId>**  
  Retrieve a specific stock item by its ID.

- **POST /stocks**  
  Create a new stock item.

- **PUT /stocks/id=<stockId>**  
  Update a stock item.

- **DELETE /stocks/id=<stockId>**  
  Delete a stock item.

- **GET /stocks/summaryByColor**  
  Retrieve a summary of stocks grouped by color (includes total quantity and average price).

### Clipart Controller
- **GET /cliparts**  
  Retrieve all cliparts.

- **GET /cliparts/id=<clipartId>**  
  Retrieve a specific clipart by its ID.

- **POST /cliparts**  
  Create a new clipart.

- **PUT /cliparts/id=<clipartId>**  
  Update an existing clipart.

- **DELETE /cliparts/id=<clipartId>**  
  Delete a clipart.

- **GET /cliparts/category/<category>**  
  Retrieve cliparts filtered by category.

---

## Getting Started

1. **Installation:**
   - Clone the repository.
   - Run `npm install` to install all dependencies.
   - Create a `.env` file in the project root and configure the following variables:
     ```dotenv
     PORT=5000
     DATABASE_URL=your_database_connection_string
     NODE_ENV=development
     WIPE=true
     JWT_SECRET=your_jwt_secret_key
     ```
2. **Running the Server:**
   - Use `npm run dev` to start the server in watch mode.
3. **Running Tests:**
   - Execute `npm test` to run the test suite.

---

## Continuous Integration/Deployment

The project is configured with Jest and Supertest for automated testing. You can integrate these tests with a CI/CD pipeline (e.g., using GitHub Actions) to run tests automatically on every commit and deploy changes.

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).  
Each dependent package is subject to its own license.

---

## Style Guide

- **Coding Standards:**  
  The project follows the Airbnb JavaScript Style Guide.
- **Linting:**  
  ESLint is configured to enforce the Airbnb ruleset, ensuring consistency and maintainability.
- **Best Practices:**  
  Modern JavaScript (ES6+) is used, emphasizing modularity, DRY principles, and robust error handling.

---
