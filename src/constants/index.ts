import {
  GraduationCap,
  BookOpen,
  Users,
  ArrowRight,
  Check,
} from "lucide-react";
import type {
  Feature,
  Stat,
  Step,
  Testimonial,
  FAQItem,
  NavItem,
} from "@/types";

export const NAV_ITEMS: NavItem[] = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Security", href: "#security" },
  { label: "Curriculum", href: "#curriculum" },
  { label: "FAQ", href: "#faq" },
];

export const STATS: Stat[] = [
  { value: "5,000", label: "Active Teachers", suffix: "+" },
  { value: "50,000", label: "Questions Generated", suffix: "+" },
  { value: "500", label: "Schools & Colleges", suffix: "+" },
  { value: "99.9", label: "Uptime", suffix: "%" },
];

export const FEATURES: Feature[] = [
  {
    id: "ai-gen",
    icon: "brain",
    title: "AI Question Generation",
    description:
      "Generate high-quality, curriculum-aligned questions instantly using Claude AI. Customize by difficulty, topic, and question type.",
    color: "#6366f1",
  },
  {
    id: "question-bank",
    icon: "database",
    title: "Smart Question Banks",
    description:
      "Organize thousands of questions by subject, class, chapter, and topic. Keep your private bank or share with your school.",
    color: "#a855f7",
  },
  {
    id: "visibility",
    icon: "shield",
    title: "3-Level Visibility Control",
    description:
      "Set questions as Private (only you), School (all teachers), or Public (everyone). Questions are private by default.",
    color: "#22d3ee",
  },
  {
    id: "social",
    icon: "users",
    title: "Social Learning Feed",
    description:
      "Browse, like, comment, and share public questions. Follow top educators and discover the best questions in Bangladesh.",
    color: "#f59e0b",
  },
  {
    id: "organization",
    icon: "building",
    title: "Organization Management",
    description:
      "Create your school/college organization, invite teachers by username, assign roles, and manage your team effortlessly.",
    color: "#10b981",
  },
  {
    id: "task",
    icon: "clipboard",
    title: "Task Manager",
    description:
      "Principals can assign question-creation tasks to teachers with deadlines. Teachers submit completed work directly in-app.",
    color: "#ef4444",
  },
  {
    id: "export",
    icon: "download",
    title: "PDF & Image Export",
    description:
      "Export beautifully formatted question papers as PDF or images. Professional layout ready to print and distribute.",
    color: "#8b5cf6",
  },
  {
    id: "messaging",
    icon: "message",
    title: "Teacher Messaging",
    description:
      "Powered by Stream Chat — communicate with colleagues within your organization in real-time. Channels, DMs, and more.",
    color: "#06b6d4",
  },
];

export const STEPS: Step[] = [
  {
    number: "01",
    title: "Create Your Organization",
    description:
      "Sign up, create your school or college organization, and invite your teachers by username. Set up is done in minutes.",
  },
  {
    number: "02",
    title: "Build Your Question Bank",
    description:
      "Organize subjects and topics for each class. Start populating your bank with AI-generated or manually written questions.",
  },
  {
    number: "03",
    title: "Generate & Customize",
    description:
      "Use AI to generate questions tailored to NCTB curriculum. Add custom prompts, set difficulty, include specific chapters.",
  },
  {
    number: "04",
    title: "Export & Share",
    description:
      "Export professional question papers as PDF or images. Control who sees what — keep it private or share with your school.",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Md. Rafiqul Islam",
    role: "Head of Mathematics",
    school: "Dhaka Government High School",
    content:
      "Shikkhok Pro has completely transformed how I create exam papers. What used to take me 3 hours now takes 15 minutes. The AI understands the NCTB syllabus perfectly.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 5,
  },
  {
    id: "2",
    name: "Sumaiya Khatun",
    role: "Senior English Teacher",
    school: "Viqarunnisa Noon School & College",
    content:
      "The question bank feature is brilliant. I've built a comprehensive bank for all classes and the visibility controls mean I never worry about question leaks before exams.",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b6df36c?w=100&h=100&fit=crop&crop=face",
    rating: 5,
  },
  {
    id: "3",
    name: "Karim Ahmed",
    role: "Principal",
    school: "Rajshahi Collegiate School",
    content:
      "Managing 40+ teachers and their exam preparation used to be chaotic. Now I assign tasks, track progress, and the messaging keeps everyone on the same page.",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    rating: 5,
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "1",
    question: "How does the AI generate questions?",
    answer:
      "Our AI is powered by Claude (Anthropic) and trained with NCTB curriculum knowledge. You specify the class, subject, chapter, difficulty level, and question type — the AI generates accurate, curriculum-aligned questions instantly. You can also add custom prompts for specific requirements.",
  },
  {
    id: "2",
    question: "How are question papers protected from leaking?",
    answer:
      "Every generated question is private by default — only you can see it. You choose to make it 'School' (visible to all teachers in your org) or 'Public' (visible to everyone). School-level questions require organization membership. We also use encrypted storage and access control on every request.",
  },
  {
    id: "3",
    question: "Which classes and subjects are supported?",
    answer:
      "We support the full NCTB curriculum: Class 1 through Class 10, SSC, and HSC. All subjects are covered — Bangla, English, Mathematics, Science, Physics, Chemistry, Biology, History, Geography, ICT, Religious Studies, and more.",
  },
  {
    id: "4",
    question: "How do I invite teachers to my organization?",
    answer:
      "After creating your organization, go to the Teachers section and enter a teacher's Shikkhok Pro username to send them an invitation. They'll see the invitation on their dashboard and can accept or decline. You can assign them as a Teacher or Organization Admin.",
  },
  {
    id: "5",
    question: "Can students see question papers on the platform?",
    answer:
      "Students can only see questions that teachers have explicitly set to 'Public'. Private and School-level questions are completely hidden from students and anyone outside the organization. Teachers always have full control over visibility.",
  },
  {
    id: "6",
    question: "Is Shikkhok Pro free to use?",
    answer:
      "Shikkhok Pro offers a free tier for individual teachers with limited AI generations per month. For schools and organizations that need unlimited generations, team features, and advanced export options, we offer affordable school plans.",
  },
  {
    id: "7",
    question: "Can I export question papers as PDF?",
    answer:
      "Yes. Once you generate or build a question paper, you can export it as a professionally formatted PDF or save it as an image. The layout is print-ready with school header, marking scheme, and all question types properly formatted.",
  },
];

export const SUBJECTS = [
  "Bangla",
  "English",
  "Mathematics",
  "Science",
  "Physics",
  "Chemistry",
  "Biology",
  "History & Social Science",
  "Geography",
  "ICT",
  "Religious Studies",
  "Agriculture",
  "Home Science",
  "Business Studies",
  "Accounting",
];

export const CLASSES = [
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "SSC",
  "HSC",
];

export const ACCOUNT_TYPES = [
  {
    type: "TEACHER",
    icon: GraduationCap,
    title: "Teacher",
    description:
      "Create AI-powered exam papers, manage your school organization, and assign tasks.",
    perks: [
      "AI Question Generator",
      "Question Banks",
      "Create Organization",
      "Task Management",
    ],
    color: "#6366f1",
    glow: "rgba(99,102,241,0.25)",
  },
  {
    type: "STUDENT",
    icon: BookOpen,
    title: "Student",
    description:
      "Browse public question papers, engage with teachers, and follow your feed.",
    perks: [
      "Browse Public Questions",
      "Like & Comment",
      "Follow Teachers",
      "Explore Feed",
    ],
    color: "#22d3ee",
    glow: "rgba(34,211,238,0.25)",
  },
  {
    type: "PARENT",
    icon: Users,
    title: "Parent",
    description:
      "Stay updated with your child's education and follow public academic content.",
    perks: [
      "Browse Public Questions",
      "Like & Comment",
      "Explore Feed",
      "Academic Insights",
    ],
    color: "#a855f7",
    glow: "rgba(168,85,247,0.25)",
  },
];

export const FOOTER_LINKS = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Curriculum", href: "#curriculum" },
    { label: "Security", href: "#security" },
    { label: "Pricing", href: "/pricing" },
  ],
  Platform: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Question Explorer", href: "/explore" },
    { label: "Organizations", href: "/org/create" },
    { label: "API", href: "/api-docs" },
  ],
  Support: [
    { label: "Documentation", href: "/docs" },
    { label: "Help Center", href: "/help" },
    { label: "Contact Us", href: "/contact" },
    { label: "Status", href: "/status" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};
