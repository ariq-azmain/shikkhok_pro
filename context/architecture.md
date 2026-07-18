# 📚 Shikkhok Pro — Complete Project Architecture Plan
> AI-powered question paper social platform for teachers and students in Bangladesh
> 
## 1. 🧭 Project Overview
| Topic | Description |
|---|---|
| Project Name | Shikkhok Pro (শিক্ষক প্রো) |
| Target Audience | Schools, colleges, teachers, students, and parents in Bangladesh |
| Curriculum | NCTB — Class 1–10, SSC, HSC |
| Language | English (UI), Bangla (Content) |
| Core Features | AI-powered question generation + Social media feed + Organization management |
## 2. 🛠️ Tech Stack (Recommended)
### Frontend
```text
Framework     : Next.js 14+ (App Router)
Styling       : Tailwind CSS
State Mgmt    : Zustand / React Query (TanStack)
Forms         : React Hook Form + Zod
Rich Text     : TipTap Editor (For Question Editor)
Realtime Chat : StreamChat (pre-built messaging solution)
PDF Export    : react-pdf / puppeteer

```
### Backend
```text
Runtime       : Next.js API Routes
Database      : PostgreSQL (Supabase)
File Storage  : Cloudinary / AWS S3 (For uploading images, syllabi, books)
Cache         : Redis (Upstash)
Queue         : BullMQ (PDF generation, AI queue)
Search        : Meilisearch / Algolia (Question search)
Notifications : Web Push / FCM (task notification)

```
### Auth
```text
Provider      : Clerk
Login Methods : Google, GitHub, Facebook, email (Social Login)
Account Types : TEACHER | STUDENT | PARENT (selected during signup)

```
### AI
```text
Primary       : Groq
Fallback      : Gemini
Use Cases     : Question generation, custom prompts, syllabus matching, inline suggestions
Book Sources  : Bangladesh NCTB Board Books (Class 1–10, SSC, HSC)
Upload Support: PDF, DOCX/DOC, PNG/JPG/JPEG, and other relevant formats

```
### Messaging
```text
Provider      : StreamChat (pre-built solution — not from scratch)
Features      : 1-on-1 DM, Group Chat (org-level), file/image/question sharing

```
### DevOps
```text
Hosting       : Vercel (Frontend + API)
DB Hosting    : PostgreSQL / Supabase
Monitoring    : Sentry + Vercel Analytics
CI/CD         : GitHub Actions

```
## 3. 👥 User Roles
```text
── Global Roles ──
SUPER_ADMIN      → Platform Owner (Shikkhok Pro Team)
TEACHER          → Teacher (Creates questions, can create orgs)
STUDENT          → Student (Views public questions & engages)
PARENT           → Parent (Views public questions & engages)

── Organization Roles (Inside a TEACHER's org) ──
ORG_PRINCIPAL    → Organization Creator — Highest authority
ORG_ADMIN        → Appointed by Principal — Management authority
ORG_TEACHER      → Member Teacher of the Organization

```
### Role Permission Matrix
| Permission | SUPER | ORG_PRINCIPAL | ORG_ADMIN | TEACHER | STUDENT |
|---|---|---|---|---|---|
| Generate Questions | ✅ | ✅ | ✅ | ✅ | ❌ |
| Create Question Bank | ✅ | ✅ | ✅* | ❌ | ❌ |
| Add/Remove Teacher | ✅ | ✅ | ✅ | ❌ | ❌ |
| Assign Tasks | ✅ | ✅ | ✅ | ❌ | ❌ |
| Post Notices | ✅ | ✅ | ✅ | ❌ | ❌ |
| View Public Questions | ✅ | ✅ | ✅ | ✅ | ✅ |
| View School Questions | ✅ | ✅ | ✅ | ✅ | ❌ |
| View Private Questions | ✅ | ✅ | ✅ | Only Own | ❌ |
| Like/Comment/Share | ✅ | ✅ | ✅ | ✅ | ✅ |
*If permitted by ORG_PRINCIPAL
> **Note:** PARENT accounts function similarly to STUDENT accounts — they can only browse and like/comment/share public questions.
> 
## 4. 🗄️ Database Schema (Prisma Schema)
### Core Models
@./schema.prisma
## 5. 📁 Folder Structure (Next.js App Router)
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
│   │   ├── feed/                       # Social feed (Home)
│   │   ├── explore/                    # Browse public questions
│   │   ├── profile/[username]/         # User profile
│   │   ├── question/[id]/              # Single question page
│   │   └── messages/                   # StreamChat messaging
│   │
│   ├── (teacher)/                      # Teacher-only features
│   │   ├── dashboard/                  # Teacher dashboard
│   │   ├── my-questions/              # My generated questions
│   │   ├── create/
│   │   │   ├── ai/                    # Create questions with AI
│   │   │   └── editor/                # Create with Question Editor
│   │   └── org/
│   │       ├── create/                # Create new Organization
│   │       └── [slug]/
│   │           ├── dashboard/         # Org overview
│   │           ├── teachers/          # Teacher management
│   │           ├── banks/             # Question Bank list
│   │           │   ├── create/
│   │           │   └── [bankId]/
│   │           │       └── generate/  # AI question generation (org context)
│   │           ├── tasks/             # Task manager
│   │           ├── notices/           # Notice board
│   │           └── settings/          # Org settings
│   │
│   ├── api/
│   │   ├── auth/                      # Clerk webhooks
│   │   ├── questions/                 # Question CRUD
│   │   ├── ai/generate/               # AI question generation
│   │   ├── ai/suggestions/            # Inline AI suggestions (editor)
│   │   ├── ai/pdf/                    # PDF export queue
│   │   ├── organizations/             # Org CRUD
│   │   ├── banks/                     # Question Bank CRUD
│   │   ├── social/                    # Like/Comment/Share
│   │   ├── tasks/                     # Task CRUD
│   │   ├── notices/                   # Notice CRUD
│   │   └── notifications/             # Push notification
│   │
│   └── (public)/                      # Visible without login
│       ├── page.tsx                   # Landing page
│       └── q/[id]/                    # Public question share link
│
├── components/
│   ├── ui/                            # shadcn base components
│   ├── question/
│   │   ├── QuestionCard.tsx           # Question card in feed
│   │   ├── QuestionDetail.tsx         # Full question view
│   │   ├── QuestionActions.tsx        # Like/Share/Comment bar
│   │   ├── QuestionPaper.tsx          # Print view
│   │   └── VisibilityBadge.tsx        # PUBLIC/SCHOOL/PRIVATE badge
│   ├── editor/
│   │   ├── QuestionEditor.tsx         # TipTap based rich editor
│   │   ├── EditorToolbar.tsx          # Formatting toolbar
│   │   ├── ShapeDrawer.tsx            # Shape drawing panel
│   │   ├── IconPicker.tsx             # Insert platform icons
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
## 6. 🤖 AI Question Generation System
### Two Paths
```text
Path 1 — AI Generation:
  ┌─────────────────────────────────────────┐
  │  Teacher → Selects Subject + Class      │
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
  │  → Rich text editing with toolbar       │
  │  → AI inline suggestions (on cursor)    │
  │  → Pre-built layouts / components       │
  │  → Set Visibility → Save/Export         │
  └─────────────────────────────────────────┘

```
### AI Input Parameters
```javascript
interface QuestionGenerationInput {
  subject: string;          // Bangla | English | Math | Science...
  className: string;        // Class 1 → HSC
  difficulty: 'EASY' | 'NORMAL' | 'HARD';
  chapters?: string[];
  topics?: string[];
  syllabusFile?: File;      // PDF/DOCX/JPG
  customBook?: File;        // Custom book upload
  useNCTB: boolean;         // Whether to use NCTB board books
  customPrompt?: string;
  bankId?: string;          // Which Question Bank to store it in
}

```
### Question Editor Features
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
### AI Output Format
```text
Output: Markdown (MD)
  → Teacher previews MD rendered in platform
  → AI generated question is editable in Question Editor
  → After edit, same export options available

```
## 7. 🔒 Visibility & Access Control
```text
If question is PUBLIC:
  → Anyone can view it (STUDENT, PARENT, TEACHER)
  → Visible in the feed
  → Share link works for everyone

If question is SCHOOL:
  → Only members of the same Organization can view it
  → Share link works only for Org members
  → Others will receive a 401 error

If question is PRIVATE:
  → Only the question creator can view it
  → Share link will not work
  → ORG_PRINCIPAL and ORG_ADMIN can view it (within the org context)

Default (when newly created):
  → PRIVATE (teacher can change it later)

```
## 8. 📱 Page & Feature Breakdown
### 🏠 Public Landing Page
 * Platform introduction
 * Samples of public questions
 * Login / Sign Up CTA
### 📰 Feed (Home — TEACHER, STUDENT, PARENT)
 * Infinite scroll feed of Public questions
 * Filters: Subject, Class, Difficulty
 * Like, Comment, Share
 * Browse questions
### 🔍 Explore
 * Search questions
 * Filter by tags, subject, and class
 * Trending question papers
### 🏫 Organization (ORG_PRINCIPAL View)
```text
├── Overview        → Summary statistics
├── Teachers        → Add / Remove / Change teacher roles
│                     (including subject and class assignment)
├── Question Banks  → List and manage created Banks
├── Tasks           → Assign and track tasks
├── Notices         → Post notices (CRUD)
├── Messages        → Org group chat and DMs
└── Settings        → Org settings

```
### 👩‍🏫 Teacher Dashboard
```text
├── My Questions    → All questions created by me
├── Create with AI  → Create questions via AI (wizard)
├── Question Editor → Create questions manually (rich editor)
├── My Tasks        → View and submit assigned tasks
├── Notice Board    → View organization notices
└── Messages        → Chat with org members

```
### ✍️ AI Question Generator (Step-by-step Wizard)
```text
Step 1: Select Subject and Class
Step 2: Select Difficulty (Easy / Normal / Hard)
Step 3: Syllabus Input:
          ├── File upload (PDF/DOCX/IMG)
          ├── Enter Chapter/Topic manually
          └── Custom Prompt
Step 4: Book Source:
          ├── NCTB Board Books (built-in)
          └── Custom Book upload
Step 5: AI Generation → MD Preview
Step 6: Edit in Question Editor (optional)
Step 7: Set Visibility (Public/School/Private)
Step 8: Export (PDF / DOCX / PNG) or Save

```
### 📋 Task Manager
```text
PRINCIPAL / ADMIN Actions:
  → Create Task (Title, Description, Assigned Teacher, Expiry Date)
  → Task CRUD
  → Review submitted tasks → Approve (with message) / Reject (with feedback)
  → Re-assign rejected tasks

TEACHER Actions:
  → View assigned tasks
  │ Create questions and submit the task
  → View feedback/approval messages

Task Status Flow:
  PENDING → IN_PROGRESS → SUBMITTED → APPROVED / REJECTED → (re-assign)

All Org members can view all tasks.
Task notifications: mobile push / desktop notifications.

```
### 📢 Notice Board
 * ADMIN / PRINCIPAL creates and handles CRUD operations for notices
 * All Org members can view notices
 * Notice fields: createDate (auto), Title, Description, Type (EVENTS/URGENT/GENERAL/EXAM/HOLIDAY/OTHER)
 * Pin important notices
 * Notifications on new notices
### 💬 Messaging (StreamChat)
```text
Features:
  ├── 1-on-1 DM (between org members)
  ├── Org Group Channel (all members together)
  ├── File / Image / Question sharing
  ├── ADMIN/PRINCIPAL badge (above avatar)
  └── PRINCIPAL/ADMIN control over member messaging (on/off) in the group

Member List:
  → View all org members
  → ADMIN label and PRINCIPAL label visible

Privacy:
  → Only members of the same Org can chat with each other

```
## 9. 🎨 UI/UX Guidelines
### Design Theme
```text
Primary Color  : #1E40AF (Deep Blue — The color of education)
Secondary      : #059669 (Green — The green of Bangladesh)
Accent         : #F59E0B (Amber)
Background     : #F8FAFC (Light) / #0F172A (Dark)
Font           : Plus Jakarta Sans (English) + Kalpurush / Hind Siliguri (Bangla)

```
### Bangla Text
 * Bangla letters must remain completely stable with no layout breakage.
 * The Question Editor will include options to change Bangla fonts.
 * Built-in Bangla font selector across the platform.
### Responsiveness
 * Mobile-First design (as mobile usage is dominant in Bangladesh).
 * PWA support.
 * Question Editor real-time readiness (collaborative-ready).
## 10. 🚀 Development Phases
### Phase 1 — Foundation (Weeks 1-2)
 * [ ] Next.js project setup
 * [ ] Clerk Auth integration (Google/GitHub/Facebook)
 * [ ] Onboarding: Account type selection (TEACHER/STUDENT/PARENT)
 * [ ] Prisma + PostgreSQL setup
 * [ ] User Profile page
 * [ ] Organization creation (TEACHER → becomes ORG_PRINCIPAL)
 * [ ] Teacher add/assign system (subject + class)
### Phase 2 — Core Question Features (Weeks 3-4)
 * [ ] Question Bank CRUD (org only)
 * [ ] AI Question Generator (step-by-step wizard)
 * [ ] NCTB Curriculum data integration
 * [ ] Syllabus / Book file upload to AI
 * [ ] Question Editor (TipTap + shapes + icons)
 * [ ] AI inline suggestions in editor
 * [ ] Question export (PDF/DOCX/PNG/MD)
 * [ ] Visibility control (PUBLIC/SCHOOL/PRIVATE)
### Phase 3 — Social Features (Weeks 5-6)
 * [ ] Public Feed (infinite scroll)
 * [ ] Like / Comment / Share
 * [ ] Explore page + Search
 * [ ] Notification system (push)
 * [ ] STUDENT / PARENT browse flow
### Phase 4 — Organization Tools (Weeks 7-8)
 * [ ] Task Management System (CRUD, submit, review, re-assign)
 * [ ] Task Notifications (mobile/desktop push)
 * [ ] Notice Board (CRUD, pin, types)
 * [ ] StreamChat integration (DM + group channel)
 * [ ] ADMIN/PRINCIPAL badges in chat
 * [ ] Group message permission control (PRINCIPAL/ADMIN)
### Phase 5 — Polish & Launch (Weeks 9-10)
 * [ ] Bangla font stability audit
 * [ ] Mobile responsive QA
 * [ ] PWA setup
 * [ ] Performance optimization (caching, search index)
 * [ ] Security audit (visibility rules, role checks)
 * [ ] Production deployment (Vercel + Neon)
## 11. 🔄 Data Flow Diagram (DFD Summary)
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
> **Source of Truth:** This file is built based on context/features.md and the DFD diagram. In case of any conflict, features.md will take precedence.
> 
