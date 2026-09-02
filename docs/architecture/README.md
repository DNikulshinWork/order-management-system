# Architecture Governance

## Purpose

This directory contains the architectural rules and decisions of the
Order Management System.

The project follows the ED Microservices Monorepo Pattern.

The architecture is governed by four principles:

1. Ownership
2. Boundary
3. Direction
4. Evolution

## Architectural levels

### System level

```text
repository
├── apps
├── packages
├── tooling
└── infrastructure
Service level
apps/<service>/
└── src/
    ├── app/
    ├── features/
    ├── services/
    └── shared/
Runtime level

Microservices are independent runtime and deployment units.

Integration level

Services communicate through explicit contracts:

HTTP
gRPC
Events
Messages
Documents
Boundaries
Dependencies
Ownership
ADR-0001: ED Microservices Monorepo
Core formula
Ownership
    ↓
Boundary
    ↓
Direction
    ↓
Proven Reuse
    ↓
Explicit Contract
    ↓
Independent Runtime
Evolution rule

Architecture evolves with the system.

Do not create new microservices, packages, or architectural layers without
a concrete responsibility and a justified reason for the boundary.
