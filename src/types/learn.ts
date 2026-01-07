export type Course = {
  id: number;
  title: string;
  description: string | null;
};

export type Lesson = {
  id: number;
  title: string;
};

export type Option = {
  id: number;
  option_text: string;
  is_correct: 0 | 1;
  feedback?: string | null;
};

export type Question = {
  id: number;
  prompt: string;
  options: Option[];
};