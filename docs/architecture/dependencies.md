
Dependency Rules
1. Three dependency graphs

The system contains three different graphs.

Source graph

Managed by PNPM:

workspace
   ↓
package dependencies
Task graph

Managed by Turborepo:

build
test
lint
typecheck
dev
Runtime graph

Managed by runtime communication:

HTTP
gRPC
events
messages
network

These graphs must not be confused.

2. Monorepo dependency direction

The default direction is:

apps
 ↓
packages

Packages must not depend on applications.

3. Internal service dependency direction

Canonical direction:

app
 ↓
features
 ↓
services
 ↓
shared

Allowed:

From	Allowed
app	features, services, shared
features	services, shared
services	shared
shared	external libraries / own shared layer

Forbidden:

shared   → features
shared   → services
services → features
4. Feature isolation

Feature-to-feature dependencies are exceptional.

Default rule:

feature A
    X
    ↓
feature B

If such dependency becomes permanent, reassess ownership and boundaries.

5. Microservice dependency

Microservices must communicate through explicit contracts.

Forbidden:

service A
    X
    ↓
service B source code

Correct:

service A
    │
    ├── API
    └── Event / Message
          │
          ▼
       service B
6. Database dependency

Forbidden:

service A
    X
    ↓
service B database

Correct:

service A
    │
    ├── API
    └── Event / Message
          │
          ▼
       service B
7. Public package API

Workspace packages must expose an explicit public boundary.

Preferred:

import { UserCreatedEvent } from '@repo/contracts';

Avoid consumers depending on internal package paths.

8. Forbidden architectural patterns
Shared dumping ground

Do not create:

packages/common/
packages/utils/
packages/shared/
packages/misc/

without a concrete architectural responsibility.

Shared business implementation

Avoid:

packages/shared/business/

when the code belongs to one service owner.

Cross-service source imports

Never:

orders → users/src/*
Cross-database access

Never:

orders → users DB
Cycles

Dependency cycles are forbidden.

9. Automatic verification target

These rules must eventually be enforced automatically.

Possible mechanisms include:

ESLint;
TypeScript;
dependency-cruiser;
custom scripts;
CI;
package-level restrictions.

Automatic enforcement will be added when application boundaries exist and
there is real dependency structure to validate.
