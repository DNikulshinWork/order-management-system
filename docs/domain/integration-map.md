Domain Integration Map
Current state

The runtime integration graph is intentionally not implemented yet.

At this stage we only define the intended form of communication.

Capability A
│
├── API
└── Event / Message
│
▼
Capability B
Forbidden integration

Capabilities must not be coupled through internal source imports.

Capability A
X
↓
Capability B source code

They must also not bypass ownership through direct database access.

Capability A
X
↓
Capability B database
Candidate order lifecycle

A future order lifecycle may involve several capabilities:

Client
↓
Order Management
│
├── Inventory
├── Payments
└── Fulfillment

This is only a conceptual hypothesis.

No transport mechanism is selected at this stage.

Possible mechanisms remain:

HTTP
gRPC
Events
Messages

The final decision depends on actual workflow requirements.

Synchronous vs asynchronous

Use synchronous communication when an immediate response is intrinsic to the
operation.

Use asynchronous communication when decoupling, independent processing or
event-driven workflows provide a real architectural benefit.

The transport must follow the ownership and runtime boundary, not define it.

Contract boundary

Whenever two independent runtime units communicate, the boundary must be
explicit.

Possible contract contents:

HTTP DTO
event schema
message schema
validation schema
protocol definition

Contracts contain interface definitions, not business implementation.
