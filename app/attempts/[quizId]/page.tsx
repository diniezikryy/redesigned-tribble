'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

// Types based on your models
interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  creator: number; // User ID
  created_at: string;
  category: Category | null;
  tags: Tag[];
  difficulty: 'not_specified' | 'easy' | 'medium' | 'hard';
  time_limit: number | null;
}

interface Question {
  id: number;
  quiz: number; // Quiz ID
  text: string;
  question_type: 'mcq' | 'short_answer';
}

interface Answer {
  id: number;
  question: number; // Question ID
  text: string;
  is_correct: boolean;
}

// Mock data
const mockQuiz: Quiz = {
  id: 1,
  title: "General Knowledge Quiz",
  description: "Test your knowledge on various topics",
  creator: 1, // Assuming creator with ID 1
  created_at: "2024-08-26T12:00:00Z",
  category: { id: 1, name: "General Knowledge" },
  tags: [{ id: 1, name: "Trivia" }, { id: 2, name: "Mixed" }],
  difficulty: 'medium',
  time_limit: 15 // 15 minutes
};

const mockQuestions: Question[] = [
  {
    id: 1,
    quiz: 1,
    text: "What is the capital of France?",
    question_type: 'mcq',
  },
  {
    id: 2,
    quiz: 1,
    text: "Who painted the Mona Lisa?",
    question_type: 'mcq',
  },
  {
    id: 3,
    quiz: 1,
    text: "Briefly explain the concept of photosynthesis.",
    question_type: 'short_answer',
  }
];

const mockAnswers: Answer[] = [
  { id: 1, question: 1, text: "London", is_correct: false },
  { id: 2, question: 1, text: "Berlin", is_correct: false },
  { id: 3, question: 1, text: "Paris", is_correct: true },
  { id: 4, question: 1, text: "Madrid", is_correct: false },
  { id: 5, question: 2, text: "Vincent van Gogh", is_correct: false },
  { id: 6, question: 2, text: "Leonardo da Vinci", is_correct: true },
  { id: 7, question: 2, text: "Pablo Picasso", is_correct: false },
  { id: 8, question: 2, text: "Michelangelo", is_correct: false },
];

const QuizAttemptPage: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number | string>>({});

  const handleAnswerChange = (questionId: number, answer: number | string) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    // Here you would typically send the answers to your API
    console.log("Quiz submitted:", userAnswers);
  };

  const currentQuestion = mockQuestions[currentQuestionIndex];
  const questionAnswers = mockAnswers.filter(a => a.question === currentQuestion.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{mockQuiz.title}</CardTitle>
          <CardDescription>{mockQuiz.description}</CardDescription>
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>Difficulty: {mockQuiz.difficulty}</span>
            {mockQuiz.time_limit && <span>Time Limit: {mockQuiz.time_limit} minutes</span>}
          </div>
          <Progress value={(currentQuestionIndex + 1) / mockQuestions.length * 100} className="mt-4" />
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Question {currentQuestionIndex + 1} of {mockQuestions.length}</h2>
          <p className="mb-4">{currentQuestion.text}</p>

          {currentQuestion.question_type === 'mcq' ? (
            <RadioGroup
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, parseInt(value))}
              value={userAnswers[currentQuestion.id]?.toString()}
            >
              {questionAnswers.map((answer) => (
                <div className="flex items-center space-x-2 mb-2" key={answer.id}>
                  <RadioGroupItem value={answer.id.toString()} id={`answer-${answer.id}`} />
                  <Label htmlFor={`answer-${answer.id}`}>{answer.text}</Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <Input
              value={userAnswers[currentQuestion.id] as string || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              placeholder="Type your answer here"
            />
          )}

          <div className="flex justify-between mt-6">
            <Button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            {currentQuestionIndex < mockQuestions.length - 1 ? (
              <Button onClick={handleNextQuestion}>Next</Button>
            ) : (
              <Button onClick={handleSubmitQuiz}>Submit Quiz</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizAttemptPage;