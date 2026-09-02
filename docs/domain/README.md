# Domain Model

## Purpose

This directory contains the evolving domain model of the
Order Management System.

The domain model is intentionally evolutionary.

No microservice is created merely because a capability is listed here.

A capability becomes a service boundary only when autonomous ownership
and a runtime boundary are justified.

## Current evidence

The repository establishes the project as an Order Management System.

At the current stage there are no detailed functional requirements in the
repository.

Therefore the capability inventory below contains:

- confirmed information;
- working hypotheses;
- decisions that still require validation.

## Domain modeling rule

```text
Capability
    ↓
Responsibility
    ↓
Ownership
    ↓
Data ownership
    ↓
Contract
    ↓
Runtime boundary
Core principle
Local first
    ↓
Prove ownership
    ↓
Evaluate boundary
    ↓
Extract when justified
Documents
Capabilities
Ownership
Integration Map
Status vocabulary
Status	Meaning
Confirmed	Supported by explicit project requirements
Candidate	Working hypothesis requiring validation
Rejected	Explicitly not treated as an independent capability
Deferred	Potential capability, but insufficient evidence
Important rule

The domain model is authoritative only to the extent supported by project
requirements and accepted architecture decisions.

Candidates must not automatically become applications in apps/.
