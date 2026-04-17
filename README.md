<h1 align="center">
  🚀 NestJS Enterprise Starter
</h1>

<p align="center">
  A production-ready, opinionated NestJS boilerplate with batteries included — authentication, file handling, pagination, role-based access, Swagger docs, and more.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-v11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-TypeORM-336791?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Swagger-OpenAPI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" />
  <img src="https://img.shields.io/badge/License-UNLICENSED-lightgrey?style=for-the-badge" />
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Architecture Decisions](#-architecture-decisions)
- [Database Migrations](#-database-migrations)
- [Available Scripts](#-available-scripts)

---

## 🧭 Overview

**NestJS Enterprise Starter** is a scalable, modular API boilerplate designed to jump-start production-grade backend projects. It eliminates the repetitive setup phase by providing a clean, pre-configured foundation with industry best practices already in place.

Clone it, configure your `.env`, and start building your domain logic immediately.

---

## ✨ Features

### 🔐 Authentication & Security

- **Cookie-based JWT Authentication** — Secure `HttpOnly` cookies with 7-day expiry
- **Auth Middleware** — Centrally protects all routes; public routes are explicitly excluded via `exclude()` in `AppModule`
- **Password Hashing** — `bcryptjs` with salt rounds of 10
- **Role-Based Access Control (RBAC)** — `USER`, `ADMIN`, `SUPER_ADMIN` roles enforced at the controller level
- **Admin Protection** — Admin/Super-Admin accounts cannot be created via the public register endpoint; existing admin accounts cannot be modified by regular users

### 🗄️ Database

- **PostgreSQL** with **TypeORM v0.3** — Full ORM support with entity-based schema management
- **Auto-entity Discovery** — Glob-pattern entity loading (`**/*.entity{.ts,.js}`)
- **Migration Support** — Pre-configured migration path (`src/database/migrations/`)
- **Subscriber Support** — Pre-configured subscriber path (`src/database/subscribers/`)
- **UUID Extension** — `uuid-ossp` configured for PostgreSQL
- **Sync Control** — `DB_SYNCHRONIZE` is an env-controlled toggle (disabled by default for safety)

### 🧱 Base Entity (`CommonFields`)

Every entity that extends `CommonFields` automatically gets:

| Field       | Type        | Description                          |
| ----------- | ----------- | ------------------------------------ |
| `id`        | `bigint`    | Auto-incremented primary key         |
| `createdAt` | `timestamp` | Set automatically on creation        |
| `updatedAt` | `timestamp` | Updated automatically on every save  |
| `deletedAt` | `timestamp` | Soft-delete support (nullable)       |
| `status`    | `boolean`   | Active/inactive flag (default: true) |

### 📁 File & Media Handling

- **Multer Integration** — Single and multiple file upload endpoints
- **Disk Storage** — Files saved to `./uploads/` with timestamp-prefixed filenames to avoid collisions
- **5 MB File Size Limit** — Enforced globally on the media module
- **Media Entity** — Database-tracked media records with full CRUD (create, fetch by ID, delete)
- **Static File Serving** — `ServeStaticModule` configured to serve uploads directly

### 🛡️ Rate Limiting

- **Throttler Guard** — Global rate limiting via `@nestjs/throttler` (500 requests / 6 seconds per IP)
- Applied automatically via `APP_GUARD` — no per-route decoration needed

### 📦 Response Normalization

- **Global Response Interceptor** (`PageTransferResponseInterceptor`) — Wraps all successful responses in a consistent envelope:
  ```json
  {
    "status": 200,
    "message": "success",
    "data": { ... }
  }
  ```
- **Paginated Response Envelope** — When a service returns `[data[], count]` (TypeORM `findAndCount`), the interceptor auto-generates pagination metadata:
  ```json
  {
    "status": 200,
    "message": "success",
    "data": [ ... ],
    "meta": {
      "length": 100,
      "totalPages": 10,
      "prev": 1,
      "next": 3
    }
  }
  ```

### 🚨 Global Exception Filter (`AllExceptionsFilter`)

All uncaught exceptions are intercepted and returned in a consistent error shape:

```json
{
  "status": 500,
  "path": "/api/some-route",
  "message": "Something went wrong"
}
```

### 📄 Pagination & Filtering Utilities

- **`QueryWithPage`** — Reusable DTO with `page` and `take` query params (validated, transformed)
- **`QueryWithpageAndSearch`** — Extends `QueryWithPage` with an optional `searchTerm`
- **`generateTakeSkip()`** — Utility function that computes TypeORM `take`/`skip` from page-based pagination input
- **`getPaginationQuery()`** — Alternative pagination utility
- **`ILike` search pattern** — Ready-to-use pattern for case-insensitive full-text search

### 🏷️ Reusable Common DTOs

Pre-built, Swagger-annotated DTOs ready to use across any module:

| DTO                   | Purpose                                    |
| --------------------- | ------------------------------------------ |
| `EmailDTO`            | Validated email field                      |
| `TitleDTO`            | Title with length validation (2–255 chars) |
| `ShortTitleDTO`       | Short title (2–50 chars)                   |
| `DescriptionDTO`      | Optional description field                 |
| `TitleDescriptionDTO` | Combined title + description               |
| `IdDTO`               | Numeric string ID                          |
| `StatusDTO`           | Boolean status toggle                      |
| `SlugDTO`             | URL-safe slug (max 520 chars)              |
| `SlugSEODTO`          | Slug + SEO meta (title, keywords, desc)    |
| `CategoryIdDTO`       | Numeric category ID with auto-transform    |
| `ParentIdDTO`         | Optional parent ID for hierarchical data   |

### 🎨 Custom Decorators

- **`@GetUser()`** — Parameter decorator that extracts the authenticated user from the request object directly in controller methods, eliminating boilerplate

### 📖 Swagger / OpenAPI Documentation

- Auto-generated interactive API docs at `/docs`
- Postman collection export available at `/docs-json`
- Cookie authentication configured (`_rt_` cookie)
- `persistAuthorization` enabled — auth state persists across page reloads
- All DTOs annotated with `@ApiProperty` / `@ApiPropertyOptional`

### ✅ Validation Pipeline

- **`ValidationPipe`** — Global, with:
  - `transform: true` — Auto-transforms `@Query`, `@Param`, `@Body` to typed DTOs
  - `whitelist: true` — Strips unknown properties
  - `forbidNonWhitelisted: true` — Throws `400` if unknown properties are sent

### 📧 Mail Configuration

- `MAIL_USERNAME` and `MAIL_PASSWORD` env vars pre-wired for Nodemailer integration

---

## 📁 Project Structure

```
src/
├── app/
│   ├── auth/                   # Authentication module
│   │   ├── auth.controller.ts  # Register, Login, Logout endpoints
│   │   ├── auth.middleware.ts  # JWT cookie validation middleware
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   └── dto/
│   ├── media/                  # File upload module
│   │   ├── media.controller.ts # Single/Multi upload, get, delete
│   │   ├── media.entity.ts
│   │   ├── media.module.ts     # Multer + Throttler config
│   │   └── media.service.ts
│   └── user/                   # User management module
│       ├── user.controller.ts  # CRUD + role-gated routes
│       ├── user.service.ts
│       ├── user.module.ts
│       ├── user.type.ts        # Role enum, LoggedInUser type
│       ├── dto/
│       └── entities/
│           └── user.entity.ts
├── common/
│   ├── base.entity.ts          # CommonFields abstract base entity
│   ├── common.dto.ts           # Shared reusable DTOs
│   ├── common.enum.ts          # Shared enums
│   ├── common.interface.ts     # Shared interfaces
│   ├── common.type.ts          # Shared types
│   ├── dto.ts                  # Pagination DTOs
│   └── http-error.filter.ts    # HTTP exception filter (alternate)
├── config/
│   ├── customRequest.ts        # Extended Express Request type
│   ├── db-config.ts            # TypeORM PostgreSQL config factory
│   ├── env.ts                  # Centralized env variable access
│   └── typeorm.config.ts       # TypeORM CLI config
├── database/
│   ├── migrations/             # TypeORM migration files
│   └── subscribers/            # TypeORM subscriber files
├── decorators/
│   └── get-user.decorator.ts   # @GetUser() param decorator
├── helpers/
│   └── utils.ts                # Pagination helpers, transformers
├── interceptors/
│   ├── exceptionFilter.ts      # Global AllExceptionsFilter
│   └── response.interceptor.ts # Global response normalizer
├── interface/
│   ├── jwt.interface.ts        # JWT payload interface
│   └── response.interface.ts   # SuccessResponse / SuccessResponseMultiple
├── app.module.ts               # Root module — middleware config
└── main.ts                     # Bootstrap — global prefix, CORS, Swagger
```

---

## 🛠️ Tech Stack

| Category       | Technology                              | Version |
| -------------- | --------------------------------------- | ------- |
| Framework      | NestJS                                  | ^11.0   |
| Language       | TypeScript                              | ^5.7    |
| Database       | PostgreSQL                              | —       |
| ORM            | TypeORM                                 | ^0.3.28 |
| Auth           | JWT (`jsonwebtoken`) + bcryptjs         | —       |
| File Uploads   | Multer (`@nestjs/platform-express`)     | —       |
| Rate Limiting  | `@nestjs/throttler`                     | ^6.5    |
| API Docs       | Swagger (`@nestjs/swagger`)             | ^11.2   |
| Validation     | `class-validator` + `class-transformer` | —       |
| Config         | `dotenv` + `@nestjs/config`             | —       |
| Static Serving | `@nestjs/serve-static`                  | ^5.0    |
| Testing        | Jest + Supertest                        | ^30.0   |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 20`
- PostgreSQL `>= 14`
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/nestjs-enterprise-starter.git
cd nestjs-enterprise-starter

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.sample .env
# Edit .env with your database credentials and JWT secret

# 4. Start the development server
npm run start:dev
```

The server starts on `http://localhost:3000` (or the port defined in `.env`).

Swagger docs are available at: **`http://localhost:3000/docs`**

---

## 🔑 Environment Variables

Copy `.env.sample` to `.env` and fill in the values:

```env
# Application
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_database_password
DB_DATABASE=your_database_name
DB_SYNCHRONIZE=false        # Set to true ONLY in development

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# Nodemailer (for email features)
MAIL_USERNAME=youremail@gmail.com
MAIL_PASSWORD=your_app_password
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

> ⚠️ Keep `DB_SYNCHRONIZE=false` in production. Use TypeORM migrations instead.

---

## 📡 API Endpoints

All routes are prefixed with `/api`.

### Auth — `/api/auth`

> Public routes — no authentication required

| Method | Endpoint             | Description          |
| ------ | -------------------- | -------------------- |
| `POST` | `/api/auth/register` | Create a new user    |
| `POST` | `/api/auth/login`    | Login and set cookie |
| `POST` | `/api/auth/logout`   | Clear auth cookie    |

### Users — `/api/user`

> Protected routes — requires valid `_rt_` cookie

| Method   | Endpoint            | Role Required       | Description                         |
| -------- | ------------------- | ------------------- | ----------------------------------- |
| `GET`    | `/api/user/all`     | Admin / Super Admin | List all users (filterable by role) |
| `GET`    | `/api/user/profile` | Any                 | Get the logged-in user's profile    |
| `GET`    | `/api/user/:id`     | Any (own) / Admin   | Get user by ID                      |
| `PATCH`  | `/api/user/:id`     | Any (own) / Admin   | Update user details                 |
| `DELETE` | `/api/user/:id`     | Admin / Super Admin | Soft-delete a user                  |

### Media — `/api/media`

> Protected routes — requires valid `_rt_` cookie

| Method   | Endpoint             | Description                     |
| -------- | -------------------- | ------------------------------- |
| `POST`   | `/api/media`         | Upload a single file (max 5 MB) |
| `POST`   | `/api/media/uploads` | Upload multiple files           |
| `GET`    | `/api/media/:id`     | Retrieve media record by ID     |
| `DELETE` | `/api/media/:id`     | Delete media record             |

---

## 🏗️ Architecture Decisions

### Middleware vs Guards

This template uses **NestJS Middleware** for authentication rather than Guards. This is an intentional choice:

- Middleware runs early in the lifecycle before guards, allowing global auth enforcement with clean `exclude()` for public routes
- Public routes (`register`, `login`, `logout`) are excluded in `AppModule.configure()`

> **Important:** When using `app.setGlobalPrefix('api')`, the paths in `.exclude()` must be written **without** the prefix (e.g., `auth/register`, not `api/auth/register`).

### Response Shape

All responses go through `PageTransferResponseInterceptor`. To enable auto-pagination in any service, simply return `findAndCount()` result — the interceptor detects the `[data[], number]` tuple and wraps it automatically.

### Soft Deletes

All entities extending `CommonFields` have soft-delete support via TypeORM's `@DeleteDateColumn`. Records are never truly removed from the database, preserving data integrity and enabling recovery.

### Role-Based Access

Roles are enforced at the **controller level** using the `@GetUser()` decorator. This keeps the service layer free of auth concerns and fully testable in isolation.

---

## 🗃️ Database Migrations

This project uses **TypeORM migrations** for safe, version-controlled schema changes. Migration scripts are wired to `src/config/typeorm.config.ts` which exports a `DataSource` instance.

> ⚠️ Keep `DB_SYNCHRONIZE=false` in all non-development environments and rely on migrations instead.

### Migration Commands

```bash
# Generate a new migration by diffing entities vs the current DB schema
npm run typeorm:generate --name=MigrationName
# Output: src/database/migrations/<timestamp>-MigrationName.ts

# Run all pending migrations
npm run typeorm:run

# Revert the last applied migration
npm run typeorm:revert
```

### How It Works

| Script              | Command                                            | Purpose                                      |
| ------------------- | -------------------------------------------------- | -------------------------------------------- |
| `typeorm`           | `ts-node` + TypeORM CLI via `typeorm.config.ts`    | Base alias used by other typeorm scripts     |
| `typeorm:generate`  | `migration:generate ./src/database/migrations/%name%` | Auto-generates migration from entity diff |
| `typeorm:run`       | `migration:run`                                    | Applies all pending migrations               |
| `typeorm:revert`    | `migration:revert`                                 | Rolls back the last migration                |

### Workflow Example

```bash
# 1. Make changes to an entity file
# 2. Generate the migration
npm run typeorm:generate --name=AddPhoneToUser

# 3. Review the generated file in src/database/migrations/
# 4. Apply it
npm run typeorm:run
```

> Migration files are saved to `src/database/migrations/` and picked up automatically by the TypeORM config glob pattern.

---

## 📜 Available Scripts

```bash
# Development
npm run start:dev     # Start with hot-reload
npm run start:debug   # Start in debug mode with hot-reload
npm run start:prod    # Run compiled production build

# Build
npm run build         # Compile TypeScript → dist/

# Code Quality
npm run lint          # Run ESLint with auto-fix
npm run format        # Run Prettier on src/ and test/

# Testing
npm run test          # Run unit tests
npm run test:watch    # Watch mode
npm run test:cov      # With coverage report
npm run test:e2e      # End-to-end tests

# Database Migrations
npm run typeorm:generate --name=MigrationName   # Generate from entity diff
npm run typeorm:run                              # Apply pending migrations
npm run typeorm:revert                           # Roll back last migration
```

---

## 📄 License

This project is **UNLICENSED** — intended as a private starter template.

---

<p align="center">
  Built with ❤️ using <a href="https://nestjs.com">NestJS</a>
</p>
