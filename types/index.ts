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