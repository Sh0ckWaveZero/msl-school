import "dotenv/config";
import { PrismaClient } from "./generated";
import prisma from "./index";

/**
 * Seed database with sample data for MSL School system
 */
async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // 1. สร้าง Role Permissions
    console.log("📋 Creating role permissions...");
    const adminRole = await prisma.rolePermission.upsert({
      where: { name: "admin" },
      update: {},
      create: {
        name: "admin",
        label: "ผู้ดูแลระบบ",
        permissions: {
          users: ["create", "read", "update", "delete"],
          students: ["create", "read", "update", "delete"],
          teachers: ["create", "read", "update", "delete"],
          reports: ["create", "read", "update", "delete"],
          system: ["manage"]
        }
      }
    });

    const teacherRole = await prisma.rolePermission.upsert({
      where: { name: "teacher" },
      update: {},
      create: {
        name: "teacher",
        label: "ครู",
        permissions: {
          students: ["read", "update"],
          reports: ["create", "read", "update"],
          attendance: ["create", "read", "update"],
          grades: ["create", "read", "update"]
        }
      }
    });

    // 2. สร้าง Academic Structure
    console.log("🏫 Creating academic structure...");
    
    // Department
    const department = await prisma.department.create({
      data: {
        departmentId: "DEPT001",
        name: "มัธยมศึกษา",
        description: "แผนกมัธยมศึกษา"
      }
    });

    // Level
    const level = await prisma.level.create({
      data: {
        levelId: "LV001",
        levelName: "ม.1",
        levelFullName: "มัธยมศึกษาปีที่ 1"
      }
    });

    // Program
    const program = await prisma.program.upsert({
      where: { programId: "PROG001" },
      update: {},
      create: {
        programId: "PROG001",
        name: "วิทย์-คณิต",
        description: "แผนการเรียนวิทยาศาสตร์-คณิตศาสตร์",
        departmentId: department.id,
        levelId: level.id
      }
    });

    // Classroom
    const classroom = await prisma.classroom.upsert({
      where: { name: "1/1" },
      update: {},
      create: {
        name: "1/1", 
        description: "ห้องเรียน 1/1"
      }
    });

    // 3. สร้าง Users
    console.log("👥 Creating users...");
    
    // Admin User
    const adminUser = await prisma.user.upsert({
      where: { username: "admin" },
      update: {},
      create: {
        username: "admin",
        password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
        email: "admin@msl.ac.th",
        role: "Admin"
      }
    });

    // Teacher User
    const teacherUser = await prisma.user.upsert({
      where: { username: "teacher1" },
      update: {},
      create: {
        username: "teacher1",
        password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
        email: "teacher1@msl.ac.th",
        role: "Teacher"
      }
    });

    // Student User
    const studentUser = await prisma.user.upsert({
      where: { username: "student1" },
      update: {},
      create: {
        username: "student1",
        password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
        email: "student1@msl.ac.th",
        role: "User"
      }
    });

    // 4. สร้าง Accounts และ Profiles
    console.log("📝 Creating accounts and profiles...");

    // Admin Account
    await prisma.account.upsert({
      where: { userId: adminUser.id },
      update: {},
      create: {
        userId: adminUser.id,
        firstName: "ผู้ดูแล",
        lastName: "ระบบ",
        addressLine1: "โรงเรียนมัธยมศึกษาลาดพร้าว"
      }
    });

    // Teacher Account & Profile
    await prisma.account.upsert({
      where: { userId: teacherUser.id },
      update: {},
      create: {
        userId: teacherUser.id,
        firstName: "สมชาย",
        lastName: "ใจดี",
        addressLine1: "123 ถ.ลาดพร้าว กรุงเทพฯ"
      }
    });

    const teacher = await prisma.teacher.upsert({
      where: { userId: teacherUser.id },
      update: {},
      create: {
        userId: teacherUser.id,
        departmentId: department.id
      }
    });

    // Student Account & Profile
    await prisma.account.upsert({
      where: { userId: studentUser.id },
      update: {},
      create: {
        userId: studentUser.id,
        firstName: "สมใจ",
        lastName: "เรียนดี",
        addressLine1: "456 ถ.รัชดา กรุงเทพฯ"
      }
    });

    const student = await prisma.student.upsert({
      where: { userId: studentUser.id },
      update: {},
      create: {
        userId: studentUser.id,
        studentId: "S2568001",
        programId: program.id,
        departmentId: department.id,
        levelId: level.id
      }
    });

    // 5. สร้าง Course
    console.log("📚 Creating courses...");
    const course = await prisma.course.upsert({
      where: { courseId: "MATH101" },
      update: {},
      create: {
        courseId: "MATH101",
        courseName: "คณิตศาสตร์ พื้นฐาน",
        programId: program.id
      }
    });

    console.log("✅ Database seeding completed successfully!");
    console.log("📊 Created sample data:");
    console.log("   - Users: admin, teacher1, student1 (password: password)");
    console.log("   - Academic structure: department, level, program, classroom");
    console.log("   - Teacher and student profiles with course");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run the seed function
seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
