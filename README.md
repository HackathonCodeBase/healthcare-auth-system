# 🛡️ MedAuth: Zero-Trust Healthcare Access Platform

Protecting sensitive medical data through strict authentication, ephemeral keys, and immutable audit trails.

---

## 🛑 The Problem: Healthcare Data Security

Modern healthcare systems suffer from **Premature Trust**. Standard applications grant wide-ranging access based on static, easily compromised passwords. When emergencies occur, rigid security protocols either lock providers out of critical patient data or, conversely, over-provision access, leading to catastrophic data breaches and HIPAA violations.

## 💡 The Solution: MedAuth

**MedAuth** is a production-grade, full-stack healthcare security platform engineered around **Zero-Trust Principles**. 

We replace static trust with dynamic, verifiable communication channels and time-bound ephemeral access. MedAuth proves identity through multi-step trust onboarding, executes authorizations via granular **ABAC (Attribute-Based Access Control)**, and provides a secure **"Break-Glass"** override for medical emergencies—ensuring privacy and availability coexist.

---

## 🏗️ System Architecture

MedAuth utilizes a decoupled client-server architecture, prioritizing separation of concerns and defense-in-depth.

### 🌐 High-Level Component Flow
```mermaid
graph TD
    subgraph Client_Space ["User Interface Layer (React 19)"]
        UI[Glassmorphic Dashboard]
        Verify[OTP Verification In-line]
        Modal[Global Modal/Drawer Engine]
    end

    subgraph Defense_Perimeter ["Security Gateway (Express)"]
        LR[Rate Limiter]
        Val[Zod Schema Validator]
        Auth[JWT / CASL Auth Middleware]
        Blacklist[Redis Token Blacklist]
    end

    subgraph Service_Logic ["Business Domain"]
        AS[Auth Service]
        PS[Patient Service]
        CS[Consent Manager]
        ES[Emergency Access Handler]
    end

    subgraph Infrastructure_Layer ["Persistence & Trust"]
        DB[(PostgreSQL / Supabase)]
        RD[(Redis Ephemeral Store)]
        Audit[(Immutable Audit Logs)]
        SMTP[Email Trust Channel]
    end

    UI --> LR
    LR --> Val
    Val --> Auth
    Auth --> AS & PS & ES & CS
    AS --> RD & SMTP
    PS & ES & CS --> DB
    ES --> RD
    DB -.-> Audit
```

---

## 🔒 Security Operations & Workflows

### 1. The Multi-Step Trust Onboarding (Inline Verification)
Verification is not an afterthought; it is the gateway. MedAuth enforces a synchronous OTP verification flow during registration to ensure every active account is backed by a verified communication channel.

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant R as Redis
    participant E as Email System

    U->>F: Enter Credentials
    F->>B: POST /register
    B->>B: Hash Password (Argon2)
    B->>R: Store OTP (TTL 5m)
    B->>E: Dispatch OTP to User
    B-->>F: HTTP 201 (Step 1 Complete)
    F->>F: Switch to Inline OTP UI
    U->>F: Enter 6-Digit Code
    F->>B: POST /verify-otp
    B->>R: Fetch & Compare
    B->>R: Delete OTP (Prevent Replay)
    B->>B: Mark User verified = true
    B-->>F: HTTP 200 (Identity Confirmed)
    F->>U: Auto-Login & Redirect
```

### 2. Authorization Logic: CASL ABAC & RBAC
MedAuth doesn't just check roles; it checks **Attributes**.
*   **RBAC**: "Is this a Doctor?"
*   **ABAC**: "Is this Doctor assigned to this specific Patient or has active Consent?"

```mermaid
graph LR
    User((User)) --> Request{Resource Request}
    Request --> JWT[JWT Decryption]
    JWT --> Blacklist{Blacklist Check}
    Blacklist -->|Valid| Policy[CASL Policy Engine]
    Blacklist -->|Invalid| Deny401[401 Unauthorized]
    
    subgraph Policy_Rules
        R1[Role Check]
        R2[Assignment Match]
        R3[Consent Validation]
        R4[Emergency Override]
    end
    
    Policy --> R1 & R2 & R3 & R4
    R1 & R2 & R3 & R4 --> Dec[Decision]
    Dec -->|Allow| Data[(Medical Records)]
    Dec -->|Deny| Error[403 Forbidden]
```

### 3. Patient Consent Management Flow
Patients own their data. They can grant or revoke access to specific medical staff at any time.

```mermaid
sequenceDiagram
    participant P as Patient
    participant F as Frontend
    participant B as Backend
    participant D as Doctor

    P->>F: Locate Doctor in Directory
    P->>F: Click "Grant Consent"
    F->>B: POST /api/consent { staffId }
    B->>B: Verify Token & Patient Role
    B->>B: Create ACTIVE Consent Record
    B-->>F: Success
    F->>P: Visual Confirmation
    Note over D, B: Doctor can now access Patient's Full Record
    P->>F: Click "Revoke Access"
    F->>B: PATCH /api/consent { id, status: REVOKED }
    B-->>F: Access Terminated
```

### 4. Emergency "Break-Glass" Workflow
In critical care, seconds count. Authorized staff can bypass standard boundaries via a strictly audited mechanism.

```mermaid
stateDiagram-v2
    [*] --> Access_Denied: No Assignment/Consent
    Access_Denied --> Emergency_Form: Doctor Triggers Override
    Emergency_Form --> Verification: Submit Justification & OTP
    Verification --> Access_Granted: Temporary (2HR) Window
    
    state Access_Granted {
        [*] --> Timer_Start
        Timer_Start --> Permission_Active
        Permission_Active --> Permission_Expired: 2 Hours Elapsed
    }
    
    Access_Granted --> Audit_Log: Immutable Record Created
    Permission_Expired --> [*]: Access Revoked
```

### 5. Automated Audit Logging Persistence
Every critical action (Login, Access, Change) is captured with full context for forensic analysis.

```mermaid
flowchart LR
    Req[Incoming Request] --> Controller[Route Handler]
    Controller --> Finish[Response Sent]
    Finish --> Middleware[Audit Logger Middleware]
    Middleware --> Context[Extract User, Role, IP, Target]
    Context --> DB[(AuditLog Table)]
    DB --> Admin[Admin Dashboard Visualization]
```

---

## 🛠️ Technology Stack & Justifications

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Backend** | **Node.js / Express** | High concurrency for real-time telemetry. |
| **Type Safety** | **TypeScript** | Eliminates runtime authorization type errors. |
| **ORM** | **Prisma** | Deterministic, type-safe database access layer. |
| **Hashing** | **Argon2** | Industry-standard protection against GPU cracking. |
| **Validation** | **Zod** | Enforces data contract before logic execution. |
| **Cache** | **Redis** | Millisecond-level TTL enforcement and Blacklisting. |
| **Frontend** | **React 19 (Vite)** | Atomic component structure with shadcn/ui aesthetics. |
| **State** | **Zustand** | Lightweight security-focused state persistence. |
| **Styling** | **Tailwind CSS** | Premium dark-mode UI with glassmorphism. |

---

## 📂 Project Structure
```text
/healthcare-auth-system
├── /backend
│   ├── /prisma           # DB schema & Deterministic Seed
│   ├── /src
│   │   ├── /modules      # Domain Logic (Auth, Patients, Consent, Audit)
│   │   ├── /policies     # CASL ABAC Definitions
│   │   ├── /services     # Redis & SMTP Handlers
│   │   └── /middleware   # Security Perimeter (JWT, Audit, RateLimit)
├── /frontend
│   ├── /src
│   │   ├── /pages        # Onboarding Portal & Role-Specific Dashboards
│   │   ├── /store        # Zustand Secure Stores
│   │   ├── /layout       # AppLayout & Navigation
│   │   └── /services     # Axios Security Interceptors
```

---

## 🚀 Installation & Local Development

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env # Configure DB, Redis, and SMTP
npx prisma generate
npx prisma db seed # Primes DB with all demo roles
npm run dev
```

### 2. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev # Runs on port 5173
```

---

## 💎 Demo Login Accounts
Use these credentials for a full system walkthrough. **Default Password: `Demo123!`**

| Role | Email | Use Case |
| :--- | :--- | :--- |
| **👑 ADMIN** | `acharyasiddarth74@gmail.com` | View system-wide Audit Logs and forensics. |
| **🧑‍⚕️ DOCTOR** | `siddharthjabroni@gmail.com` | Access records via Assignment or Break-Glass. |
| **👩‍⚕️ NURSE** | `s0188791@gmail.com` | View safe patient data (restricted PII). |
| **🧑 PATIENT** | `siddharthacharyaa@gmail.com` | Manage Consent and view self-privacy logs. |

---

## 🎯 The Pitch Scenario
1.  **Zero-Trust Onboarding**: Register an account. Observe the **Inline OTP** verification—no verification, no access.
2.  **Granular Boundaries**: Log in as a Doctor. Attempt to view an unassigned patient (Blocked by ABAC).
3.  **Dynamic Consent**: Log in as a Patient. Grant access to a Doctor. Re-log as Doctor to see the record now unlocked.
4.  **Emergency**: Trigger **Break-Glass** for a critical situation. Gain instant, time-bound access.
5.  **Forensics**: Switch to Admin. View the **Audit logs** to see the immutable trail of every bypass and access.

---

## 📄 License
Licensed under the MIT License. Built for the Hackathon Stage-2 Submission.
