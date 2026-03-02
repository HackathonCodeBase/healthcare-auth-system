import { PrismaClient, Role } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
    const password = await argon2.hash("Demo123!");

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

    await prisma.emergencyAccess.create({
        data: {
            doctorId: doctor.id,
            patientId: patient.id,
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
