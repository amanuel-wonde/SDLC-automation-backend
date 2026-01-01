# NestJS Microservice Application with Centralized Gateway Authentication

This repository contains a microservice-based application built with **NestJS**, using **Redis** as the transport layer. The architecture follows a **Centralized Gateway Authentication** model, maximizing performance and simplifying internal service logic.

## 🏗 System Architecture

The system consists of the following components:

### 1. API Gateway (`apps/api-gateway`)

- **Role:** The single entry point for all external client requests.
- **Responsibilities:**
  - Handles all incoming HTTP traffic.
  - **Enforces Authentication:** Verifies JWTs locally using the Auth Service's public key.
  - **Forwards Requests:** Sanitizes and relays valid requests to internal microservices via Redis.
  - **User Context:** Injects validated user data (e.g., `userId`, `role`) into the request payload for downstream services.
  - **Communication:** Communicates with the Auth Service for complex identity operations (login, refresh, revoke).

### 2. Auth Service (`apps/auth-service`)

- **Role:** The **Source of Truth** for identity and access management.
- **Responsibilities:**
  - **User Management:** Handles registration and user data.
  - **Token Management:** Issues (signs), refreshes, and revokes JWTs.
  - **Key Management:** Generates and rotates cryptographic keys (RS256); provides the public key to the Gateway.
  - **Internal Isolation:** Not exposed directly to the public internet; reachable only by the Gateway.

### 3. AI Service (`apps/ai-service`)

- **Role:** Handles AI-related business logic.
- **Responsibilities:**
  - Managing chat sessions.
  - Maintaining a knowledge base.
  - Formatting AI responses.
- **Auth Status:** **Unaware of Authentication.** Trusts the user context provided by the Gateway.

### 4. Project Service (`apps/project-service`)

- **Role:** Manages core project data.
- **Responsibilities:**
  - Creating and updating projects.
  - Managing tasks and workflows.
- **Auth Status:** **Unaware of Authentication.** Trusts the user context provided by the Gateway.

---

## 🔐 Authentication Strategy: Centralized Gateway Pattern

We use a **Gateway-Only Authentication** model. This differs from traditional distributed auth (where every service verifies tokens) or hybrid models.

### Key Concepts

1.  **Trust Boundary:** The API Gateway is the trusted perimeter. Once a request passes the Gateway, it is considered authenticated.
2.  **Responsibility Shift:**
    - **Gateway:** Handles `JwtAuthGuard`, token parsing, and validation.
    - **Internal Services:** Do NOT import `@nestjs/jwt` or passport. They receive a clean `user` object in the payload.
3.  **Performance:** Internal communication is token-free (or carries only metadata), reducing overhead.

### Authentication Flows

#### 1. Login / Signup

- Client sends credentials to Gateway.
- Gateway forwards request to Auth Service (via Redis RPC).
- Auth Service validates credentials, generates Access/Refresh tokens.
- Gateway returns tokens to Client.

#### 2. Protected Requests (Token Verification)

- Client sends request with `Authorization: Bearer <token>`.
- Gateway verifies JWT signature **locally** using the cached Public Key (fast, no RPC).
- **If Valid:** Gateway attaches user info (`{ id: '...', role: '...' }`) to the internal message and forwards it to AI/Project Service.
- **If Invalid:** Gateway blocks the request immediately (401 Unauthorized).

#### 3. Token Refresh

- Client sends refresh token to Gateway.
- Gateway invokes `refresh_token` command on Auth Service.
- Auth Service validates and issues new tokens.

#### 4. Token Revocation (Logout)

- Gateway sends `revoke_token` command to Auth Service.
- Auth Service adds the token ID (`jti`) to a Redis blacklist.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS)
- Redis Server (Running locally or via Docker)
- pnpm

### Installation

```bash
pnpm install
```

### Running the Ecosystem

1.  **Start Redis:** Ensure your Redis instance is running.
2.  **Start Services:**

```bash
# Start Auth Service
pnpm run start:dev auth

# Start AI Service (future)
# pnpm run start:dev ai-service

# Start Project Service (future)
# pnpm run start:dev project-service

# Start API Gateway (Main entry point)
pnpm run start:dev api-gateway
```

## 📡 Communication Protocol

- **Transport:** Redis (`@nestjs/microservices`)
- **Pattern:** Request-Response (RPC) for most operations; Event-based for async tasks.

## 📂 Project Structure

```
.
├── apps/
│   ├── api-gateway/       # Public-facing HTTP Gateway
│   ├── auth/              # Identity Service
│   ├── ai-service/        # (Planned) AI Logic
│   └── project-service/   # (Planned) Project Logic
├── libs/                  # Shared libraries (DTOs, Interfaces)
├── package.json
└── README.md
```
