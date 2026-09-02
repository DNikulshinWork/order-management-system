Domain Ownership
Ownership principle

Every responsibility must have one clear owner.

Ownership includes:

business rules
data
API
runtime responsibility
Current ownership state
Responsibility Owner Data owner Status
Order lifecycle Order Management Order Management Working baseline
Authentication Undecided Undecided Candidate
Authorization Undecided Undecided Candidate
Customer lifecycle Undecided Undecided Candidate
Product catalog Undecided Undecided Candidate
Inventory Undecided Undecided Candidate
Payment lifecycle Undecided Undecided Candidate
Fulfillment lifecycle Undecided Undecided Candidate
Notifications Undecided Undecided Candidate
Order Management ownership

Current working boundary:

Order Management
│
├── order lifecycle
├── order rules
├── order API
└── order data

No other candidate capability may directly own or modify order data.

Data ownership rule

The eventual architecture follows:

one capability
↓
one owner
↓
owned data

A different service must obtain required information through an explicit
contract rather than direct database access.

Forbidden:

Service A
↓
Service B database

Allowed:

Service A
↓
API / Event
↓
Service B
Ownership questions

Before approving a new boundary, answer:

Who owns this responsibility?

What business rules belong to it?

What data does it own?

What API does it expose?

What events does it publish?

Who depends on it?

Who must not depend on it?

Does it require a separate runtime?
Unresolved ownership

The following ownership decisions remain intentionally unresolved:

Identity & Access
Customer Management
Product Catalog
Inventory
Payments
Fulfillment
Notifications

They require business requirements before becoming architectural
boundaries.

Evolution rule

Ownership should become clearer as the system gains real behavior.

Do not create a service merely to make the ownership table look complete.
