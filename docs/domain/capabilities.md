
Capability Map
Purpose

This document lists business capabilities under consideration.

A capability is not automatically a microservice.

The same capability may initially live as:

feature
    ↓
internal service
    ↓
microservice

depending on demonstrated ownership and runtime requirements.

Capability inventory
Capability	Status	Current interpretation	Independent service?
Order Management	Confirmed by project identity	Core order lifecycle	Not decided
Identity & Access	Candidate	Authentication and authorization	Not decided
Customer Management	Candidate	Customer/account information	Not decided
Product Catalog	Candidate	Product information available for ordering	Not decided
Inventory	Candidate	Stock availability and reservation	Not decided
Payments	Candidate	Payment processing state	Not decided
Fulfillment	Candidate	Shipment / fulfillment lifecycle	Not decided
Notifications	Candidate	Delivery of operational notifications	Not decided
Important interpretation

Only Order Management is currently grounded by the project identity itself.

All other entries are hypotheses intended to guide discovery.

They must not be treated as approved domain boundaries until supported by
functional requirements.

Order Management
Current hypothesis

The system's primary capability is management of orders.

Potential responsibilities include:

create order
validate order
change order state
cancel order
query order
maintain order history

These are capability hypotheses, not final requirements.

Candidate ownership
Order Management
    owns
    ├── order lifecycle
    ├── order business rules
    ├── order API
    └── order data

This follows the ED ownership principle: a service owns its code,
business rules, API and data.

Candidate supporting capabilities

The following may become independent capabilities:

Identity & Access

Potential responsibility:

authentication
authorization
identity lifecycle
Customer Management

Potential responsibility:

customer profile
customer contact information
customer-related lifecycle
Product Catalog

Potential responsibility:

product identity
product attributes
product availability for sale
Inventory

Potential responsibility:

stock
reservation
release
availability
Payments

Potential responsibility:

payment intent
payment status
payment lifecycle
Fulfillment

Potential responsibility:

shipment
fulfillment state
delivery lifecycle
Notifications

Potential responsibility:

email
SMS
push
operational notifications

These are working hypotheses only.

Boundary decision rule

A capability becomes an independent microservice only when there is evidence
for autonomous ownership and a separate runtime boundary.

Questions:

Is the responsibility independent?
Is there a coherent business capability?
Does it own data?
Does it need an independent lifecycle?
Does it need independent scaling?
Does it need independent deployment?
Does it require a clear external contract?

If the answer is insufficient:

capability
    ↓
existing service / feature

rather than a new microservice.
