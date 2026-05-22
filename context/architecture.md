# 📚 Shikkhok Pro — সম্পূর্ণ প্রজেক্ট আর্কিটেকচার প্ল্যান
> বাংলাদেশের শিক্ষক ও ছাত্রদের জন্য AI-চালিত প্রশ্নপত্র সোশ্যাল প্ল্যাটফর্ম

---

## 1. 🧭 প্রজেক্ট ওভারভিউ

| বিষয় | বিবরণ |
|---|---|
| প্রজেক্ট নাম | Shikkhok Pro (শিক্ষক প্রো) |
| টার্গেট | বাংলাদেশের স্কুল, কলেজ, শিক্ষক ও ছাত্র |
| কারিকুলাম | NCTB — Class 1–10, SSC, HSC |
| ভাষা | Englisg |
| মূল ফিচার | AI দিয়ে প্রশ্নপত্র তৈরি + সোশ্যাল মিডিয়া ফিড |

---

## 2. 🛠️ টেক স্ট্যাক (Recommended)

### Frontend
```text
Framework     : Next.js 14+ (App Router)
Styling       : Tailwind CSS + shadcn/ui
State Mgmt    : Zustand / React Query (TanStack)
Forms         : React Hook Form + Zod
Rich Text     : TipTap Editor (প্রশ্ন এডিট করার জন্য)
Realtime      : Socket.io / Pusher (মেসেজিং)
PDF Export    : react-pdf / puppeteer
```

### Backend
```text
Runtime       : Next.js API Routes
ORM           : Prisma
Database      : PostgreSQL (Neon / Supabase)
File Storage  : Cloudinary / AWS S3 (ছবি, ফাইল)
Cache         : Redis (Upstash)
Queue         : BullMQ (PDF generation)
Search        : Meilisearch / Algolia (প্রশ্ন সার্চ)
```

### Auth
```text
Provider      : Clerk
Features      : Social Login, Username, Org Management
```

### AI
```text
Primary       : Groq
Fallback      : Gemini
Fallback      : Gemini
Use Cases     : প্রশ্ন জেনারেট, কাস্টম প্রমট, সিলেবাস ম্যাচিং
```

### DevOps
```text
Hosting       : Vercel (Frontend + API)
DB Hosting    : Neon PostgreSQL / Supabase
Monitoring    : Sentry + Vercel Analytics
CI/CD         : GitHub Actions
```

---

## 3. 👥 ইউজার রোলস (User Roles)

```text
SUPER_ADMIN      → প্ল্যাটফর্ম মালিক (Shikkhok Pro টিম)
ORG_OWNER        → অর্গানাইজেশন তৈরিকারী (Principal/প্রধান)
ORG_ADMIN        → অর্গানাইজেশন অ্যাডমিন (ORG_OWNER দেয়)
TEACHER          → শিক্ষক (প্রশ্ন বানায়)
STUDENT          → ছাত্র (পাবলিক প্রশ্ন দেখে)
GUEST            → লগইন ছাড়া পাবলিক ব্রাউজার
```

### রোল পারমিশন ম্যাট্রিক্স

| পারমিশন | SUPER | ORG\_OWNER | ORG\_ADMIN | TEACHER | STUDENT |
|---|:---:|:---:|:---:|:---:|:---:|
| প্রশ্ন জেনারেট করা | ✅ | ✅ | ✅ | ✅ | ❌ |
| Question Bank বানানো | ✅ | ✅ | ✅* | ❌ | ❌ |
| টিচার যোগ/বাদ দেওয়া | ✅ | ✅ | ✅ | ❌ | ❌ |
| Task অ্যাসাইন করা | ✅ | ✅ | ✅ | ❌ | ❌ |
| Notice পোস্ট করা | ✅ | ✅ | ✅ | ❌ | ❌ |
| Public প্রশ্ন দেখা | ✅ | ✅ | ✅ | ✅ | ✅ |
| School প্রশ্ন দেখা | ✅ | ✅ | ✅ | ✅ | ❌ |
| Private প্রশ্ন দেখা | ✅ | ✅ | ✅ | শুধু নিজেরটা | ❌ |
| Like/Comment/Share | ✅ | ✅ | ✅ | ✅ | ✅ |

\*ORG_OWNER অনুমতি দিলে

---

## 4. 🗄️ ডেটাবেস স্কিমা (Prisma Schema)

### Core Models

```prisma
// ইউজার
model User {
  id            String   @id @default(cuid())
  clerkId       String   @unique
  username      String   @unique
  displayName   String
  email         String   @unique
  avatar        String?
  bio           String?
  role          GlobalRole @default(STUDENT)
  createdAt     DateTime @default(now())

  // Relations
  orgMemberships  OrgMember[]
  questions       Question[]
  likes           Like[]
  comments        Comment[]
  sentMessages    Message[]
  receivedMessages Message[]
  tasks           Task[]
  notifications   Notification[]
}

// অর্গানাইজেশন (স্কুল/কলেজ)
model Organization {
  id          String   @id @default(cuid())
  name        String
  nameEn      String?
  slug        String   @unique
  logo        String?
  description String?
  address     String?
  type        OrgType  // SCHOOL | COLLEGE | COACHING
  createdAt   DateTime @default(now())

  // Relations
  members       OrgMember[]
  questionBanks QuestionBank[]
  notices       Notice[]
  tasks         Task[]
  invitations   Invitation[]
}

// অর্গানাইজেশন মেম্বার
model OrgMember {
  id        String    @id @default(cuid())
  userId    String
  orgId     String
  role      OrgRole   // ORG_OWNER | ORG_ADMIN | TEACHER
  subject   String[]  // কোন কোন বিষয়ের শিক্ষক
  joinedAt  DateTime  @default(now())

  user  User         @relation(fields: [userId], references: [id])
  org   Organization @relation(fields: [orgId], references: [id])

  @@unique([userId, orgId])
}

// ইনভিটেশন
model Invitation {
  id          String    @id @default(cuid())
  orgId       String
  invitedBy   String
  username    String    // ইউজারনেম দিয়ে ইনভাইট
  role        OrgRole
  status      InviteStatus @default(PENDING) // PENDING | ACCEPTED | REJECTED
  expiresAt   DateTime
  createdAt   DateTime  @default(now())

  org Organization @relation(fields: [orgId], references: [id])
}

// প্রশ্ন ব্যাংক
model QuestionBank {
  id          String   @id @default(cuid())
  orgId       String
  name        String
  nameEn      String?
  description String?
  subject     String   // বাংলা, ইংরেজি, গণিত...
  className   String   // Class-1, SSC, HSC...
  createdBy   String
  createdAt   DateTime @default(now())

  org       Organization @relation(fields: [orgId], references: [id])
  questions Question[]
}

// প্রশ্নপত্র
model Question {
  id              String         @id @default(cuid())
  bankId          String?
  createdBy       String
  orgId           String?

  // প্রশ্নের বিবরণ
  title           String
  content         Json           // প্রশ্নের structured data
  subject         String
  className       String
  chapter         String?
  topic           String?
  difficulty      Difficulty     // EASY | MEDIUM | HARD | MIXED
  questionType    QuestionType[] // MCQ | WRITTEN | SHORT | CREATIVE
  totalMarks      Int
  timeMinutes     Int?

  // ভিজিবিলিটি
  visibility      Visibility     // PUBLIC | SCHOOL | PRIVATE

  // AI মেটাডাটা
  aiGenerated     Boolean        @default(true)
  aiModel         String?
  customPrompt    String?
  syllabus        String?

  // সোশ্যাল
  likesCount      Int            @default(0)
  commentsCount   Int            @default(0)
  sharesCount     Int            @default(0)
  viewsCount      Int            @default(0)

  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  // Relations
  bank      QuestionBank? @relation(fields: [bankId], references: [id])
  creator   User         @relation(fields: [createdBy], references: [id])
  likes     Like[]
  comments  Comment[]
  shares    Share[]
  tags      QuestionTag[]
}

// লাইক
model Like {
  id         String   @id @default(cuid())
  userId     String
  questionId String
  createdAt  DateTime @default(now())

  user     User     @relation(fields: [userId], references: [id])
  question Question @relation(fields: [questionId], references: [id])

  @@unique([userId, questionId])
}

// কমেন্ট
model Comment {
  id         String    @id @default(cuid())
  userId     String
  questionId String
  content    String
  parentId   String?   // nested reply
  createdAt  DateTime  @default(now())

  user     User      @relation(fields: [userId], references: [id])
  question Question  @relation(fields: [questionId], references: [id])
  parent   Comment?  @relation("Replies", fields: [parentId], references: [id])
  replies  Comment[] @relation("Replies")
}

// মেসেজ (চ্যাট)
model Message {
  id          String      @id @default(cuid())
  senderId    String
  receiverId  String
  orgId       String?
  content     String
  isRead      Boolean     @default(false)
  createdAt   DateTime    @default(now())

  sender   User @relation("SentMessages", fields: [senderId], references: [id])
  receiver User @relation("ReceivedMessages", fields: [receiverId], references: [id])
}

// নোটিশ বোর্ড
model Notice {
  id          String   @id @default(cuid())
  orgId       String
  title       String
  content     String
  postedBy    String
  isImportant Boolean  @default(false)
  createdAt   DateTime @default(now())

  org Organization @relation(fields: [orgId], references: [id])
}

// টাস্ক ম্যানেজার
model Task {
  id            String     @id @default(cuid())
  orgId         String
  assignedTo    String
  assignedBy    String
  title         String
  description   String?
  subject       String
  className     String
  dueDate       DateTime?
  status        TaskStatus // PENDING | IN_PROGRESS | SUBMITTED | APPROVED | REJECTED
  submittedQuestionId String?  // সাবমিট করা প্রশ্নের ID
  feedback      String?
  createdAt     DateTime   @default(now())

  org  Organization @relation(fields: [orgId], references: [id])
  user User         @relation(fields: [assignedTo], references: [id])
}

// Enums
enum GlobalRole   { SUPER_ADMIN USER }
enum OrgRole      { ORG_OWNER ORG_ADMIN TEACHER }
enum OrgType      { SCHOOL COLLEGE COACHING MADRASA OTHER }
enum Visibility   { PUBLIC SCHOOL PRIVATE }
enum Difficulty   { EASY MEDIUM HARD MIXED }
enum TaskStatus   { PENDING IN_PROGRESS SUBMITTED APPROVED REJECTED }
enum InviteStatus { PENDING ACCEPTED REJECTED EXPIRED }
enum QuestionType { MCQ SHORT_ANSWER WRITTEN CREATIVE FILL_BLANK TRUE_FALSE }
```

---

## 5. 📁 ফোল্ডার স্ট্রাকচার (Next.js App Router)

```text
Shikkhok Pro/
├── app/
│   ├── (auth)/                    # Clerk auth pages
│   │   ├── sign-in/
│   │   └── sign-up/
│   │
│   ├── (main)/                    # Main app (logged in)
│   │   ├── layout.tsx             # Main layout with sidebar
│   │   ├── feed/                  # সোশ্যাল ফিড (হোম)
│   │   ├── explore/               # পাবলিক প্রশ্ন ব্রাউজ
│   │   ├── profile/[username]/    # ইউজার প্রোফাইল
│   │   ├── question/[id]/         # একটি প্রশ্নের পেজ
│   │   └── messages/              # মেসেজিং
│   │
│   ├── (org)/                     # অর্গানাইজেশন
│   │   ├── org/
│   │   │   ├── create/            # অর্গ তৈরি
│   │   │   └── [slug]/
│   │   │       ├── dashboard/     # প্রিন্সিপাল ড্যাশবোর্ড
│   │   │       ├── teachers/      # টিচার ম্যানেজমেন্ট
│   │   │       ├── banks/         # প্রশ্ন ব্যাংক লিস্ট
│   │   │       │   ├── create/
│   │   │       │   └── [bankId]/
│   │   │       │       └── generate/ # AI প্রশ্ন জেনারেট
│   │   │       ├── tasks/         # টাস্ক ম্যানেজার
│   │   │       ├── notices/       # নোটিশ বোর্ড
│   │   │       └── settings/      # অর্গ সেটিংস
│   │
│   ├── api/
│   │   ├── auth/                  # Clerk webhooks
│   │   ├── questions/             # প্রশ্ন CRUD
│   │   ├── ai/generate/           # AI প্রশ্ন জেনারেশন
│   │   ├── ai/pdf/                # PDF এক্সপোর্ট
│   │   ├── organizations/         # অর্গ CRUD
│   │   ├── banks/                 # প্রশ্ন ব্যাংক CRUD
│   │   ├── social/                # Like/Comment/Share
│   │   ├── messages/              # চ্যাট
│   │   ├── tasks/                 # টাস্ক
│   │   └── notices/               # নোটিশ
│   │
│   └── (public)/                  # লগইন ছাড়া দেখা যাবে
│       ├── page.tsx               # ল্যান্ডিং পেজ
│       └── q/[id]/                # পাবলিক প্রশ্ন শেয়ার লিঙ্ক
│
├── components/
│   ├── ui/                        # shadcn base components
│   ├── question/
│   │   ├── QuestionCard.tsx       # ফিডে প্রশ্নের কার্ড
│   │   ├── QuestionDetail.tsx     # পুরো প্রশ্ন দেখা
│   │   ├── QuestionGenerator.tsx  # AI জেনারেটর UI
│   │   ├── QuestionPaper.tsx      # প্রশ্নপত্রের প্রিন্ট ভিউ
│   │   └── QuestionActions.tsx    # Like/Share/Comment বার
│   ├── org/
│   │   ├── OrgCard.tsx
│   │   ├── MemberList.tsx
│   │   └── InviteModal.tsx
│   ├── feed/
│   │   ├── FeedLayout.tsx
│   │   └── FeedFilters.tsx
│   ├── messaging/
│   │   ├── ChatWindow.tsx
│   │   └── MessageList.tsx
│   └── shared/
│       ├── Navbar.tsx
│       ├── Sidebar.tsx
│       └── NotificationBell.tsx
│
├── lib/
│   ├── prisma.ts                  # Prisma client
│   ├── clerk.ts                   # Clerk helpers
│   ├── ai.ts                      # AI prompt builder
│   ├── pdf.ts                     # PDF generator
│   └── validations/               # Zod schemas
│
└── hooks/
    ├── useQuestion.ts
    ├── useOrganization.ts
    └── useRealtime.ts
```

---

## 6. 🤖 AI প্রশ্ন জেনারেশন সিস্টেম

### ইনপুট প্যারামিটার
```typescript
interface QuestionGenerationInput {
  // বাধ্যতামূলক
  subject: Subject;          // বাংলা | ইংরেজি | গণিত | বিজ্ঞান...
  className: ClassName;      // Class-1 থেকে HSC

  // প্রশ্নের ধরন
  questionTypes: {
    mcq?: number;            // MCQ প্রশ্ন সংখ্যা
    written?: number;        // রচনামূলক
    shortAnswer?: number;    // সংক্ষিপ্ত
    creative?: number;       // সৃজনশীল (SSC/HSC)
    fillBlank?: number;      // শূন্যস্থান পূরণ
    trueFalse?: number;      // সত্য/মিথ্যা
  };

  // কাস্টমাইজেশন
  difficulty: Difficulty;    // EASY | MEDIUM | HARD | MIXED
  totalMarks: number;
  timeMinutes: number;
  chapters?: string[];       // নির্দিষ্ট অধ্যায়
  topics?: string[];         // নির্দিষ্ট টপিক
  syllabus?: string;         // কাস্টম সিলেবাস

  // অতিরিক্ত
  customPrompt?: string;     // টিচারের কাস্টম নির্দেশনা
  language: 'bn' | 'en' | 'both';
  includeAnswers: boolean;   // উত্তর সহ কিনা
  examName?: string;         // পরীক্ষার নাম
  instituteName?: string;    // প্রতিষ্ঠানের নাম
  date?: Date;
}
```

### AI প্রমট স্ট্র্যাটেজি
```text
System Prompt:
  - NCTB কারিকুলাম এক্সপার্ট হিসেবে রোল
  - বাংলাদেশের শিক্ষা বোর্ডের নিয়ম মেনে চলা
  - বাংলায় প্রশ্ন লেখা (বিষয় অনুযায়ী)
  - JSON ফরম্যাটে আউটপুট

Output Format (JSON):
  {
    examTitle: string,
    questions: [
      {
        type: "MCQ" | "WRITTEN" | ...,
        questionText: string,
        options?: string[],      // MCQ এর জন্য
        answer?: string,         // যদি include করা হয়
        marks: number,
        difficulty: string,
        hint?: string
      }
    ],
    instructions: string,
    totalMarks: number
  }
```

### প্রশ্নপত্র প্রিভিউ ও এক্সপোর্ট
```text
Preview  → React component (ব্রাউজারে দেখা)
PDF      → Puppeteer / react-pdf (ডাউনলোড)
Image    → html2canvas (PNG সেভ)
Print    → CSS @media print (সরাসরি প্রিন্ট)
```

---

## 7. 🔒 ভিজিবিলিটি ও অ্যাক্সেস কন্ট্রোল

```text
প্রশ্ন PUBLIC হলে:
  → যে কেউ দেখতে পারবে (লগইন ছাড়াও)
  → ফিডে দেখাবে
  → শেয়ার লিঙ্ক কাজ করবে

প্রশ্ন SCHOOL হলে:
  → একই অর্গের সব মেম্বার দেখতে পারবে
  → বাইরের কেউ দেখতে পারবে না
  → শেয়ার লিঙ্কে 403 দেখাবে

প্রশ্ন PRIVATE হলে:
  → শুধু creator নিজে দেখতে পারবে
  → ORG_OWNER ও ORG_ADMIN দেখতে পারবে
  → অন্য কেউ দেখতে পারবে না

Default (নতুন তৈরি হলে):
  → PRIVATE (টিচার পরে বদলাতে পারবে)
```

---

## 8. 📱 পেজ ও ফিচার ব্রেকডাউন

### 🏠 পাবলিক ল্যান্ডিং পেজ
- প্ল্যাটফর্মের পরিচয়
- পাবলিক প্রশ্নের স্যাম্পল
- লগইন / রেজিস্ট্রেশন CTA

### 📰 ফিড (হোম)
- পাবলিক প্রশ্নের ইনফিনিট স্ক্রোল ফিড
- ফিল্টার: বিষয়, ক্লাস, কঠিনতা
- লাইক, কমেন্ট, শেয়ার
- ফলো করা অ্যাকাউন্টের প্রশ্ন আগে দেখাবে

### 🔍 এক্সপ্লোর
- সার্চ প্রশ্ন
- ট্যাগ, বিষয়, ক্লাস দিয়ে ফিল্টার
- ট্রেন্ডিং প্রশ্নপত্র

### 🏫 অর্গানাইজেশন ড্যাশবোর্ড (Principal View)
```text
├── Overview       → সংক্ষিপ্ত পরিসংখ্যান
├── Teachers       → টিচার যোগ/বাদ/রোল পরিবর্তন
├── Question Banks → তৈরি করা ব্যাংক
├── Questions      → সব প্রশ্নের লিস্ট
├── Tasks          → টাস্ক দেওয়া ও ট্র্যাক করা
├── Notices        → নোটিশ পোস্ট করা
└── Settings       → অর্গ সেটিংস
```

### 👩‍🏫 টিচার ড্যাশবোর্ড
```text
├── My Questions   → আমার তৈরি প্রশ্ন
├── Generate       → নতুন প্রশ্ন বানানো
├── My Tasks       → অ্যাসাইন করা টাস্ক
├── Notice Board   → নোটিশ দেখা
└── Messages       → চ্যাট
```

### ✍️ প্রশ্ন জেনারেটর (Step-by-step)
```text
Step 1: বিষয় ও ক্লাস নির্বাচন
Step 2: প্রশ্নের ধরন ও সংখ্যা
Step 3: অধ্যায়/টপিক/সিলেবাস
Step 4: কঠিনতা ও নম্বর বন্টন
Step 5: কাস্টম প্রমট (অপশনাল)
Step 6: AI জেনারেশন → প্রিভিউ
Step 7: এডিট → প্রকাশনা (Public/School/Private)
Step 8: ডাউনলোড (PDF/Image)
```

### 💬 মেসেজিং (In-org)
- একই অর্গের মেম্বারদের মধ্যে চ্যাট
- Real-time messaging (Pusher/Socket.io)
- ফাইল/ছবি শেয়ার
- অনলাইন স্ট্যাটাস

### 📋 টাস্ক ম্যানেজার
```text
Principal করে:
  → টিচারকে টাস্ক দেয় (বিষয়, ক্লাস, ডেডলাইন)
  → টাস্কের স্ট্যাটাস দেখে

Teacher করে:
  → টাস্ক দেখে
  → প্রশ্ন বানিয়ে সাবমিট করে
  → ফিডব্যাক দেখে

Status Flow:
  PENDING → IN_PROGRESS → SUBMITTED → APPROVED/REJECTED
```

### 📢 নোটিশ বোর্ড
- তারিখ ও বিবরণ সহ নোটিশ
- গুরুত্বপূর্ণ নোটিশ পিন করা
- নোটিশে নোটিফিকেশন

---

## 9. 🎨 UI/UX গাইডলাইন

### ডিজাইন থিম
```text
Primary Color  : #1E40AF (Deep Blue — শিক্ষার রং)
Secondary      : #059669 (Green — বাংলাদেশের সবুজ)
Accent         : #F59E0B (Amber)
Background     : #F8FAFC (Light) / #0F172A (Dark)
Font           : Plus Jakarta Sans
```

### রেসপনসিভ
- Mobile First (বাংলাদেশে মোবাইল ব্যবহার বেশি)
- PWA সাপোর্ট (ইন্টারনেট স্লো হলেও কাজ করবে)

---

## 10. 🚀 ডেভেলপমেন্ট ফেজ

### Phase 1 — Foundation (সপ্তাহ ১-২)
- [x] Next.js প্রজেক্ট সেটআপ
- [x] Clerk Auth ইন্টিগ্রেশন
- [x] Prisma + PostgreSQL সেটআপ
- [x] User Profile পেজ
- [x] অর্গানাইজেশন তৈরি ও যোগদান
- [x] ইনভিটেশন সিস্টেম

### Phase 2 — Core AI Feature (সপ্তাহ ৩-৪)
- [x] Question Bank CRUD
- [x] AI প্রশ্ন জেনারেটর (Step-by-step UI)
- [x] বাংলাদেশ কারিকুলাম ডেটা
- [x] প্রশ্ন এডিটর
- [x] PDF + Image এক্সপোর্ট
- [x] ভিজিবিলিটি কন্ট্রোল

### Phase 3 — Social Features (সপ্তাহ ৫-৬)
- [x] পাবলিক ফিড
- [x] Like / Comment / Share
- [x] এক্সপ্লোর পেজ
- [x] সার্চ সিস্টেম
- [x] নোটিফিকেশন

### Phase 4 — Organization Tools (সপ্তাহ ৭-৮)
- [x] Principal ড্যাশবোর্ড
- [x] Teacher ড্যাশবোর্ড
- [x] টাস্ক ম্যানেজার
- [x] নোটিশ বোর্ড
- [x] Messaging সিস্টেম

### Phase 5 — Polish & Launch (সপ্তাহ ৯-১০)
- [x] PWA সেটআপ
- [x] পারফরম্যান্স অপটিমাইজেশন
- [x] SEO
- [x] Beta Testing

---

## 11. 📊 বাংলাদেশ কারিকুলাম ডেটা

### ক্লাস অনুযায়ী বিষয়সমূহ

```text
Class 1-5:
  বাংলা, English, গণিত, পরিবেশ পরিচিতি, ধর্ম

Class 6-8:
  বাংলা, English, গণিত, বিজ্ঞান, সামাজিক বিজ্ঞান,
  ধর্ম, তথ্য ও যোগাযোগ প্রযুক্তি

Class 9-10 / SSC:
  বাংলা ১ম, বাংলা ২য়, English 1st, English 2nd,
  গণিত, পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান,
  উচ্চতর গণিত (Optional), তথ্য ও যোগাযোগ প্রযুক্তি,
  ইতিহাস ও বিশ্বসভ্যতা, ভূগোল, অর্থনীতি, ধর্ম

HSC:
  বিজ্ঞান বিভাগ: পদার্থ, রসায়ন, জীববিজ্ঞান, উচ্চতর গণিত
  মানবিক: সমাজবিজ্ঞান, ইতিহাস, পৌরনীতি, ভূগোল
  ব্যবসায়: হিসাববিজ্ঞান, ব্যবসায় সংগঠন, ফিন্যান্স
  সাধারণ: বাংলা, English, ICT, ধর্ম
```

---

## 12. ⚡ API এন্ডপয়েন্ট রেফারেন্স

```text
// প্রশ্ন
POST   /api/ai/generate          → AI দিয়ে প্রশ্ন বানানো
GET    /api/questions            → প্রশ্নের লিস্ট (ফিল্টার সহ)
GET    /api/questions/:id        → একটি প্রশ্নের বিবরণ
PATCH  /api/questions/:id        → প্রশ্ন আপডেট (ভিজিবিলিটি সহ)
DELETE /api/questions/:id        → প্রশ্ন মুছে ফেলা
POST   /api/questions/:id/export → PDF/Image এক্সপোর্ট

// সোশ্যাল
POST   /api/questions/:id/like   → লাইক/আনলাইক
POST   /api/questions/:id/comment → কমেন্ট
GET    /api/questions/:id/comments → কমেন্ট লিস্ট
POST   /api/questions/:id/share  → শেয়ার

// অর্গানাইজেশন
POST   /api/organizations        → অর্গ তৈরি
GET    /api/organizations/:slug  → অর্গ ডিটেইল
POST   /api/organizations/:slug/invite → ইনভাইট
PATCH  /api/organizations/:slug/members/:id → রোল পরিবর্তন
DELETE /api/organizations/:slug/members/:id → মেম্বার বাদ

// প্রশ্ন ব্যাংক
POST   /api/banks                → ব্যাংক তৈরি
GET    /api/banks/:id            → ব্যাংক বিবরণ

// টাস্ক
POST   /api/tasks                → টাস্ক তৈরি
GET    /api/tasks                → টাস্ক লিস্ট
PATCH  /api/tasks/:id/submit     → টাস্ক সাবমিট (প্রশ্নসহ)
PATCH  /api/tasks/:id/review     → টাস্ক রিভিউ (approve/reject)

// মেসেজ
GET    /api/messages/:userId     → চ্যাট হিস্টোরি
POST   /api/messages             → নতুন মেসেজ

// নোটিশ
POST   /api/notices              → নোটিশ তৈরি
GET    /api/notices/:orgId       → অর্গের নোটিশ লিস্ট
```

---

> **পরবর্তী পদক্ষেপ:** টেকনিক্যাল ডিটেইলস কনফার্ম করো, তারপর Phase 1 থেকে কোডিং শুরু করব।
