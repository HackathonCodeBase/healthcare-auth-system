import { PrismaClient, Role } from "@prisma/client";
<<<<<<< HEAD
import * as argon2 from "argon2";
=======
import argon2 from "argon2";
>>>>>>> 3b5969d318a5ab0380d1a8d5df4c76d8197bf107

const prisma = new PrismaClient();

async function main() {
    const password = await argon2.hash("Demo123!");

<<<<<<< HEAD
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
                staffId: nurse.id,         // User ID of the nurse
            },
        });
    }

    // ======================
    // EMERGENCY ACCESS SAMPLE
    // ======================
=======
    const usersData = [
        { name: "Siddarth Acharya", email: "acharyasiddarth74@gmail.com", role: "ADMIN" },
        { name: "Siddharth Acharya", email: "siddharthjabroni@gmail.com", role: "DOCTOR" },
        { name: "Siddharth", email: "s0188791@gmail.com", role: "NURSE" },
        { name: "Siddharth Acharya", email: "siddharthacharyaa@gmail.com", role: "PATIENT" },
        { name: "Siddharth V Acharya", email: "acharyasiddharthv@gmail.com", role: "PATIENT" },
        { name: "SIDDARTH V ACHARYA", email: "siddarth.ai23@sahyadri.edu.in", role: "DOCTOR" },
        { name: "Siddarth V Acharya", email: "siddarth302005@gmail.com", role: "NURSE" },
        { name: "Siddarth V Acharya", email: "siddarthvacharya123@gmail.com", role: "PATIENT" },
        { name: "Cine Flick", email: "cineflickbuzz@gmail.com", role: "ADMIN" },
    ];

    const users = [];

    for (const u of usersData) {
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: {
                name: u.name,
                role: u.role as Role,
                passwordHash: password,
                status: "ACTIVE",
                isVerified: true
            },
            create: {
                name: u.name,
                email: u.email,
                passwordHash: password,
                role: u.role as Role,
                status: "ACTIVE",
                isVerified: true,
            },
        });

        users.push(user);
    }

    const patients = [];
    for (const u of users.filter(u => u.role === "PATIENT")) {
        const patient = await prisma.patient.upsert({
            where: { userId: u.id },
            update: {},
            create: {
                userId: u.id,
                dateOfBirth: new Date("1990-01-01"),
                medicalId: `MED-${u.id.substring(0, 8).toUpperCase()}`,
                history: "Seeded patient record"
            },
        });
        patients.push(patient);
    }

    const doctor = users.find((u) => u.role === "DOCTOR")!;
    const patient = patients[0]; // This is a Patient record, not User

    await prisma.assignment.upsert({
        where: {
            staffId_patientId: {
                staffId: doctor.id,
                patientId: patient.id
            }
        },
        update: {},
        create: {
            staffId: doctor.id,
            patientId: patient.id,
        },
    });

    await prisma.consent.create({
        data: {
            patientId: patient.userId, // This is User id for Consent
            staffId: doctor.id,
            status: "ACTIVE"
        },
    });

>>>>>>> 3b5969d318a5ab0380d1a8d5df4c76d8197bf107
    await prisma.emergencyAccess.create({
        data: {
            doctorId: doctor.id,
            patientId: patient.id,
<<<<<<< HEAD
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
=======
            reason: "Critical condition demo",
            expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
    });

    for (const u of users) {
        await prisma.auditLog.create({
            data: {
                userId: u.id,
                role: u.role,
                action: "SEED_CREATE",
                resource: "User",
                ipAddress: "127.0.0.1",
                result: "SUCCESS",
                details: {
                    workflow: { state: "CREATED" },
                    context: { environment: "DEMO" },
                },
            },
        });
    }

    console.log("🌿 Demo database seeded successfully!");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
>>>>>>> 3b5969d318a5ab0380d1a8d5df4c76d8197bf107
