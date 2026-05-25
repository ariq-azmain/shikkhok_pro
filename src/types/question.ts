// src/types/question.ts

export type Difficulty = "EASY" | "NORMAL" | "HARD";
export type Visibility = "PUBLIC" | "SCHOOL" | "PRIVATE";

export interface QuestionItem {
  no: number;
  text: string;
  marks?: number;
  options?: string[];
  answer?: string;
}

export interface QuestionSection {
  title: string;
  marks: number;
  questions: QuestionItem[];
}

export interface QuestionContent {
  sections: QuestionSection[];
}

export interface QuestionCreator {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  accountType: string;
}

export interface Question {
  id: string;
  title: string;
  content: QuestionContent;
  subject: string;
  className: string;
  chapter: string | null;
  topic: string | null;
  difficulty: Difficulty;
  totalMarks: number | null;
  timeMinutes: number | null;
  visibility: Visibility;
  aiGenerated: boolean;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  createdAt: string;
  creator: QuestionCreator;
}

export interface QuestionsResponse {
  data: Question[];
  nextCursor: string | null;
}
