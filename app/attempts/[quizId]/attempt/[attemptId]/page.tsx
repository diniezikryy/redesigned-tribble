'use client'

import React, {useEffect, useState} from "react";
import withAuth from "@/components/hoc/withAuth";
import {Question} from "@/types";
import {Button} from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"
import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"

const QuestionAttempt: React.FC<{
  question: Question;
  onAnswerChange: (questionId: number, answerId: number) => void;
  selectedAnswerId: number | null;
}> = ({ question, onAnswerChange, selectedAnswerId }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{question.text}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          onValueChange={(value) => onAnswerChange(question.id, parseInt(value))}
          value={selectedAnswerId?.toString()}
        >
          {question.answers.map((answer) => (
            <div key={answer.id} className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value={answer.id.toString()} id={`answer-${answer.id}`} />
              <Label htmlFor={`answer-${answer.id}`}>{answer.text}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

interface PageProps {
  params: {
    attemptId: string
  }
}

const mockQuestionData = [
  {
    id: 1,
    text: "What is the primary purpose of a web server?",
    question_type: "mcq",
    answers: [
      {
        id: 1,
        text: "To store files",
        is_correct: false,
      },
      {
        id: 2,
        text: "To execute JavaScript",
        is_correct: false,
      },
      {
        id: 3,
        text: "To serve web pages to clients",
        is_correct: true,
      },
      {
        id: 4,
        text: "To manage databases",
        is_correct: false,
      },
    ]
  },
  {
    id: 2,
    text: "Which of the following is not a programming language?",
    question_type: "mcq",
    answers: [
      {
        id: 5,
        text: "Python",
        is_correct: false,
      },
      {
        id: 6,
        text: "JavaScript",
        is_correct: false,
      },
      {
        id: 7,
        text: "HTML",
        is_correct: true,
      },
      {
        id: 8,
        text: "Ruby",
        is_correct: false,
      },
    ]
  },
  {
    id: 3,
    text: "What does 'CSS' stand for in web development?",
    question_type: "mcq",
    answers: [
      {
        id: 9,
        text: "Computer Style Sheets",
        is_correct: false,
      },
      {
        id: 10,
        text: "Cascading Style Sheets",
        is_correct: true,
      },
      {
        id: 11,
        text: "Creative Style Sheets",
        is_correct: false,
      },
      {
        id: 12,
        text: "Colorful Style Sheets",
        is_correct: false,
      },
    ]
  }
]

function AttemptPage({params}: PageProps) {
  const [questions, setQuestionData] = useState<Question[]>(mockQuestionData);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const attemptId = parseInt(params.attemptId, 10);

  const handleAnswerChange = (questionId: number, answerId: number) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answerId }));
  };

  const handleSubmit = () => {
    const formattedAnswers = {
      answers: Object.entries(userAnswers).map(([questionId, answerId]) => ({
        question: parseInt(questionId),
        selected_answer: answerId
      }))
    };
    console.log("Submitting answers:", formattedAnswers);
    // Here you would send formattedAnswers to your API
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quiz Attempt</h1>
      {questions.map((question) => (
        <QuestionAttempt
          key={question.id}
          question={question}
          onAnswerChange={handleAnswerChange}
          selectedAnswerId={userAnswers[question.id] || null}
        />
      ))}
      <Button onClick={handleSubmit} className="mt-4">Submit Answers</Button>
    </div>
  );
}

export default withAuth(AttemptPage);