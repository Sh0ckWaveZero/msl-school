# Database Documentation - MSL School API

## 📋 ภาพรวมของระบบ

ระบบจัดการโรงเรียนสำหรับประเทศไทย รองรับการทำงานของสถาบันการศึกษาระดับอาชีวศึกษา (ปวช./ปวส.) ครอบคลุมการจัดการผู้ใช้งาน โครงสร้างการศึกษา การเรียนการสอน การเช็คชื่อ การประเมินพฤติกรรม และการเยี่ยมบ้านนักเรียน

## 🏗️ โครงสร้างฐานข้อมูล

### 👥 การจัดการผู้ใช้งานและสิทธิ์

#### User (ผู้ใช้งาน)
```prisma
model User {
  id                 String   @id @default(uuid())
  username           String   @unique
  password           String
  email              String?
  role               Role     @default(User)
  // Relations
  account            Account?
  student            Student?
  teacher            Teacher?
  parent             Parent?
  sessions           Session[]
  userRole           UserRole[]
}
```

**คำอธิบาย**: ผู้ใช้งานหลักของระบบ รองรับ multi-role (Admin, User, Student, Teacher, Parent)

#### RolePermission (สิทธิ์การเข้าถึง)
```prisma
model RolePermission {
  id          String     @id @default(uuid())
  name        String     @unique
  label       String     @unique
  permissions Json       // สิทธิ์แบบ flexible JSON
  userRole    UserRole[]
}
```

**คำอธิบาย**: จัดการสิทธิ์การเข้าถึงแบบละเอียด รองรับการกำหนดสิทธิ์แบบยืดหยุ่น

#### Account (ข้อมูลส่วนตัว)
```prisma
model Account {
  id           String    @id @default(uuid())
  userId       String?   @unique
  firstName    String?
  lastName     String?
  idCard       String?
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
  levelId        String?  @unique  // "CERT", "DIPLOMA"
  levelName      String?           // "ปวช.", "ปวส."
  levelFullName  String?           // "ประกาศนียบัตรวิชาชีพ"
}
```

#### Department (แผนกวิชา)
```prisma
model Department {
  departmentId String?  // "TECH", "BUSINESS"
  name         String?  // "แผนกวิชาเทคโนโลยี"
}
```

#### Program (สาขาวิชา)
```prisma
model Program {
  programId   String   @unique  // "CONST", "AUTO"
  name        String?           // "ช่างก่อสร้าง", "ช่างยนต์"
  level       Level?
  department  Department?
}
```

#### LevelClassroom (ระดับชั้นเรียน)
```prisma
model LevelClassroom {
  name        String?  // "ปวช.1/1", "ปวส.2/1"
  level       Level?
  program     Program?
  classrooms  Classroom[]
}
```

#### Classroom (ห้องเรียน)
```prisma
model Classroom {
  classroomId String?  @unique  // "CERT1-CONST-1"
  name        String?  @unique  // "ปวช.1/1-ช่างก่อสร้าง"
  teachers    Teacher[]
  students    Student[]
  courses     Course[]
  // Relations
  level       Level?
  program     Program?
  department  Department?
}
```

### 📚 การเรียนการสอน

#### SubjectGroup (กลุ่มวิชา)
```prisma
model SubjectGroup {
  groupId     String   @unique  // "GENERAL", "SPECIFIC"
  name        String            // "วิชาสามัญ", "วิชาเฉพาะ"
  courses     Course[]
}
```

#### Course (รายวิชา)
```prisma
model Course {
  courseId       String?  @unique  // "TH101", "CONST201"
  courseName     String?           // "ภาษาไทย", "การก่อสร้าง"
  numberOfCredit Int?              // จำนวนหน่วยกิต
  type           String?           // "วิชาพื้นฐาน", "วิชาเฉพาะ"
  subjectGroup   SubjectGroup?
  schedule       Schedule[]
  grade          Grade[]
}
```

#### Term (ภาคเรียน/ปีการศึกษา)
```prisma
model Term {
  termId       String   @unique  // "2567-1", "2567-YEAR"
  name         String            // "ภาคเรียนที่ 1/2567"
  termType     String            // "semester", "year"
  academicYear String            // "2567"
  startDate    DateTime
  endDate      DateTime
  isActive     Boolean  @default(false)
}
```

#### Schedule (ตารางเรียน)
```prisma
model Schedule {
  classroom   Classroom
  course      Course
  teacher     Teacher
  term        Term
  dayOfWeek   Int      // 1-7 (Monday-Sunday)
  startTime   String   // "08:30"
  endTime     String   // "10:30"
  roomNumber  String?
}
```

### 👥 นักเรียนและครู

#### Student (นักเรียน)
```prisma
model Student {
  studentId        String?  @unique  // "67001", "67002"
  isGraduation     Boolean?
  graduationYear   Int?
  studentStatus    String?           // "กำลังศึกษา", "จบการศึกษา"
  group            String?           // "กลุ่ม A", "กลุ่ม B"
  status           String?  @default("normal")  // "normal", "intern"
  // Relations
  user             User?
  classroom        Classroom?
  department       Department?
  program          Program?
  level            Level?
  attendance       Attendance[]
  grade            Grade[]
  studentParent    StudentParent[]
}
```

#### Teacher (ครู)
```prisma
model Teacher {
  teacherId        String?  @unique  // "T001", "T002"
  jobTitle         String?           // "ครู", "อาจารย์"
  academicStanding String?           // "ปริญญาตรี", "ปริญญาโท"
  rfId             String?           // RFID Card ID
  // Relations
  user             User?
  classrooms       Classroom[]
  department       Department?
  program          Program?
  schedule         Schedule[]
}
```

#### Parent (ผู้ปกครอง)
```prisma
model Parent {
  parentId     String?  @unique
  relationship String            // "father", "mother", "guardian"
  occupation   String?
  workPlace    String?
  income       String?
  education    String?
  // Relations
  user         User?
  students     StudentParent[]
}
```

### 📊 การประเมินและติดตาม

#### Attendance (การเข้าเรียน)
```prisma
model Attendance {
  student    Student
  schedule   Schedule
  term       Term
  date       DateTime
  status     String    // "present", "absent", "late", "excused"
  note       String?
}
```

#### Grade (ผลการเรียน)
```prisma
model Grade {
  student     Student
  course      Course
  term        Term
  gradeType   String   // "midterm", "final", "assignment"
  score       Float?
  maxScore    Float?
  letterGrade String?  // "A", "B+", "B"
  gpa         Float?
}
```

### ✅ การเช็คชื่อและกิจกรรม

#### ReportCheckIn (เช็คชื่อหน้าเสาธง)
```prisma
model ReportCheckIn {
  teacherId    String
  classroomId  String
  present      String[]  // รหัสนักเรียนที่มา
  absent       String[]  // รหัสนักเรียนที่ขาด
  late         String[]  // รหัสนักเรียนที่สาย
  leave        String[]  // รหัสนักเรียนที่ลา
  internship   String[]  // รหัสนักเรียนที่ฝึกงาน
  checkInDate  DateTime?
  checkInTime  DateTime?
  status       String?   // "0" = ยังไม่ได้เช็ค, "1" = เช็คแล้ว
}
```

#### ActivityCheckInReport (เช็คชื่อกิจกรรม)
```prisma
model ActivityCheckInReport {
  teacherId    String
  classroomId  String
  present      String[]  // รหัสนักเรียนที่เข้าร่วม
  absent       String[]  // รหัสนักเรียนที่ไม่เข้าร่วม
  checkInDate  DateTime?
  checkInTime  DateTime?
  status       String?
}
```

### 🎯 การประเมินพฤติกรรม

#### GoodnessIndividual (ความดี)
```prisma
model GoodnessIndividual {
  studentKey     String    // รหัสนักเรียน
  student        Student?
  classroom      Classroom?
  goodnessScore  Int?      // คะแนนความดี
  goodnessDetail String?   // รายละเอียด
  image          String?   // รูปภาพประกอบ
  goodDate       DateTime? // วันที่ทำความดี
}
```

#### BadnessIndividual (พฤติกรรมไม่เหมาะสม)
```prisma
model BadnessIndividual {
  studentKey    String    // รหัสนักเรียน
  student       Student?
  classroom     Classroom?
  badnessScore  Int?      // คะแนนหัก
  badnessDetail String?   // รายละเอียด
  image         String?   // รูปภาพประกอบ
  badDate       DateTime? // วันที่เกิดเหตุ
}
```

### 🏠 การเยี่ยมบ้าน

#### VisitStudent (การเยี่ยมบ้าน)
```prisma
model VisitStudent {
  studentKey   String    // รหัสนักเรียน
  student      Student?
  classroom    Classroom?
  visitDate    DateTime? // วันที่เยี่ยม
  visitDetail  Json?     // รายละเอียดแบบ JSON
  visitMap     String?   // แผนที่
  images       String[]  // รูปภาพหลายใบ
  visitNo      Int?      // ครั้งที่
  academicYear String?   // ปีการศึกษา
}
```

### 📰 ข้อมูลทั่วไป

#### News (ข่าวสาร/ประกาศ)
```prisma
model News {
  title       String
  content     String
  excerpt     String?
  images      String[]  @default([])
  publishDate DateTime
  expireDate  DateTime?
  priority    String    @default("normal")  // "low", "normal", "high", "urgent"
  targetRole  String[]  @default([])        // ["student", "teacher", "parent"]
  isPublished Boolean   @default(false)
  views       Int       @default(0)
}
```

#### Holiday (วันหยุด/กิจกรรม)
```prisma
model Holiday {
  name        String
  description String?
  startDate   DateTime
  endDate     DateTime
  type        String    // "holiday", "event", "exam"
  isRecurring Boolean   @default(false)
}
```

### 📝 Audit Trail

#### AuditLog (บันทึกการเปลี่ยนแปลง)
```prisma
model AuditLog {
  action    String?  // "CREATE", "UPDATE", "DELETE"
  model     String?  // ชื่อ Model
  recordId  String?  // รหัสข้อมูล
  fieldName String?  // ชื่อฟิลด์ที่เปลี่ยน
  oldValue  String?  // ค่าเก่า
  newValue  String?  // ค่าใหม่
  detail    String?  // รายละเอียดเพิ่มเติม
  ipAddr    String?  // IP Address
  browser   String?  // เบราว์เซอร์
  device    String?  // อุปกรณ์
  createdBy String?  // ผู้ทำรายการ
}
```

## 🔗 ความสัมพันธ์หลักของระบบ

### User → Student/Teacher/Parent
- ผู้ใช้หนึ่งคนสามารถมีบทบาทเป็น Student, Teacher, หรือ Parent
- ใช้ `userId` เป็น Foreign Key เชื่อมโยง

### Level → Department → Program → Classroom
- โครงสร้างการศึกษาแบบ Hierarchy
- Level (ปวช./ปวส.) → Department (แผนก) → Program (สาขา) → Classroom (ห้อง)

### Schedule → Course + Teacher + Classroom + Term
- ตารางเรียนเชื่อมโยงรายวิชา ครูผู้สอน ห้องเรียน และภาคเรียน
- รองรับการจัดตารางเรียนแบบละเอียด

### Student ←→ Parent (Many-to-Many)
- นักเรียนหนึ่งคนสามารถมีผู้ปกครองหลายคน
- ผู้ปกครองหนึ่งคนสามารถดูแลนักเรียนหลายคน
- ใช้ `StudentParent` เป็น Junction Table

## 📋 Use Cases หลัก

### 1. การเช็คชื่อหน้าเสาธง
```sql
-- ครูเช็คชื่อหน้าเสาธง
INSERT INTO report_check_ins (
  teacherId, classroomId, present, absent, late, 
  checkInDate, checkInTime, status
) VALUES (
  'teacher-uuid', 'classroom-uuid', 
  ['student1', 'student2'], ['student3'], ['student4'],
  '2024-01-15', '08:00', '1'
);
```

### 2. การบันทึกผลการเรียน
```sql
-- บันทึกคะแนนสอบกลางภาค
INSERT INTO grade (
  studentId, courseId, termId, gradeType, 
  score, maxScore, letterGrade
) VALUES (
  'student-uuid', 'course-uuid', 'term-uuid', 'midterm',
  85.5, 100, 'A'
);
```

### 3. การจัดตารางเรียน
```sql
-- สร้างตารางเรียนรายวิชา
INSERT INTO schedule (
  classroomId, courseId, teacherId, termId,
  dayOfWeek, startTime, endTime, roomNumber
) VALUES (
  'classroom-uuid', 'course-uuid', 'teacher-uuid', 'term-uuid',
  1, '08:30', '10:30', 'A101'
);
```

### 4. การเยี่ยมบ้านนักเรียน
```sql
-- บันทึกการเยี่ยมบ้าน
INSERT INTO visit_students (
  studentKey, classroomId, visitDate, visitDetail,
  visitNo, academicYear, images
) VALUES (
  'student-uuid', 'classroom-uuid', '2024-01-20',
  '{"purpose": "ติดตามการเรียน", "parents": ["พ่อ", "แม่"]}',
  1, '2567', ['image1.jpg', 'image2.jpg']
);
```

## 🔐 ความปลอดภัย

### Authentication & Authorization
- ใช้ `Session` table สำหรับ session management
- `RolePermission` + `UserRole` สำหรับ fine-grained permissions
- `VerificationToken` สำหรับการยืนยันตัวตน

### Data Integrity
- ใช้ UUID เป็น Primary Key ทุก table
- Foreign Key Constraints
- Unique Constraints สำหรับ business keys
- Soft Delete ผ่าน `status` field

### Audit Trail
- `AuditLog` บันทึกการเปลี่ยนแปลงทุกครั้ง
- เก็บ IP, Browser, Device information
- Track `createdBy`, `updatedBy` ใน metadata

## 🚀 Performance Considerations

### Indexing Strategy
```sql
-- ตัวอย่าง Indexes ที่สำคัญ
CREATE INDEX idx_student_classroom ON student(classroomId);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_schedule_day_time ON schedule(dayOfWeek, startTime);
CREATE INDEX idx_user_username ON user(username);
```

### Query Optimization
- ใช้ `include` และ `select` ใน Prisma อย่างระมัดระวัง
- Pagination สำหรับ list queries
- Connection pooling สำหรับ production

## 📈 การขยายระบบ

### Horizontal Scaling
- แยก database ตาม domain (Users, Academic, Reports)
- Read replicas สำหรับ reporting queries
- Cache layer สำหรับ frequently accessed data

### Feature Extensions
- Integration กับระบบอื่น (LMS, Payment, etc.)
- Mobile app support
- Real-time notifications
- Analytics และ reporting dashboard

---

*เอกสารนี้อัปเดตล่าสุด: 29 พฤษภาคม 2025*
