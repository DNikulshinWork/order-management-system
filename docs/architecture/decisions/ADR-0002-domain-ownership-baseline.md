
ADR-0002: Establish Domain and Ownership Baseline
Status: Accepted
Date: 2026-09-02
Context

The repository currently identifies the project as an Order Management System,
but does not yet contain detailed functional requirements.

The architecture therefore cannot honestly define a final set of microservices
at this stage.

Decision

Adopt an evolutionary domain discovery process.

The project will distinguish:

Confirmed
Candidate
Rejected
Deferred

The current confirmed domain responsibility is the existence of an
Order Management capability at the project level.

Supporting capabilities are treated as hypotheses until validated.

Candidate capabilities

Current working candidates:

Identity & Access
Customer Management
Product Catalog
Inventory
Payments
Fulfillment
Notifications

These names do not create runtime boundaries.

Boundary rule

A candidate becomes an independent microservice only when autonomous
ownership and an independent runtime boundary are justified.

Otherwise it remains:

feature
or
internal service
or
part of an existing service
Data ownership

Each eventual service owns its data.

Direct access to another service's database is prohibited.

Consequences
Positive
Prevents premature microservice decomposition.
Makes ownership explicit.
Allows the architecture to evolve with actual requirements.
Preserves independent runtime boundaries when they become justified.
Negative
Some architecture decisions remain intentionally unresolved.
Additional domain discovery is required before implementation of several
capabilities.
Governing principle
Capability
    ↓
Ownership
    ↓
Data ownership
    ↓
Boundary decision
    ↓
Contract
    ↓
Runtime

