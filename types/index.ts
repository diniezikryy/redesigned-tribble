export interface User {
    id: number;
    username: string;
    email: string;
}

export interface LoginForm {
    username: string;
    password: string;
}

export interface AuthData {
    authenticated: boolean;
    username: string;
}

export interface Quiz {
    id: number;
    title: string;
    description: string;
    creator: string;
    created_at: string;  // ISO 8601 format
    questions: Question[];
}

export interface Question {
    id: number;
    text: string;
    question_type: 'mcq' | 'short_answer';
    answers?: Answer[];
}

export interface Answer {
    id?: number | undefined;
    text: string;
    is_correct: boolean;
}

export interface QuizAttempt {
  id: number;
  user: User;
  quiz: Quiz;
  startTime: Date;
  endTime: Date | null;
  score: number | null;
  userAnswers: UserAnswer[];
}

export interface UserAnswer {
  id: number;
  quizAttempt: QuizAttempt;
  question: Question;
  selectedAnswer: Answer | null;
  textAnswer: string | null;
}
export interface AttemptResult {
  id: number;
  quiz: number;
  user: number;
  start_time: string;
  end_time: string;
  score: number;
  user_answers: UserAnswer[];
}

export interface AttemptOverview {
  id: number;
  title: string;
  attemptCount: number;
  highestScore: number;
}