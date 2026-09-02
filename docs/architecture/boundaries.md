
Architecture Boundaries
1. Repository boundary

The repository is a monorepo.

The monorepo organizes source code and workspace dependencies.

repository/
├── apps/
├── packages/
├── tooling/
└── infrastructure/

A monorepo is not itself a runtime unit.

2. Application boundary

apps/* contains deployable applications.

Each microservice is intended to own its:

source code;
runtime;
configuration;
API;
business rules;
data.

A microservice must be independently runnable, testable, buildable,
containerizable and deployable.

3. Service boundary

A microservice is an explicit runtime and deployment boundary.

Services must not import the source code of other services.

Forbidden:

orders
   X
   ↓
users/src/*

Allowed:

orders
   │
   ├── HTTP
   ├── gRPC
   └── Event / Message
           │
           ▼
         users
4. Internal service boundary

Inside a microservice, responsibilities follow:

app
 ↓
features
 ↓
services
 ↓
shared
app

Runtime and composition layer.

Responsibilities include:

bootstrap;
dependency composition;
runtime adapters;
transport entrypoints;
middleware;
lifecycle;
configuration wiring.

app connects functionality but does not own business implementation.

features

Business capabilities or operations.

A feature should represent a coherent piece of functionality.

services

Reusable mechanisms inside one microservice.

An internal service can be used by multiple features of the same service.

An internal service must not depend on a feature.

shared

Local foundation of one microservice.

shared must not depend on:

features
services
5. Data boundary

Each microservice owns its data.

auth
  ↓
Auth DB

orders
  ↓
Orders DB

A service must not directly read or modify another service's database.

Forbidden:

orders
   X
   ↓
users_db.users

Correct:

orders
   │
   ├── API
   └── Events
          │
          ▼
        users
6. Contract boundary

Cross-service communication must use explicit contracts.

Contracts may describe:

HTTP API;
DTO;
event schema;
message schema;
validation schema;
protocol definition.

Contracts must not contain business implementation.

7. Package boundary

Workspace packages contain code with proven cross-service reuse.

Packages must not depend on application source.

Forbidden:

packages/*
    X
    ↓
apps/*

A package is a reusable library, not a microservice.

8. Evolution boundary

New architectural boundaries are introduced only when justified.

Preferred evolution:

local code
   ↓
real reuse appears
   ↓
workspace package

feature
   ↓
autonomous capability
   ↓
microservice

Do not create empty architectural structures in advance.

9. Non-goals

The following are not architectural boundaries by themselves:

components/
hooks/
utils/
types/

Technical categories are allowed inside an existing architectural boundary,
but must not replace responsibility-oriented boundaries.
