export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
}

export interface Stat {
  value: string;
  label: string;
  suffix?: string;
}

export interface Step {
  number: string;
  title: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  school: string;
  content: string;
  avatar: string;
  rating: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface CurriculumClass {
  label: string;
  range: string;
}
