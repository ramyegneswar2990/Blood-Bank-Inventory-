# System Design & Architecture

This document outlines the architectural decisions and data models used in the Blood Bank Matching System.

## Architecture Diagram

The system follows a classic **Layered Architecture**:

```mermaid
graph TD
    Client[Web/Mobile Client] --> Controller[Controller Layer]
    Controller --> Service[Service Layer]
    Service --> Matching[Matching Engine]
    Service --> Repo[Repository Layer]
    Repo --> DB[(MySQL Database)]
    Service --> Security[Spring Security/JWT]
```

## Data Model (ER Diagram)

The relationships between core entities are defined below:

```mermaid
erDiagram
    USER ||--o| DONOR : "is a"
    USER {
        Long id
        String email
        String password
        String name
        Role role
        String location
    }
    DONOR {
        Long id
        String bloodGroup
        Boolean availabilityStatus
        LocalDate lastDonationDate
        Double latitude
        Double longitude
    }
    BLOOD_INVENTORY {
        Long id
        String bloodGroup
        Integer units
        String hospitalName
    }
    BLOOD_REQUEST ||--o| DONATION_MATCH : "generates"
    BLOOD_REQUEST {
        Long id
        String bloodGroup
        String urgencyLevel
        Enum status
    }
```

## Core Logic: Donor Matching Engine

The matching engine specifically follows these steps to ensure safety and efficiency:

1. **Blood Group Matching**: Filters the `Donor` table for exact matches to the requested blood group.
2. **Availability Check**: Only selects donors where `availabilityStatus = true`.
3. **Safety Window**: Calculates `LocalDate.now().minusMonths(3)`. Only donors who haven't donated within this window are considered.
4. **Proximity Search**: 
   - Uses a simulated distance formula (Euclidean or Haversine) based on `latitude` and `longitude`.
   - Sorts donors from nearest to farthest.
5. **Selection**: Picks the top $N$ (default 5) donors and creates a `DonationMatch` entry for each, triggering a mock notification.

## Security Flow

1. **User Signup**: Password is encrypted using `BCryptPasswordEncoder`.
2. **Login**: User provides credentials -> `AuthenticationManager` verifies.
3. **Token Issuance**: A JWT signed with a secret key is returned to the client.
4. **Interception**: `JwtAuthenticationFilter` intercepts every request, extracts the token, and sets the `SecurityContext`.
5. **Access Control**: Methods are protected using `@PreAuthorize` or standard `HttpSecurity` rules based on roles (ADMIN, DONOR, RECEIVER).
