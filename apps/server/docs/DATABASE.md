# Database Documentation - MSL School

## 📋 ภาพรวมของระบบ

ระบบจัดการโรงเรียนสำหรับประเทศไทย รองรับการทำงานของสถาบันการศึกษาระดับอาชีวศึกษา (ปวช./ปวส.) ครอบคลุมการจัดการผู้ใช้งาน โครงสร้างการศึกษา การเรียนการสอน การเช็คชื่อ การประเมินพฤติกรรม และการเยี่ยมบ้านนักเรียน

## 🏗️ โครงสร้างฐานข้อมูล

### 🛠️ Technical Stack
- **Database**: PostgreSQL with uuid-ossp extension
- **ORM**: Prisma (ESM format)
- **Type Safety**: TypeScript + Zod validation
- **Authentication**: Session-based

### 👥 การจัดการผู้ใช้งานและสิทธิ์

#### User (ผู้ใช้งาน)
```prisma
model User {
  id                 String             @id @default(uuid())
  username           String             @unique
  password           String
  email              String?
  role               Role               @default(User)
  status             String?
  // Relations
  account            Account?
  student            Student?
  teacher            Teacher?
  parent             Parent?
  sessions           Session[]
  userRole           UserRole[]
  verificationTokens VerificationToken?
  // Authentication tokens
  verificationToken  String?
  refreshToken       String?
  accessToken        String?
  expiresAt          Int?
  // Audit fields
  createdAt          DateTime           @default(now())
  updatedAt          DateTime           @updatedAt
  updatedBy          String?
  createdBy          String?
}
```

**คำอธิบาย**: ผู้ใช้งานหลักของระบบ รองรับ multi-role (Admin, User, Student, Teacher, Parent) พร้อม token management สำหรับ authentication

#### RolePermission (สิทธิ์การเข้าถึง)
```prisma
model RolePermission {
  id          String     @id @default(uuid())
  name        String     @unique
  label       String     @unique
  permissions Json       // สิทธิ์แบบ flexible JSON
  userRole    UserRole[]
  // Audit fields
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  updatedBy   String?
  createdBy   String?
}
```

**คำอธิบาย**: จัดการสิทธิ์การเข้าถึงแบบละเอียด รองรับการกำหนดสิทธิ์แบบยืดหยุ่นผ่าน JSON structure

#### Account (ข้อมูลส่วนตัว)
```prisma
model Account {
  id           String    @id @default(uuid())
  userId       String?   @unique
  avatar       String?   // avatar path
  title        String?   // คำนำหน้าชื่อ
  firstName    String?
  lastName     String?
  idCard       String?   // เลขบัตรประชาชน
  birthDate    DateTime?
  bloodType    String?
  // Family Information
  fatherName   String?
  fatherPhone  String?
  motherName   String?
  motherPhone  String?
  parentName   String?   // ผู้ปกครอง
  parentPhone  String?
  // Address Information
  addressLine1 String?
  subdistrict  String?   // ตำบล
  district     String?   // อำเภอ
  province     String?   // จังหวัด
  postcode     String?
  country      String?
  phone        String?
  // Relations & Audit
  user         User?     @relation(fields: [userId], references: [id])
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  updatedBy    String?
  createdBy    String?
}
```

**คำอธิบาย**: ข้อมูลส่วนตัวที่ครบถ้วน รองรับข้อมูลครอบครัวและที่อยู่ตามมาตรฐานไทย
  birthDate    DateTime?
  bloodType    String?
  // ข้อมูลผู้ปกครอง
  fatherName   String?
  motherName   String?
  // ที่อยู่
  addressLine1 String?
  province     String?
  // ...
}
```

**คำอธิบาย**: ข้อมูลส่วนตัวครบถ้วนตามมาตรฐานไทย

### 🎓 โครงสร้างการศึกษา

#### Level (ระดับการศึกษา)
```prisma
model Level {
  id            String           @id @default(uuid())
  levelId       String?          @unique  // "CERT", "DIPLOMA"
  levelName     String?                   // "ปวช.", "ปวส."
  levelFullName String?                   // "ประกาศนียบัตรวิชาชีพ"
  description   String?
  // Relations
  programs          Program[]
  students          Student[]
  levelClassroom    LevelClassroom[]
  classrooms        Classroom[]
  // Audit fields
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt
  updatedBy     String?
  createdBy     String?
}
```

**คำอธิบาย**: ระดับการศึกษา (ปวช./ปวส.) เป็นโครงสร้างหลักของระบบการศึกษาอาชีวศึกษา

#### Department (แผนกวิชา)
```prisma
model Department {
  id           String    @id @default(uuid())
  departmentId String?   @unique      // "TECH", "BUSINESS"
  name         String?                // "แผนกวิชาเทคโนโลยี"
  description  String?
  // Relations
  programs     Program[]
  students     Student[]
  teachers     Teacher[]
  classrooms   Classroom[]
  // Audit fields
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  updatedBy    String?
  createdBy    String?
}
```

**คำอธิบาย**: แผนกวิชาในสถาบันการศึกษา เช่น แผนกเทคโนโลยี, แผนกธุรกิจ

#### Program (สาขาวิชา)
```prisma
model Program {
  id          String      @id @default(uuid())
  programId   String?     @unique      // "CONST", "AUTO"
  name        String?                  // "ช่างก่อสร้าง", "ช่างยนต์"
  description String?
  // Relations
  level       Level?      @relation(fields: [levelId], references: [id])
  levelId     String?
  department  Department? @relation(fields: [departmentId], references: [id])
  departmentId String?
  students    Student[]
  teachers    Teacher[]
  classrooms  Classroom[]
  // Audit fields
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  updatedBy   String?
  createdBy   String?
}
```

**คำอธิบาย**: สาขาวิชาเฉพาะในแต่ละแผนก เช่น ช่างก่อสร้าง, ช่างยนต์, คอมพิวเตอร์ธุรกิจ

#### LevelClassroom (ระดับชั้นเรียน)
```prisma
model LevelClassroom {
  id          String      @id @default(uuid())
  name        String?                  // "ปวช.1/1", "ปวส.2/1"
  description String?
  // Relations
  level       Level?      @relation(fields: [levelId], references: [id])
  levelId     String?
  program     Program?    @relation(fields: [programId], references: [id])
  programId   String?
  students    Student[]
  teachers    Teacher[]
  classrooms  Classroom[]
  // Audit fields
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  updatedBy   String?
  createdBy   String?
}
```

**คำอธิบาย**: ระดับชั้นเรียนรายสาขา เช่น ปวช.1/1-ช่างก่อสร้าง, ปวส.2/1-คอมพิวเตอร์ธุรกิจ

#### Classroom (ห้องเรียน)
```prisma
model Classroom {
  id          String      @id @default(uuid())
  classroomId String?     @unique      // "CERT1-CONST-1"
  name        String?     @unique      // "ปวช.1/1-ช่างก่อสร้าง"
  description String?
  teacherIds  String[]    @default([]) // รหัสครูประจำชั้น
  // Relations
  teachers    Teacher[]
  students    Student[]
  level       Level?      @relation(fields: [levelId], references: [id])
  levelId     String?
  program     Program?    @relation(fields: [programId], references: [id])
  programId   String?
  department  Department? @relation(fields: [departmentId], references: [id])
  departmentId String?
  levelClassroom LevelClassroom? @relation(fields: [levelClassroomId], references: [id])
  levelClassroomId String?
  // Course Relations
  courses     Course[]
  schedules   Schedule[]
  // Audit fields
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  updatedBy   String?
  createdBy   String?
}
```

**คำอธิบาย**: ห้องเรียนจริงที่มีนักเรียนและครูประจำ พร้อมกำหนดตารางเรียน

### 📚 การเรียนการสอน

#### SubjectGroup (กลุ่มวิชา)
```prisma
model SubjectGroup {
  id          String   @id @default(uuid())
  groupId     String   @unique      // "GENERAL", "SPECIFIC"
  name        String                // "วิชาสามัญ", "วิชาเฉพาะ"
  description String?
  // Relations
  courses     Course[]
  // Audit fields
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  updatedBy   String?
  createdBy   String?
}
```

**คำอธิบาย**: จัดกลุ่มรายวิชาตามประเภท เช่น วิชาสามัญ, วิชาเฉพาะ, วิชาเลือก

#### Course (รายวิชา)
```prisma
model Course {
  id             String       @id @default(uuid())
  courseId       String?      @unique      // "TH101", "CONST201"
  courseName     String?                   // "ภาษาไทย", "การก่อสร้าง"
  numberOfCredit Int?                      // จำนวนหน่วยกิต
  type           String?                   // "วิชาพื้นฐาน", "วิชาเฉพาะ"
  description    String?
  // Relations
  subjectGroup   SubjectGroup? @relation(fields: [subjectGroupId], references: [id])
  subjectGroupId String?
  classroom      Classroom?    @relation(fields: [classroomId], references: [id])
  classroomId    String?
  schedules      Schedule[]
  grades         Grade[]
  // Audit fields
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
  updatedBy      String?
  createdBy      String?
}
```

**คำอธิบาย**: รายวิชาที่เปิดสอนในแต่ละภาคเรียน พร้อมจำนวนหน่วยกิต

#### Term (ภาคเรียน/ปีการศึกษา)
```prisma
model Term {
  id           String     @id @default(uuid())
  termId       String     @unique      // "2567-1", "2567-YEAR"
  name         String                  // "ภาคเรียนที่ 1/2567"
  termType     String                  // "semester", "year"
  academicYear String                  // "2567"
  startDate    DateTime
  endDate      DateTime
  isActive     Boolean    @default(false)
  description  String?
  // Relations
  schedules    Schedule[]
  grades       Grade[]
  // Audit fields
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
  updatedBy    String?
  createdBy    String?
}
```

**คำอธิบาย**: ภาคเรียนและปีการศึกษา ใช้ปีพุทธศักราชตามมาตรฐานไทย

#### Schedule (ตารางเรียน)
```prisma
model Schedule {
  id          String     @id @default(uuid())
  dayOfWeek   Int                     // 1-7 (Monday-Sunday)
  startTime   String                  // "08:30"
  endTime     String                  // "10:30"
  roomNumber  String?                 // "อาคาร A ห้อง 101"
  // Relations
  classroom   Classroom? @relation(fields: [classroomId], references: [id])
  classroomId String?
  course      Course?    @relation(fields: [courseId], references: [id])
  courseId    String?
  teacher     Teacher?   @relation(fields: [teacherId], references: [id])
  teacherId   String?
  term        Term?      @relation(fields: [termId], references: [id])
  termId      String?
  // Audit fields
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  updatedBy   String?
  createdBy   String?
}
```

**คำอธิบาย**: ตารางเรียนรายวิชา กำหนดเวลาเรียน ห้องเรียน และครูผู้สอน

### 👥 นักเรียนและครู

#### Student (นักเรียน)
```prisma
model Student {
  id               String             @id @default(uuid())
  studentId        String?            @unique   // "67001", "67002"
  isGraduation     Boolean?
  graduationYear   Int?
  graduationDate   DateTime?
  studentStatus    String?                      // "กำลังศึกษา", "จบการศึกษา"
  group            String?                      // "กลุ่ม A", "กลุ่ม B"
  status           String?            @default("normal")  // "normal", "intern"
  // Relations
  user             User?              @relation(fields: [userId], references: [id])
  userId           String?            @unique
  classroom        Classroom?         @relation(fields: [classroomId], references: [id])
  classroomId      String?
  department       Department?        @relation(fields: [departmentId], references: [id])
  departmentId     String?
  program          Program?           @relation(fields: [programId], references: [id])
  programId        String?
  level            Level?             @relation(fields: [levelId], references: [id])
  levelId          String?
  levelClassroom   LevelClassroom?    @relation(fields: [levelClassroomId], references: [id])
  levelClassroomId String?
  // Activity Relations
  attendance       Attendance[]
  grades           Grade[]
  goodnessIndividual GoodnessIndividual[]
  badnessIndividual  BadnessIndividual[]
  visitStudent     VisitStudent[]
  studentParent    StudentParent[]
  // Audit fields
  createdAt        DateTime           @default(now())
  updatedAt        DateTime           @updatedAt
  updatedBy        String?
  createdBy        String?
}
```

**คำอธิบาย**: ข้อมูลนักเรียน รองรับการจัดกลุ่ม สถานะการศึกษา และการฝึกงาน

#### Teacher (ครู)
```prisma
model Teacher {
  id               String                @id @default(uuid())
  teacherId        String?               @unique   // "T001", "T002"
  jobTitle         String?                         // "ครู", "อาจารย์"
  academicStanding String?                         // "ปริญญาตรี", "ปริญญาโท"
  classroomIds     String[]              @default([])  // รหัสห้องเรียนที่สอน
  rfId             String?                         // RFID card สำหรับเช็คชื่อ
  status           String?
  // Relations
  user             User?                 @relation(fields: [userId], references: [id])
  userId           String?               @unique
  classrooms       Classroom[]                     // ครูประจำชั้น
  program          Program?              @relation(fields: [programId], references: [id])
  programId        String?                         // สาขาวิชาที่สอน
  department       Department?           @relation(fields: [departmentId], references: [id])
  departmentId     String?
  levelClassroom   LevelClassroom?       @relation(fields: [levelClassroomId], references: [id])
  levelClassroomId String?
  // Activity Relations
  reportCheckIn         ReportCheckIn[]
  activityCheckInReport ActivityCheckInReport[]
  schedules             Schedule[]
  // Audit fields
  createdAt        DateTime              @default(now())
  updatedAt        DateTime              @updatedAt
  updatedBy        String?
  createdBy        String?
}
```

**คำอธิบาย**: ข้อมูลครูและอาจารย์ รองรับการสอนหลายห้องเรียน พร้อม RFID สำหรับระบบเช็คชื่อ

#### Parent (ผู้ปกครอง)
```prisma
model Parent {
  id            String          @id @default(uuid())
  parentId      String?         @unique   // "P001", "P002"
  relationship  String?                   // "บิดา", "มารดา", "ผู้ปกครอง"
  occupation    String?                   // อาชีพ
  // Relations
  user          User?           @relation(fields: [userId], references: [id])
  userId        String?         @unique
  studentParent StudentParent[]
  visitStudent  VisitStudent[]
  // Audit fields
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
  updatedBy     String?
  createdBy     String?
}
```

**คำอธิบาย**: ข้อมูลผู้ปกครองนักเรียน สามารถเป็นบิดา มารดา หรือผู้ปกครองอื่นๆ
