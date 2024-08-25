'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import withAuth from "@/components/hoc/withAuth";

interface Question {
  id: number;
  text: string;
  question_type: 'mcq' | 'short_answer';
  answers?: Answer[];
}

interface Answer {
  id: number;
  text: string;
}

// Mock data
const mockQuestions: Question[] = [
  {
    id: 1,
    text: "What is the capital of France?",
    question_type: 'mcq',
    answers: [
      { id: 1, text: "London" },
      { id: 2, text: "Berlin" },
      { id: 3, text: "Paris" },
      { id: 4, text: "Madrid" }
    ]
  },
  {
    id: 2,
    text: "Who painted the Mona Lisa?",
    question_type: 'mcq',
    answers: [
      { id: 5, text: "Vincent van Gogh" },
      { id: 6, text: "Leonardo da Vinci" },
      { id: 7, text: "Pablo Picasso" },
      { id: 8, text: "Michelangelo" }
    ]
  },
  {
    id: 3,
    text: "Briefly explain the concept of photosynthesis.",
    question_type: 'short_answer'
  }
];

function QuizAttemptPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number | string>>({});

  const handleAnswerChange = (questionId: number, answer: number | string) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    console.log("Quiz submitted:", userAnswers);
    // Here you would typically send the data to your backend
  };

  const currentQuestion = mockQuestions[currentQuestionIndex];

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Quiz Attempt</CardTitle>
          <Progress value={(currentQuestionIndex + 1) / mockQuestions.length * 100} className="mt-2" />
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Question {currentQuestionIndex + 1} of {mockQuestions.length}</h2>
          <p className="text-lg mb-6">{currentQuestion.text}</p>

          {currentQuestion.question_type === 'mcq' ? (
            <RadioGroup
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, parseInt(value))}
              value={userAnswers[currentQuestion.id]?.toString()}
              className="space-y-3"
            >
              {currentQuestion.answers?.map((answer) => (
                <div className="flex items-center space-x-2" key={answer.id}>
                  <RadioGroupItem value={answer.id.toString()} id={`answer-${answer.id}`} />
                  <Label htmlFor={`answer-${answer.id}`} className="text-base">{answer.text}</Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <Input
              value={userAnswers[currentQuestion.id] as string || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              placeholder="Type your answer here"
              className="mt-2"
            />
          )}

          <div className="flex justify-between mt-8">
            <Button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              variant="outline"
            >
              Previous
            </Button>
            {currentQuestionIndex < mockQuestions.length - 1 ? (
              <Button onClick={() => setCurrentQuestionIndex(prev => Math.min(mockQuestions.length - 1, prev + 1))}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-green-500 hover:bg-green-600">Submit Quiz</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(QuizAttemptPage);