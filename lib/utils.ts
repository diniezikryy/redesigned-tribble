import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {Attempt} from "@/app/attempts/columns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const transformAttemptData = (attempt: any): Attempt => ({
    id: attempt.id,
    quiz: attempt.quiz,
    user: attempt.user,
    startTime: attempt.start_time,
    endTime: attempt.end_time,
    score: attempt.score,
    userAnswers: attempt.user_answers.map((userAnswer: any) => ({
        id: userAnswer.id,
        question: userAnswer.question,
        selectedAnswer: userAnswer.selected_answer,
        textAnswer: userAnswer.text_answer,
    })),
});
