Ownership Model

1. Ownership is the primary architectural principle

Every responsibility must have an owner.

Ownership is more important than physical file placement.

2. Service ownership

A microservice owns:

code
business rules
API
data
runtime
configuration

Example:

Orders Service
owns
├── order lifecycle
├── order API
└── order data 3. Capability ownership

Before creating a microservice, identify the capability.

Questions:

Does it have an independent responsibility?
Does it represent a business capability?
Does it need an independent lifecycle?
Does it require independent scaling?
Does it have data ownership?
Does it require a separate deployment boundary?
Does it have a clear contract?

Insufficient evidence means the capability may still belong to an
existing service or feature.

4. Data ownership

Each service owns its data.

service
↓
owned database

Other services access that information through explicit contracts.

5. Local-first rule

New implementation starts inside the smallest responsible boundary.

new code
↓
local service
↓
real reuse appears
↓
evaluate extraction
↓
workspace package

Do not extract code into a package merely because it might be useful later.

6. Service extraction

A capability may evolve:

module
↓
feature
↓
service
↓
microservice

A microservice becomes justified when the capability has autonomous ownership
and requires its own runtime boundary.

7. Ownership review

Whenever a new directory, package, feature or service is proposed, answer:

Who owns this responsibility?

What data does it own?

What contract does it expose?

Who may depend on it?

Who must not depend on it?

Does it require a new runtime boundary?

If ownership cannot be stated clearly, the boundary is probably premature.
