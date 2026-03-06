"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const argon2 = __importStar(require("argon2"));
const prisma = new client_1.PrismaClient();
async function main() {
    const password = await argon2.hash("Demo123!");
    // ======================
    // USERS
    // ======================
    const admin = await prisma.user.upsert({
        where: { email: "admin@demo.com" },
        update: { passwordHash: password, isVerified: true, status: "ACTIVE" },
        create: {
            name: "System Admin",
            email: "admin@demo.com",
            passwordHash: password,
            role: "ADMIN",
            status: "ACTIVE",
            isVerified: true,
            contactNumber: "+1-555-0101",
        },
    });
    const doctor = await prisma.user.upsert({
        where: { email: "doctor@demo.com" },
        update: { passwordHash: password, isVerified: true, status: "ACTIVE" },
        create: {
            name: "Dr. Strange",
            email: "doctor@demo.com",
            passwordHash: password,
            role: "DOCTOR",
            status: "ACTIVE",
            isVerified: true,
            specialty: "Neurosurgery",
            contactNumber: "+1-555-0202",
        },
    });
    const nurse = await prisma.user.upsert({
        where: { email: "nurse@demo.com" },
        update: { passwordHash: password, isVerified: true, status: "ACTIVE" },
        create: {
            name: "Nurse Joy",
            email: "nurse@demo.com",
            passwordHash: password,
            role: "NURSE",
            status: "ACTIVE",
            isVerified: true,
            contactNumber: "+1-555-0303",
        },
    });
    const patientUser = await prisma.user.upsert({
        where: { email: "patient@demo.com" },
        update: { passwordHash: password, isVerified: true, status: "ACTIVE" },
        create: {
            name: "John Doe",
            email: "patient@demo.com",
            passwordHash: password,
            role: "PATIENT",
            status: "ACTIVE",
            isVerified: true,
            contactNumber: "+1-555-0404",
            address: "123 Main St, Springfield",
        },
    });
    const doctor2 = await prisma.user.upsert({
        where: { email: "doctor2@demo.com" },
        update: { passwordHash: password, isVerified: true, status: "ACTIVE" },
        create: {
            name: "Dr. Gregory House",
            email: "doctor2@demo.com",
            passwordHash: password,
            role: "DOCTOR",
            status: "ACTIVE",
            isVerified: true,
            specialty: "Infectious Disease",
            contactNumber: "+1-555-0505",
        },
    });
    const doctor3 = await prisma.user.upsert({
        where: { email: "doctor3@demo.com" },
        update: { passwordHash: password, isVerified: true, status: "ACTIVE" },
        create: {
            name: "Dr. John Watson",
            email: "doctor3@demo.com",
            passwordHash: password,
            role: "DOCTOR",
            status: "ACTIVE",
            isVerified: true,
            specialty: "General Medicine",
            contactNumber: "+1-555-0606",
        },
    });
    const patientUser2 = await prisma.user.upsert({
        where: { email: "patient2@demo.com" },
        update: { passwordHash: password, isVerified: true, status: "ACTIVE" },
        create: {
            name: "Jane Smith",
            email: "patient2@demo.com",
            passwordHash: password,
            role: "PATIENT",
            status: "ACTIVE",
            isVerified: true,
            contactNumber: "+1-555-0707",
            address: "456 Oak Rd, Springfield",
        },
    });
    const patientUser3 = await prisma.user.upsert({
        where: { email: "patient3@demo.com" },
        update: { passwordHash: password, isVerified: true, status: "ACTIVE" },
        create: {
            name: "Alice Johnson",
            email: "patient3@demo.com",
            passwordHash: password,
            role: "PATIENT",
            status: "ACTIVE",
            isVerified: true,
            contactNumber: "+1-555-0808",
            address: "789 Pine Ln, Springfield",
        },
    });
    // ======================
    // PATIENT RECORD
    // ======================
    const patient = await prisma.patient.upsert({
        where: { userId: patientUser.id },
        update: {},
        create: {
            userId: patientUser.id,
            dateOfBirth: new Date("1990-01-01"),
            medicalId: "MED-" + Date.now(),
            history: "Diabetes Type II, Allergy to Penicillin",
            bloodGroup: "O+",
            gender: "Male",
        },
    });
    const patient2 = await prisma.patient.upsert({
        where: { userId: patientUser2.id },
        update: {},
        create: {
            userId: patientUser2.id,
            dateOfBirth: new Date("1985-05-15"),
            medicalId: "MED-" + (Date.now() + 1),
            history: "Asthma, Hypertension",
            bloodGroup: "A-",
            gender: "Female",
        },
    });
    const patient3 = await prisma.patient.upsert({
        where: { userId: patientUser3.id },
        update: {},
        create: {
            userId: patientUser3.id,
            dateOfBirth: new Date("1992-11-20"),
            medicalId: "MED-" + (Date.now() + 2),
            history: "Migraine, No known allergies",
            bloodGroup: "B+",
            gender: "Female",
        },
    });
    // ======================
    // ASSIGNMENT
    // ======================
    // Note: Check if exists to prevent unique constraint error on re-seed
    const existingAssignment = await prisma.assignment.findFirst({
        where: { staffId: doctor.id, patientId: patient.id }
    });
    if (!existingAssignment) {
        await prisma.assignment.create({
            data: {
                staffId: doctor.id,
                patientId: patient.id,
            },
        });
    }
    const existingAssignment2 = await prisma.assignment.findFirst({
        where: { staffId: doctor2.id, patientId: patient2.id }
    });
    if (!existingAssignment2) {
        await prisma.assignment.create({
            data: {
                staffId: doctor2.id,
                patientId: patient2.id,
            },
        });
    }
    const existingAssignment3 = await prisma.assignment.findFirst({
        where: { staffId: doctor3.id, patientId: patient3.id }
    });
    if (!existingAssignment3) {
        await prisma.assignment.create({
            data: {
                staffId: doctor3.id,
                patientId: patient3.id,
            },
        });
    }
    const existingAssignment4 = await prisma.assignment.findFirst({
        where: { staffId: doctor.id, patientId: patient2.id }
    });
    if (!existingAssignment4) {
        await prisma.assignment.create({
            data: {
                staffId: doctor.id,
                patientId: patient2.id,
            },
        });
    }
    // ======================
    // CONSENT
    // ======================
    const existingConsent = await prisma.consent.findFirst({
        where: { patientId: patientUser.id, staffId: nurse.id }
    });
    if (!existingConsent) {
        await prisma.consent.create({
            data: {
                patientId: patientUser.id, // User ID of the patient
                staffId: nurse.id, // User ID of the nurse
            },
        });
    }
    // ======================
    // EMERGENCY ACCESS SAMPLE
    // ======================
    await prisma.emergencyAccess.create({
        data: {
            doctorId: doctor.id,
            patientId: patient.id,
            reason: "Emergency cardiac arrest",
            expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
        },
    });
    console.log("💀 Demo data seeded successfully");
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
