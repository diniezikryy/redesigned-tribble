'use client'

import { useParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { fetchTempQuestionsByQuiz, addSelectedQuestions } from '@/lib/api';
import { Question } from '@/types';

interface TempAnswer {
  id: number;
  text: string;
  is_correct: boolean;
}

interface TempQuestion extends Question {
  temp_answers: TempAnswer[];
}

const TempQuestionsReview = () => {
  const params = useParams();
  const router = useRouter();
  const quizId = parseInt(params.quizId as string);

  const [questions, setQuestions] = useState<TempQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const currentQuestion = questions[currentQuestionIndex] || null;
  
  useEffect(() => {
    const loadQuestions = async () => {
      if (!quizId) return;

      try {
        console.log('Loading questions for quiz:', quizId);
        const data = await fetchTempQuestionsByQuiz(quizId);
        console.log('Received data:', data);
        
        if (data && (Array.isArray(data.questions) || Array.isArray(data))) {
          const questionsList = Array.isArray(data) ? data : data.questions;
          setQuestions(questionsList);
        } else {
          console.error('Unexpected data format:', data);
          toast.error('Invalid data format received');
        }
      } catch (error) {
        console.error('Error loading questions:', error);
        toast.error('Failed to load questions');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadQuestions();
  }, [quizId]);

  const handleQuestionSelect = (questionId: number) => {
    setSelectedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitSelected = async () => {
    if (selectedQuestions.size === 0) {
      toast.error('Please select at least one question');
      return;
    }

    setIsSubmitting(true);
    try {
      await addSelectedQuestions(quizId, Array.from(selectedQuestions));
      toast.success('Questions added successfully');
      // Redirect back to quiz detail page
      router.push(`/quizzes/${quizId}`);
    } catch (error) {
      console.error('Error adding questions:', error);
      toast.error('Failed to add selected questions');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!quizId) {
    return (
      <div className="text-center py-8">
        <p>Invalid quiz ID</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No questions available for review.</p>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="text-center py-8">
        <p>No question data available.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Question Review</h1>
          <Badge variant="outline">
            {currentQuestionIndex + 1} of {questions.length}
          </Badge>
        </div>
        <Button 
          onClick={handleSubmitSelected}
          disabled={selectedQuestions.size === 0 || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding Questions...
            </>
          ) : (
            `Add Selected (${selectedQuestions.size})`
          )}
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center space-x-4">
          <Checkbox
            checked={selectedQuestions.has(currentQuestion.id)}
            onCheckedChange={() => handleQuestionSelect(currentQuestion.id)}
            id={`question-${currentQuestion.id}`}
          />
          <CardTitle className="text-xl flex-1">
            {currentQuestion.text}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentQuestion.temp_answers?.map((answer) => (
              <div
                key={answer.id}
                className={`p-4 rounded-lg border ${
                  answer.is_correct
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-1">
                    <p className={`font-medium ${
                      answer.is_correct ? 'text-green-700' : 'text-gray-700'
                    }`}>
                      {answer.text}
                    </p>
                  </div>
                  {answer.is_correct && (
                    <Badge className="ml-2 bg-green-100 text-green-800">
                      Correct Answer
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <Button
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
          variant="outline"
          className="flex items-center"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex space-x-1">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-3 h-3 rounded-full ${
                currentQuestionIndex === index
                  ? 'bg-primary'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={goToNextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
          variant="outline"
          className="flex items-center"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default TempQuestionsReview;