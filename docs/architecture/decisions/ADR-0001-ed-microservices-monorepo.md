
ADR-0001: Adopt ED Microservices Monorepo as Architectural Baseline
Status: Accepted
Date: 2026-09-02
Context

The Order Management System is being developed as a distributed,
failure-tolerant system.

The repository is intentionally organized as a monorepo while runtime
responsibilities are kept independent.

The system needs clear boundaries between:

repository organization;
deployable applications;
internal application responsibilities;
reusable workspace packages;
contracts;
runtime communication;
data ownership.
Decision

Adopt the ED Microservices Monorepo Pattern as the architectural baseline.

The architecture uses:

Monorepo
    ↓
Microservices
    ↓
ED internal architecture
    ↓
Explicit contracts
    ↓
Independent runtime

At repository level:

apps/
packages/
tooling/
infrastructure/

Inside a service:

app/
features/
services/
shared/

Dependency direction:

app
 ↓
features
 ↓
services
 ↓
shared

Cross-service integration uses explicit contracts and runtime communication.

Services do not import each other's source code.

Services do not directly access each other's databases.

Shared workspace packages are extracted only after real reuse is demonstrated.

Consequences
Positive
Runtime boundaries remain independent from repository boundaries.
Ownership becomes explicit.
Dependency direction is predictable.
Cross-service coupling is visible.
Architecture can evolve incrementally.
The repository can support independent deployment units.
Negative
Architectural discipline is required.
Contracts become explicit artifacts.
Distributed runtime behavior must be tested separately.
Additional tooling will be required to automatically enforce boundaries.
Rejected alternatives
Monolithic backend inside monorepo

Not adopted as the target architecture when separate runtime ownership is
required.

Global shared package

Not adopted as a default because it creates hidden coupling and weakens
ownership.

Premature microservice decomposition

Not adopted. New services are introduced only when autonomous ownership and a
runtime boundary are justified.

Governing principle
Local first
    ↓
Reuse second
    ↓
Extract only when justified
    ↓
Deploy independently when ownership becomes autonomous

