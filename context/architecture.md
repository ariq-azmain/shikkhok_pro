# 📚 Shikkhok Pro — সম্পূর্ণ প্রজেক্ট আর্কিটেকচার প্ল্যান

> বাংলাদেশের শিক্ষক ও ছাত্রদের জন্য AI-চালিত প্রশ্নপত্র সোশ্যাল প্ল্যাটফর্ম

---

## 1. 🧭 প্রজেক্ট ওভারভিউ

| বিষয়        | বিবরণ                                                                      |
| ------------ | -------------------------------------------------------------------------- |
| প্রজেক্ট নাম | Shikkhok Pro (শিক্ষক প্রো)                                                 |
| টার্গেট      | বাংলাদেশের স্কুল, কলেজ, শিক্ষক, ছাত্র ও অভিভাবক                            |
| কারিকুলাম    | NCTB — Class 1–10, SSC, HSC                                                |
| ভাষা         | English (UI), Bangla (Content)                                             |
| মূল ফিচার    | AI দিয়ে প্রশ্নপত্র তৈরি + সোশ্যাল মিডিয়া ফিড + Organization ম্যানেজমেন্ট |

---

## 2. 🛠️ টেক স্ট্যাক (Recommended)

### Frontend

```text
Framework     : Next.js 14+ (App Router)
Styling       : Tailwind CSS
State Mgmt    : Zustand / React Query (TanStack)
Forms         : React Hook Form + Zod
Rich Text     : TipTap Editor (Question Editor এর জন্য)
Realtime Chat : StreamChat (pre-built messaging solution)
PDF Export    : react-pdf / puppeteer
```

### Backend

```text
Runtime       : Next.js API Routes
Database      : PostgreSQL (Supabase)
File Storage  : Cloudinary / AWS S3 (ছবি, সিলেবাস, বই আপলোড)
Cache         : Redis (Upstash)
Queue         : BullMQ (PDF generation, AI queue)
Search        : Meilisearch / Algolia (প্রশ্ন সার্চ)
Notifications : Web Push / FCM (task notification)
```

### Auth

```text
Provider      : Clerk
Login Methods : Google, GitHub, Facebook, email (Social Login)
Account Types : TEACHER | STUDENT | PARENT (signup এ select করবে)
```

### AI

```text
Primary       : Groq
Fallback      : Gemini
Use Cases     : প্রশ্ন জেনারেট, কাস্টম প্রমট, সিলেবাস ম্যাচিং, inline suggestions
Book Sources  : Bangladesh NCTB Board Books (Class 1–10, SSC, HSC)
Upload Support: PDF, DOCX/DOC, PNG/JPG/JPEG এবং অন্যান্য relevant formats
```

### Messaging

```text
Provider      : StreamChat (pre-built solution — scratch থেকে নয়)
Features      : 1-on-1 DM, Group Chat (org-level), file/image/question share
```

### DevOps

```text
Hosting       : Vercel (Frontend + API)
DB Hosting    : PostgreSQL / Supabase
Monitoring    : Sentry + Vercel Analytics
CI/CD         : GitHub Actions
```

---

## 3. 👥 ইউজার রোলস (User Roles)

```text
── Global Roles ──
SUPER_ADMIN      → প্ল্যাটফর্ম মালিক (Shikkhok Pro টিম)
TEACHER          → শিক্ষক (প্রশ্ন বানায়, org তৈরি করতে পারে)
STUDENT          → ছাত্র (পাবলিক প্রশ্ন দেখে ও engage করে)
PARENT           → অভিভাবক (পাবলিক প্রশ্ন দেখে ও engage করে)

── Organization Roles (একজন TEACHER এর org এর মধ্যে) ──
ORG_PRINCIPAL    → Organization তৈরিকারী — সর্বোচ্চ ক্ষমতা
ORG_ADMIN        → Principal কর্তৃক নিযুক্ত — পরিচালনার ক্ষমতা
ORG_TEACHER      → Organization এর সদস্য শিক্ষক
```

### রোল পারমিশন ম্যাট্রিক্স

| পারমিশন                | SUPER | ORG_PRINCIPAL | ORG_ADMIN |   TEACHER    | STUDENT |
| ---------------------- | :---: | :-----------: | :-------: | :----------: | :-----: |
| প্রশ্ন জেনারেট করা     |  ✅   |      ✅       |    ✅     |      ✅      |   ❌    |
| Question Bank বানানো   |  ✅   |      ✅       |   ✅\*    |      ❌      |   ❌    |
| Teacher যোগ/বাদ দেওয়া |  ✅   |      ✅       |    ✅     |      ❌      |   ❌    |
| Task অ্যাসাইন করা      |  ✅   |      ✅       |    ✅     |      ❌      |   ❌    |
| Notice পোস্ট করা       |  ✅   |      ✅       |    ✅     |      ❌      |   ❌    |
| Public প্রশ্ন দেখা     |  ✅   |      ✅       |    ✅     |      ✅      |   ✅    |
| School প্রশ্ন দেখা     |  ✅   |      ✅       |    ✅     |      ✅      |   ❌    |
| Private প্রশ্ন দেখা    |  ✅   |      ✅       |    ✅     | শুধু নিজেরটা |   ❌    |
| Like/Comment/Share     |  ✅   |      ✅       |    ✅     |      ✅      |   ✅    |

\*ORG_PRINCIPAL অনুমতি দিলে

> **নোট:** PARENT অ্যাকাউন্ট STUDENT এর মতোই — শুধু Public প্রশ্ন browse ও like/comment/share করতে পারবে।

---

## 4. 🗄️ ডেটাবেস স্কিমা (Prisma Schema)

### Core Models

@./schema.prisma

---

## 5. 📁 ফোল্ডার স্ট্রাকচার (Next.js App Router)

```text
Shikkhok Pro/
├── app/
│   ├── (auth)/                         # Clerk auth pages
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   └── onboarding/                 # Account type selection (TEACHER/STUDENT/PARENT)
│   │
│   ├── (main)/                         # Main app (logged in)
│   │   ├── layout.tsx                  # Main layout with sidebar
│   │   ├── feed/                       # সোশ্যাল ফিড (হোম)
│   │   ├── explore/                    # পাবলিক প্রশ্ন browse
│   │   ├── profile/[username]/         # ইউজার প্রোফাইল
│   │   ├── question/[id]/              # একটি প্রশ্নের পেজ
│   │   └── messages/                   # StreamChat messaging
│   │
│   ├── (teacher)/                      # Teacher-only features
│   │   ├── dashboard/                  # Teacher dashboard
│   │   ├── my-questions/              # আমার তৈরি সব প্রশ্ন
│   │   ├── create/
│   │   │   ├── ai/                    # AI দিয়ে প্রশ্ন তৈরি
│   │   │   └── editor/                # Question Editor দিয়ে তৈরি
│   │   └── org/
│   │       ├── create/                # নতুন Organization তৈরি
│   │       └── [slug]/
│   │           ├── dashboard/         # Org overview
│   │           ├── teachers/          # Teacher ম্যানেজমেন্ট
│   │           ├── banks/             # Question Bank লিস্ট
│   │           │   ├── create/
│   │           │   └── [bankId]/
│   │           │       └── generate/  # AI প্রশ্ন জেনারেট (org context)
│   │           ├── tasks/             # টাস্ক ম্যানেজার
│   │           ├── notices/           # নোটিশ বোর্ড
│   │           └── settings/          # Org সেটিংস
│   │
│   ├── api/
│   │   ├── auth/                      # Clerk webhooks
│   │   ├── questions/                 # প্রশ্ন CRUD
│   │   ├── ai/generate/               # AI প্রশ্ন জেনারেশন
│   │   ├── ai/suggestions/            # Inline AI suggestions (editor)
│   │   ├── ai/pdf/                    # PDF export queue
│   │   ├── organizations/             # Org CRUD
│   │   ├── banks/                     # Question Bank CRUD
│   │   ├── social/                    # Like/Comment/Share
│   │   ├── tasks/                     # টাস্ক CRUD
│   │   ├── notices/                   # নোটিশ CRUD
│   │   └── notifications/             # Push notification
│   │
│   └── (public)/                      # লগইন ছাড়া দেখা যাবে
│       ├── page.tsx                   # ল্যান্ডিং পেজ
│       └── q/[id]/                    # Public প্রশ্ন শেয়ার লিঙ্ক
│
├── components/
│   ├── ui/                            # shadcn base components
│   ├── question/
│   │   ├── ../src/components/question/QuestionCard.tsx           # ফিডে প্রশ্নের কার্ড
│   │   ├── QuestionDetail.tsx         # পুরো প্রশ্ন দেখা
│   │   ├── QuestionActions.tsx        # Like/Share/Comment বার
│   │   ├── QuestionPaper.tsx          # Print ভিউ
│   │   └── VisibilityBadge.tsx        # PUBLIC/SCHOOL/PRIVATE badge
│   ├── editor/
│   │   ├── QuestionEditor.tsx         # TipTap based rich editor
│   │   ├── EditorToolbar.tsx          # Formatting toolbar
│   │   ├── ShapeDrawer.tsx            # Shape drawing panel
│   │   ├── IconPicker.tsx             # Platform icons insert
│   │   ├── LayoutTemplates.tsx        # Pre-defined question layouts
│   │   └── ComponentLibrary.tsx       # MCQ/CQ pre-built components
│   ├── ai-generator/
│   │   ├── GeneratorWizard.tsx        # Step-by-step AI generation
│   │   ├── SyllabusUpload.tsx         # Syllabus/book file upload
│   │   ├── DifficultySelector.tsx
│   │   └── PreviewQuestion.tsx        # AI output preview & edit
│   ├── org/
│   │   ├── OrgCard.tsx
│   │   ├── MemberList.tsx
│   │   ├── RoleAssigner.tsx           # TEACHER/ADMIN/PRINCIPAL role assign
│   │   └── SubjectClassAssign.tsx     # Teacher-subject-class mapping
│   ├── task/
│   │   ├── TaskCard.tsx
│   │   ├── TaskForm.tsx               # Create/edit task
│   │   └── TaskStatusBadge.tsx
│   ├── notice/
│   │   ├── NoticeCard.tsx
│   │   └── NoticeForm.tsx
│   ├── messaging/
│   │   ├── ChatWrapper.tsx            # StreamChat wrapper
│   │   ├── MemberList.tsx             # Org member list for DM
│   │   └── GroupChat.tsx              # Org group channel
│   ├── feed/
│   │   ├── FeedLayout.tsx
│   │   └── FeedFilters.tsx
│   └── shared/
│       ├── Navbar.tsx
│       ├── Sidebar.tsx
│       └── NotificationBell.tsx
│
├── lib/
│   ├── clerk.ts                       # Clerk helpers
│   ├── ai.ts                          # AI prompt builder
│   ├── pdf.ts                         # PDF generator
│   ├── stream-chat.ts                 # StreamChat client setup
│   └── validations/                   # Zod schemas
│
└── hooks/
    ├── useQuestion.ts
    ├── useOrganization.ts
    ├── useTask.ts
    └── useNotification.ts
```

---

## 6. 🤖 AI প্রশ্ন জেনারেশন সিস্টেম

### দুটি পথ

```text
Path 1 — AI Generation:
  ┌─────────────────────────────────────────┐
  │  Teacher → Subject + Class নির্বাচন        │
  │  → Difficulty (Easy/Normal/Hard)        │
  │  → Syllabus Input:                      │
  │      ├── File Upload (PDF/DOCX/IMG)     │
  │      ├── Chapter/Topic manually         │
  │      └── Custom Prompt to AI            │
  │  → Book Source:                         │
  │      ├── NCTB Board Books (built-in)    │
  │      └── Custom Book Upload             │
  │  → AI generates MD format question      │
  │  → Teacher previews → edits if needed   │
  │  → Set Visibility → Save/Export         │
  └─────────────────────────────────────────┘

Path 2 — Question Editor (Manual):
  ┌─────────────────────────────────────────┐
  │  Teacher → Opens Question Editor        │
  │  → Side panel: Book viewer (copy text)  │
  │  → Side panel: Book viewer (copy text)  │
  │  → Rich text editing with toolbar       │
  │  → AI inline suggestions (on cursor)    │
  │  → Pre-built layouts / components       │
  │  → Set Visibility → Save/Export         │
  └─────────────────────────────────────────┘
```

### AI ইনপুট প্যারামিটার

```javascript
interface QuestionGenerationInput {
  subject: string;          // বাংলা | ইংরেজি | গণিত | বিজ্ঞান...
  className: string;        // Class-1 → HSC
  difficulty: 'EASY' | 'NORMAL' | 'HARD';
  chapters?: string[];
  topics?: string[];
  syllabusFile?: File;      // PDF/DOCX/JPG
  customBook?: File;        // custom book upload
  useNCTB: boolean;         // NCTB board book use করবে কিনা
  customPrompt?: string;
  bankId?: string;          // কোন Question Bank এ রাখবে
}
```

### Question Editor ফিচার সমূহ

```text
Text Formatting:
  ├── Heading (h1–h6)
  ├── Bold, Italic, Underline, Strikethrough
  ├── Color Text, Text Alignment
  ├── Superscript, Subscript
  ├── Ordered & Unordered Lists (nested)
  └── Horizontal Line, Table

Inserts:
  ├── Images (upload)
  ├── Icons (platform icon library)
  └── Pre-built Components:
      ├── Single MCQ question template
      ├── Multi-MCQ layout template
      ├── CQ (Creative Question) template
      └── Others

Special:
  ├── AI Inline Suggestions (appears above cursor)
  ├── Book Panel (side view, copyable text)
  ├── Font Selector (Bangla-stable fonts)
  └── Pre-defined question layouts (editable)

Export Formats:
  PDF | DOCX/DOC | PNG/JPG
```

### AI আউটপুট ফরম্যাট

```text
Output: Markdown (MD)
  → Teacher previews MD rendered in platform
  → AI generated question is editable in Question Editor
  → After edit, same export options available
```

---

## 7. 🔒 ভিজিবিলিটি ও অ্যাক্সেস কন্ট্রোল

```text
প্রশ্ন PUBLIC হলে:
  → যে কেউ দেখতে পারবে (STUDENT, PARENT, TEACHER)
  → ফিডে দেখাবে
  → Share link সবার জন্য কাজ করবে

প্রশ্ন SCHOOL হলে:
  → শুধু একই Organization এর সদস্যরা দেখতে পারবে
  → Share link শুধু Org members এর জন্য কাজ করবে
  → অন্যরা 401 পাবে

প্রশ্ন PRIVATE হলে:
  → শুধু question creator নিজে দেখতে পারবে
  → Share link কাজ করবে না
  → ORG_PRINCIPAL ও ORG_ADMIN দেখতে পারবে (org context এ)

Default (নতুন তৈরি হলে):
  → PRIVATE (teacher পরে বদলাতে পারবে)
```

---

## 8. 📱 পেজ ও ফিচার ব্রেকডাউন

### 🏠 পাবলিক ল্যান্ডিং পেজ

- প্ল্যাটফর্মের পরিচয়
- পাবলিক প্রশ্নের স্যাম্পল
- Login / Sign Up CTA

### 📰 ফিড (হোম — TEACHER, STUDENT, PARENT)

- Public প্রশ্নের infinite scroll ফিড
- Filter: বিষয়, ক্লাস, কঠিনতা
- Like, Comment, Share
- Browse questions

### 🔍 এক্সপ্লোর

- Search প্রশ্ন
- Tag, বিষয়, ক্লাস দিয়ে Filter
- Trending প্রশ্নপত্র

### 🏫 অর্গানাইজেশন (ORG_PRINCIPAL View)

```text
├── Overview        → সংক্ষিপ্ত পরিসংখ্যান
├── Teachers        → Teacher যোগ / বাদ / role পরিবর্তন
│                     (subject ও class assignment সহ)
├── Question Banks  → তৈরি করা Bank লিস্ট ও manage
├── Tasks           → Task দেওয়া ও track করা
├── Notices         → Notice পোস্ট করা (CRUD)
├── Messages        → Org group chat ও DM
└── Settings        → Org সেটিংস
```

### 👩‍🏫 Teacher Dashboard

```text
├── My Questions    → আমার তৈরি সব প্রশ্ন
├── Create with AI  → AI দিয়ে প্রশ্ন তৈরি (wizard)
├── Question Editor → হাতে প্রশ্ন তৈরি (rich editor)
├── My Tasks        → assigned task দেখা ও submit করা
├── Notice Board    → org এর notice দেখা
└── Messages        → org members এর সাথে chat
```

### ✍️ AI প্রশ্ন জেনারেটর (Step-by-step Wizard)

```text
Step 1: বিষয় ও ক্লাস নির্বাচন
Step 2: কঠিনতা (Easy / Normal / Hard) নির্বাচন
Step 3: সিলেবাস ইনপুট:
          ├── File upload (PDF/DOCX/IMG)
          ├── Chapter/Topic manually
          └── Custom Prompt
Step 4: Book Source:
          ├── NCTB Board Books (built-in)
          └── Custom Book upload
Step 5: AI Generation → MD Preview
Step 6: Edit in Question Editor (optional)
Step 7: Visibility set (Public/School/Private)
Step 8: Export (PDF / DOCX / PNG ) বা Save
```

### 📋 টাস্ক ম্যানেজার

```text
PRINCIPAL / ADMIN করে:
  → Task তৈরি (Title, Description, Assigned Teacher, Expire Date)
  → Task CRUD
  → Submitted task review → Approve (with message) / Reject (with feedback)
  → Re-assign rejected task

TEACHER করে:
  → Assigned task দেখে
  → Question তৈরি করে task submit করে
  → Feedback/Approve message দেখে

Task Status Flow:
  PENDING → IN_PROGRESS → SUBMITTED → APPROVED / REJECTED → (re-assign)

সব Org member সব task দেখতে পারবে।
Task notification: mobile push / desktop notification।
```

### 📢 নোটিশ বোর্ড

- ADMIN / PRINCIPAL notice তৈরি ও CRUD করবে
- সব Org member notice দেখতে পারবে
- Notice fields: createDate (auto), Title, Description, Type (EVENTS/URGENT/GENERAL/EXAM/HOLIDAY/OTHER)
- Important notice pin করা
- Notice এ notification

### 💬 মেসেজিং (StreamChat)

```text
Features:
  ├── 1-on-1 DM (org members এর মধ্যে)
  ├── Org Group Channel (সব members একসাথে)
  ├── File / Image / Question শেয়ার
  ├── ADMIN/PRINCIPAL badge (avatar এর উপরে)
  └── PRINCIPAL/ADMIN group এ member এর message on/off control

Member List:
  → সব org members দেখা যাবে
  → ADMIN label ও PRINCIPAL label visible

Privacy:
  → শুধু একই Org এর members chat করতে পারবে
```

---

## 9. 🎨 UI/UX গাইডলাইন

### ডিজাইন থিম

```text
Primary Color  : #1E40AF (Deep Blue — শিক্ষার রং)
Secondary      : #059669 (Green — বাংলাদেশের সবুজ)
Accent         : #F59E0B (Amber)
Background     : #F8FAFC (Light) / #0F172A (Dark)
Font           : Plus Jakarta Sans (English) + Kalpurush / Hind Siliguri (Bangla)
```

### Bangla Text

```text
- Bangla letters অবশ্যই stable থাকতে হবে, কোনো breakage নেই
- Question Editor এ Bangla font পরিবর্তনের option থাকবে
- Platform এ Bangla font selector built-in
```

### রেসপনসিভ

- Mobile First (বাংলাদেশে mobile ব্যবহার বেশি)
- PWA সাপোর্ট
- Question Editor real-time (collaborative ready)

---

## 10. 🚀 ডেভেলপমেন্ট ফেজ

### Phase 1 — Foundation (সপ্তাহ ১-২)

- [ ] Next.js প্রজেক্ট সেটআপ
- [ ] Clerk Auth ইন্টিগ্রেশন (Google/GitHub/Facebook)
- [ ] Onboarding: Account type select (TEACHER/STUDENT/PARENT)
- [ ] Prisma + PostgreSQL সেটআপ
- [ ] User Profile পেজ
- [ ] Organization তৈরি (TEACHER → becomes ORG_PRINCIPAL)
- [ ] Teacher add/assign system (subject + class)

### Phase 2 — Core Question Features (সপ্তাহ ৩-৪)

- [ ] Question Bank CRUD (org only)
- [ ] AI প্রশ্ন জেনারেটর (step-by-step wizard)
- [ ] NCTB Curriculum data integration
- [ ] Syllabus / Book file upload to AI
- [ ] Question Editor (TipTap + shapes + icons)
- [ ] AI inline suggestions in editor
- [ ] Question export (PDF/DOCX/PNG/MD)
- [ ] Visibility control (PUBLIC/SCHOOL/PRIVATE)

### Phase 3 — Social Features (সপ্তাহ ৫-৬)

- [ ] Public Feed (infinite scroll)
- [ ] Like / Comment / Share
- [ ] Explore পেজ + Search
- [ ] Notification system (push)
- [ ] STUDENT / PARENT browse flow

### Phase 4 — Organization Tools (সপ্তাহ ৭-৮)

- [ ] Task Management System (CRUD, submit, review, re-assign)
- [ ] Task Notifications (mobile/desktop push)
- [ ] Notice Board (CRUD, pin, types)
- [ ] StreamChat integration (DM + group channel)
- [ ] ADMIN/PRINCIPAL badges in chat
- [ ] Group message permission control (PRINCIPAL/ADMIN)

### Phase 5 — Polish & Launch (সপ্তাহ ৯-১০)

- [ ] Bangla font stability audit
- [ ] Mobile responsive QA
- [ ] PWA setup
- [ ] Performance optimization (caching, search index)
- [ ] Security audit (visibility rules, role checks)
- [ ] Production deployment (Vercel + Neon)

---

## 11. 🔄 ডেটা ফ্লো ডায়াগ্রাম (DFD সারসংক্ষেপ)

```text
                        ┌─────────────────┐
                        │   External User │
                        │ (STUDENT/PARENT)│
                        └────────┬────────┘
                                 │ Browse Public Questions
                                 ▼
┌──────────┐    Auth      ┌─────────────┐    API Request    ┌───────────────┐
│  Clerk   │◄────────────►│   Next.js   │◄─────────────────►│  PostgreSQL   │
│  (Auth)  │              │  Frontend   │                   │  (Prisma ORM) │
└──────────┘              └──────┬──────┘                   └───────────────┘
                                 │
                    ┌────────────┼────────────┐
                    ▼            ▼            ▼
             ┌──────────┐ ┌──────────┐ ┌──────────┐
             │  TEACHER │ │  AI API  │ │StreamChat│
             │Dashboard │ │(Groq/    │ │(Messaging│
             └────┬─────┘ │Gemini)   │ │Solution) │
                  │       └──────────┘ └──────────┘
        ┌─────────┼──────────┐
        ▼         ▼          ▼
  ┌──────────┐ ┌───────┐ ┌────────┐
  │Question  │ │ Task  │ │Notice  │
  │Bank/     │ │Manager│ │Board   │
  │Editor    │ └───────┘ └────────┘
  └──────────┘
        │
        ▼
  ┌───────────────────────────────┐
  │    Question Visibility        │
  │  PUBLIC → Feed (all)          │
  │  SCHOOL → Org members only    │
  │  PRIVATE → Creator only       │
  └───────────────────────────────┘
        │
        ▼
  ┌───────────────────────────────┐
  │  File Storage (Cloudinary/S3) │
  │  Syllabus, Book files, Images │
  └───────────────────────────────┘
```

---

> **সোর্স অফ ট্রুথ:** এই ফাইলটি `context/features.md` ও DFD ডায়াগ্রামের উপর ভিত্তি করে তৈরি। যেকোনো conflict এ `features.md` প্রাধান্য পাবে।
