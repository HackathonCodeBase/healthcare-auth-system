# BACKEND_PRESENTATION_SCRIPT.md

## 1. PROBLEM STATEMENT

In the digital healthcare landscape, we face a fundamental paradox: medical data must be both perfectly secure and instantly available. Traditional authentication systems often rely on static passwords and binary permission models that are either too restrictive or dangerously permissive. When a system is too rigid, it blocks doctors from accessing life-saving information during emergencies. When it is too loose, it creates massive vulnerabilities for data breaches that violate patient privacy and regulatory frameworks like HIPAA.

Most existing solutions suffer from what we call Premature Trust. They assume that once a user is logged in, their identity is absolute and their intentions are benign. They lack the granularity to distinguish between a doctor who is actually assigned to a patient and one who is simply browsing the directory. Furthermore, they lack an immutable record of clinical actions, making it nearly impossible to reconstruct the sequence of events after a security incident. We built this system to solve these exact gaps by implementing a Zero-Trust architecture specifically tailored for the high-stakes environment of healthcare.

## 2. HIGH-LEVEL SYSTEM OVERVIEW

Our platform is a production-grade backend engineered to manage identity and access as a dynamic, continuous process rather than a one-time check. At its core, the system governs how patients, doctors, and nurses interact with sensitive medical records. It treats every request as potentially untrusted until it can verify identity through multi-step onboarding, authorize access via multi-layered policies, and record the transaction in a cryptographically linked audit trail.

This is not just a login portal; it is a security orchestrator. It handles complex healthcare workflows such as Patient Consent, where a patient explicitly grants or revokes access to specific providers, and the "Break-Glass" mechanism, which allows for emergency overrides when a patient's life is at risk. By moving away from simple roles and towards attribute-based context, we ensure that the right person gets the right data at the right time, and only for the right reason.

## 3. ARCHITECTURE OVERVIEW

The system follows a modular, layered architecture designed for separation of concerns and technical resilience. We have structured the backend into a series of distinct layers that work together to form a security perimeter.

At the very front is the Gateway Layer, which handles security headers, Cross-Origin Resource Sharing (CORS) policies, and rate limiting to prevent brute-force attacks. Behind this sits the Middleware Layer, where incoming requests are decoded, validated against rigid schemas, and checked for authentication. The logic then flows into the Domain Services Layer, which encapsulates our business rules for auth, patients, and clinical workflows. Finally, the Persistence Layer manages our primary records in PostgreSQL and our high-speed ephemeral data in Redis.

[Text-Based Architecture Diagram]

Client (React Dashboard)
        |
        v
[ Gateway: Helmet, CORS, Rate Limiter ]
        |
        v
[ Middleware: Zod Validation, JWT Auth, Audit Logger ]
        |
        v
[ Domain Services: Auth, Patient, Consent, Emergency Access ]
        |       |       |
        v       v       v
[ Redis ]  [ Prisma ]  [ SMTP ]
(Cache)    (ORM)       (Email)
        |       |
        v       v
[ Ephemeral ] [ PostgreSQL ]

This stateless design ensures that we can scale horizontally. Since the backend does not store session state in memory, we can spin up multiple instances behind a load balancer without worrying about where a specific user is logged in.

## 4. TECHNOLOGY STACK JUSTIFICATION

We chose each component of our stack based on its ability to provide type safety, deterministic behavior, and industrial-strength security.

Node.js was selected for its non-blocking I/O model, which is ideal for a system that must handle many concurrent telemetry and logging streams. We paired this with TypeScript to add a layer of static analysis. In a healthcare system, a "null" reference or a type mismatch on a patient ID can lead to catastrophic logic errors; TypeScript prevents these at compile time.

For our API framework, we used Express.js because of its battle-tested middleware ecosystem, allowing us to easily inject security audits and validation into any route. Our primary database is PostgreSQL, hosted on Supabase. We chose Postgres because healthcare data is inherently relational—links between doctors, patients, and consents demand the strong consistency and ACID guarantees that traditional SQL provides. To interact with it, we used Prisma ORM, which generates a type-safe client that mirrors our database schema perfectly, reducing the surface area for injection attacks.

For ephemeral data, Redis is used as our high-speed trust store. It handles data that must disappear quickly, such as OTP codes and token blacklists. Password security is handled by Argon2, currently the strongest hashing algorithm available, designed to be resistant to both GPU cracking and side-channel attacks. Authorization is powered by CASL, which allows us to define "Abilities" that can be checked both on the backend and shared with the frontend. Finally, we used Zod for runtime validation, ensuring that no malformed or malicious payload ever reaches our database logic.

## 5. DATABASE DESIGN

The database is structured around several core entities that represent the healthcare ecosystem. The User table is our central identity store, housing emails, roles, and Argon2-hashed passwords. However, a User is not always a Patient, so we have a dedicated Patient table that links back to a User ID and contains clinical identifiers like the Medical ID.

To manage the complex matrix of access, we use two primary mapping tables. The Assignment table records formal relationships between staff and patients, while the Consent table records a patient's explicit permission for a specific doctor to view their records. For life-threatening scenarios, the EmergencyAccess table stores temporary, self-granted overrides.

Every security-sensitive event is captured in the AuditLog table, while the RefreshToken table manages long-lived sessions independently of the primary User record. By using structured metadata fields (JSONB) in these tables, we remain flexible enough to store evolving clinical context without needing frequent schema migrations.

## 6. AUTHENTICATION FLOW

Our authentication process is a journey from anonymity to verified trust. It starts with Registration, where a user provides their credentials. Rather than activating the account immediately, the system enters a "Pending" state and dispatches a 6-digit OTP via SMTP. This verifies that the user controls the communication channel they have provided.

Once the OTP is verified against a TTL-bound record in Redis, the account is marked active. During Login, the system verifies the Argon2 hash and issues a pair of JWTs: a short-lived Access Token and a long-lived Refresh Token. The Access Token contains the user's role and ID, and it must be presented in the Authorization header for every request. If an Access Token expires, the client uses the Refresh Token to get a new one without forcing the user to log in again. Importantly, during Logout, we don't just delete the client-side token; we blacklist it in Redis and delete the Refresh Token from the database, effectively killing the session across the entire system.

## 7. AUTHORIZATION MODEL

We implement a hybrid of Role-Based (RBAC) and Attribute-Based Access Control (ABAC). While roles like ADMIN or DOCTOR provide a broad baseline, they are not enough for a zero-trust environment.

To solve this, we integrated the CASL policy engine. When a request comes in, the system defines an "Ability" object based on the user's current attributes. For example, a Doctor has the general "role ability" to read patients, but our ABAC logic further constrains this. The system checks attributes like: Is there an active Assignment? Is there a valid Consent record? Or is there an active Emergency Override? This dynamic evaluation happens at the service layer, ensuring that even if a doctor is logged in, they cannot query data for a patient who is not under their care.

## 8. CONSENT MANAGEMENT WORKFLOW

Consent is the mechanism by which we return power to the patient. Think of it as a digital handshake. In our system, the patient is the ultimate owner of their data permissions. Through their dashboard, a patient can search for a staff member and "Grant Consent." This creates a record in our database that the authorization engine immediately recognizes.

From a technical standpoint, this means that even without a formal hospital assignment, a doctor can gain access if the patient explicitly authorizes it. This is crucial for specialist referrals. Most importantly, consent is revocable. When a patient revokes a doctor's access, the system marks the record as REVOKED or deletes it, and the doctor's next attempt to fetch that patient's data will result in a 403 Forbidden error, as the attribute check in the CASL policy will now fail.

## 9. EMERGENCY “BREAK-GLASS” ACCESS

In healthcare, there are "Break-Glass" scenarios where strict consent rules must be bypassed to save a life—for example, when a patient is unconscious. We built a dedicated Emergency Access workflow for these moments.

When a doctor triggers an emergency override, the system requires a written justification. Upon submission, the backend grants an elevated, time-bound permission that is stored in Redis with a 2-hour TTL. During this window, the authorization engine allows the doctor to bypass the typical Assignment or Consent checks. However, this access is "loud": it creates a high-priority Audit Log entry and flags the session as an emergency. Once the 2-hour timer in Redis expires, the access is automatically revoked with no manual intervention required.

## 10. REDIS USAGE

Redis is the "short-term memory" of our security architecture, and it is vital for performance and safety. We use it for data that is too sensitive or too transient for a permanent database.

First, we use it for OTP and Magic Link storage, where we leverage Redis's native Time-To-Live (TTL) feature to ensure codes automatically expire after 5 minutes. Second, we use it for Rate Limiting to prevent brute-force attacks on our login endpoints. Third, and most critically, we use it for our Token Blacklist. When a user logs out or a token is compromised, we store that token's signature in Redis until its natural expiration time. Since Redis searches are millisecond-fast, we can check every single incoming request against this blacklist without degrading the user experience.

## 11. SECURITY HARDENING

We have implemented several layers of "Defense in Depth." We don't rely on any single security measure; instead, we stack them. This begins with Helmet.js, which sets various HTTP headers to protect against cross-site scripting (XSS) and clickjacking. We also enforce strict CORS policies to ensure only our trusted frontend domain can talk to the API.

Information safety is maintained through Argon2 hashing, which ensures that even if the database is leaked, user passwords remain unreadable. We prevent replay attacks by using JTI (JWT IDs) and blacklisting. Furthermore, Zod acts as a "bouncer" at every route, stripping away any extra fields and ensuring that the data types exactly match our expectations before they ever touch the database logic.

## 12. AUDIT LOGGING SYSTEM

If an action isn't logged, it clinicaly didn't happen. Our audit system is designed for total accountability and regulatory compliance. We use a custom middleware that intercepts every response. It captures the User ID, their Role, the specific Action they took—such as "READ_PATIENT_RECORDS"—the target Resource, their IP address, and the final Result of the operation.

These logs are immutable. They provide the forensic trail necessary to answer the "Who, What, When, and Where" of any data access. For patients, we provide a transparency view where they can see who has accessed their records, ensuring that the system is accountable not just to the hospital, but to the patients themselves.

## 13. DATA FLOW EXAMPLES

To see how these systems interact, let's walk through a few sequences. When a user registers, the data flows from the controller into the Auth Service, hashes the password via Argon2, saves a "pending" user in Prisma, and then fires an event to the Mail Service and Redis to handle the OTP.

When a doctor tries to access a patient's record, the request passes through the JWT middleware to prove who they are. Then, it enters the Authorization Service, which queries Prisma to check if there is an Assignment, a Consent, or an Emergency mark for that specific doctor-patient pair. Only if one of these attributes returns true will the database actually release the medical records. If the doctor has no link to the patient, the system throws a ForbiddenError before the database query is even fully constructed.

## 14. SCALABILITY & RELIABILITY

Architecting for healthcare means architecting for 100% uptime. Our stateless design is the key here. Because we don't store session data in the web server's memory—relying instead on Redis and JWTs—we can scale our backend horizontally across multiple containers or servers.

We also built resilience into our external integrations. For example, our Audit Logger is designed to be "resilient," meaning if the database logging fails, it won't crash the actual medical request, though it will log the failure to our internal Winston logs for immediate developer attention. By using a connection pooler like Supabase's built-in transaction mode, we ensure the database can handle spikes in traffic during major medical events or shifts.

## 15. LIMITATIONS & FUTURE IMPROVEMENTS

While this system is robust, our roadmap includes several key enhancements. We intend to implement native Multi-Factor Authentication (MFA) via TOTP, moving beyond simple email OTP. We are also looking at integrating Single Sign-On (SSO) using OpenID Connect to allow larger hospital networks to use their existing credentials.

In terms of architecture, as the system grows, we plan to migrate the Audit Logging and Emailing services into independent microservices handled by a message queue like RabbitMQ. This would further decouple the clinical path from the support services, ensuring that even if the mail server is down, clinical care continues uninterrupted.

## 16. CONCLUSION

In summary, we have built more than just an application; we have engineered a Zero-Trust security foundation for the future of healthcare. By combining the type safety of TypeScript, the relational power of PostgreSQL, the speed of Redis, and the granular logic of ABAC, we have created a system where privacy and access are no longer in competition.

This platform ensures that medical data is protected against compromise, compliant with the strictest standards, and yet instantly accessible when a life is on the line. It is a production-grade solution designed to bring trust back to digital healthcare.
