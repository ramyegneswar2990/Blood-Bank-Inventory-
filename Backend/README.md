# Blood Bank Inventory & Emergency Donor Matching System

A complete backend solution for managing blood bank inventories, user roles (Admin, Donor, Receiver), and an automated matching engine for emergency blood requests.

## 🚀 Tech Stack

- **Framework**: Spring Boot 3.4.1
- **Security**: Spring Security with JWT
- **Database**: MySQL / PostgreSQL
- **Persistence**: Spring Data JPA (Hibernate)
- **Utilities**: Lombok, JJWT, Maven

## 🛠️ Features

### 1. Authentication & Authorization
- Secure JWT-based login and signup.
- Role-based access control:
  - **ADMIN**: Manage blood inventory and view all requests.
  - **DONOR**: Maintain availability and donor profile.
  - **RECEIVER**: Create emergency blood requests.

### 2. Blood Inventory Management
- Real-time tracking of blood units (O+, O-, A+, etc.) per hospital/location.
- Public API to check availability without logging in.

### 3. Emergency Matching Engine
- **Compatibility**: Matches donors by blood group.
- **Safety**: Enforces a strict 3-month gap between donations.
- **Proximity**: Sorts matches by distance (latitude/longitude comparison).
- **Automation**: Automatically notifies the top 5 nearest matched donors upon request creation.

## 📋 API Documentation

### Public / Auth
- `POST /api/auth/signup` - Register a new user (include Donor details if role is DONOR).
- `POST /api/auth/login` - Authenticate and get JWT token.
- `GET /api/blood/check?group=B+` - Check available units.

### Emergency Requests
- `POST /api/request/create` - Create an emergency request (requires RECEIVER role).
- `GET /api/request/status/{id}` - Track request status.

### Admin
- `GET /api/blood/admin/all` - View all inventory.
- `POST /api/blood/admin/add` - Add/Update blood units.

## ⚙️ Setup Instructions

1. **Clone the repository**.
2. **Database Setup**: 
   - Ensure MySQL is running.
   - Create a database: `CREATE DATABASE blood_bank_db;`.
3. **Configure Properties**: 
   - Update `src/main/resources/application.properties` with your MySQL credentials.
4. **Build & Run**:
   ```bash
   ./mvnw clean compile
   ./mvnw spring-boot:run
   ```

## 📂 Project Structure

- `enums/`: Centralized enums for Roles and Statuses.
- `dto/`: Structured Request and Response objects.
- `entity/`: Database models.
- `service/`: Matching logic and business services.
- `config/`: Security and JWT configuration.
