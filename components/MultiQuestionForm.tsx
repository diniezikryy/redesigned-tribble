/** @format */

// MultiQuestionForm

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Question, Answer } from "@/types";

import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";

type AnswerWithoutId = Omit<Answer, "id">;
type QuestionWithoutId = Omit<Question, "id"> & {
  answers: AnswerWithoutId[];
};

interface MultiQuestionFormProps {
  onSubmit: (questions: QuestionWithoutId[]) => Promise<void>;
}

const MultiQuestionForm: React.FC<MultiQuestionFormProps> = ({ onSubmit }) => {
  const [questions, setQuestions] = useState<QuestionWithoutId[]>([
    {
      text: "",
      question_type: "mcq",
      answers: [{ text: "", is_correct: false }],
    },
  ]);

  const addQuestion = () => {
    const newQuestion: QuestionWithoutId = {
      text: "",
      question_type: "mcq",
      answers: [{ text: "", is_correct: false }],
    };

    setQuestions([...questions, newQuestion]);
  };

  const updateQuestionText = (questionIndex: number, newText: string) => {
    // copy the questions array & update text of specific qn
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].text = newText;

    setQuestions(updatedQuestions);
  };

  const updateQuestionType = (
    questionIndex: number,
    newType: "mcq" | "short_answer"
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].question_type = newType;

    // If changing to short answer, remove all answers except the first one
    if (newType === "short_answer") {
      updatedQuestions[questionIndex].answers = [
        { text: "", is_correct: true },
      ];
    }

    setQuestions(updatedQuestions);
  };

  // Function to add an answer to a question
  const addAnswer = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answers.push({
      text: "",
      is_correct: false,
    });

    setQuestions(updatedQuestions);
  };

  // Function to update the answer in the questions
  const updateAnswerText = (
    questionIndex: number,
    answerIndex: number,
    newText: string
  ) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];

      if (
        updatedQuestions[questionIndex]?.answers &&
        updatedQuestions[questionIndex].answers[answerIndex]
      ) {
        updatedQuestions[questionIndex].answers[answerIndex].text = newText;
      }

      return updatedQuestions;
    });
  };

  // Function to update an answer's correctness
  const updateAnswerCorrectness = (
    questionIndex: number,
    answerIndex: number,
    checked: boolean | "indeterminate"
  ) => {
    console.log("updateAnswerCorrectness called", {
      questionIndex,
      answerIndex,
      checked,
    });
    setQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions.map((question, qIndex) => {
        if (qIndex === questionIndex) {
          const updatedAnswers = question.answers.map((answer, aIndex) => {
            if (aIndex === answerIndex) {
              return { ...answer, is_correct: checked === true };
            }
            // If it's an MCQ, set other answers to false
            return question.question_type === "mcq"
              ? { ...answer, is_correct: false }
              : answer;
          });
          return { ...question, answers: updatedAnswers };
        }
        return question;
      });
      console.log("Updated questions:", updatedQuestions);
      return updatedQuestions;
    });
  };

  // Function to handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(questions);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {questions.map((question, questionIndex) => (
        <Card key={questionIndex}>
          <CardHeader>
            <CardTitle>Question {questionIndex + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Question text input */}
            <div>
              <Label htmlFor={`question-${questionIndex}`}>Question Text</Label>
              <Input
                id={`question-${questionIndex}`}
                value={question.text}
                onChange={(e) =>
                  updateQuestionText(questionIndex, e.target.value)
                }
                required
              />
            </div>

            {/* Question type select */}
            <div>
              <Label htmlFor={`question-type-${questionIndex}`}>
                Question Type
              </Label>
              <Select
                onValueChange={(value: "mcq" | "short_answer") =>
                  updateQuestionType(questionIndex, value)
                }
                value={question.question_type}
              >
                <SelectTrigger id={`question-type-${questionIndex}`}>
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mcq">Multiple Choice</SelectItem>
                  <SelectItem value="short_answer">Short Answer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Answer inputs for multiple choice questions */}
            {question.question_type === "mcq" && (
              <div className="space-y-2">
                <Label>Answers</Label>
                {question.answers?.map((answer, answerIndex) => (
                  <div
                    key={answerIndex}
                    className="flex items-center space-x-2"
                  >
                    <Input
                      value={answer.text}
                      onChange={(e) =>
                        updateAnswerText(
                          questionIndex,
                          answerIndex,
                          e.target.value
                        )
                      }
                      placeholder={`Answer ${answerIndex + 1}`}
                    />
                    <Checkbox.Root
                      checked={answer.is_correct}
                      onCheckedChange={(checked) => {
                        console.log("Checkbox clicked", {
                          questionIndex,
                          answerIndex,
                          checked,
                          currentState: answer.is_correct,
                        });
                        updateAnswerCorrectness(
                          questionIndex,
                          answerIndex,
                          checked as boolean
                        );
                      }}
                      className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                        answer.is_correct ? "bg-blue-500" : "bg-white"
                      }`}
                    >
                      <Checkbox.Indicator>
                        <CheckIcon className="text-white" />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    <Label>Correct</Label>
                  </div>
                ))}
                <Button type="button" onClick={() => addAnswer(questionIndex)}>
                  Add Answer
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      <Button type="button" onClick={addQuestion}>
        Add Another Question
      </Button>
      <Button type="submit">Submit All Questions</Button>
    </form>
  );
};

export default MultiQuestionForm;
