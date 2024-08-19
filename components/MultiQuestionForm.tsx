import React, {useState} from 'react';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

interface Question {
    text: string;
    question_type: 'mcq' | 'short_answer';
    answers: { text: string; is_correct: boolean }[];
}

interface MultiQuestionFormProps {
    onSubmit: (questions: Question[]) => void;
}

const MultiQuestionForm: React.FC<MultiQuestionFormProps> = ({onSubmit}) => {
    const [questions, setQuestions] = useState<Question[]>([{
        text: '',
        question_type: 'mcq',
        answers: [{text: '', is_correct: false}]
    }]);

    const addQuestion = () => {
        const newQuestion: Question = {
            text: '',
            question_type: 'mcq',
            answers: [{text: '', is_correct: false}]
        };

        setQuestions([...questions, newQuestion]);
    }

    const updateQuestionText = (questionIndex: number, newText: string) => {
        // copy the questions array & update text of specific qn
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].text = newText;

        setQuestions(updatedQuestions);
    };

    const updateQuestionType = (questionIndex: number, newType: 'mcq' | 'short_answer') => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].question_type = newType;

        // If changing to short answer, remove all answers except the first one
        if (newType === 'short_answer') {
            updatedQuestions[questionIndex].answers = [{text: '', is_correct: true}];
        }

        setQuestions(updatedQuestions);
    };

    // Function to add an answer to a question
    const addAnswer = (questionIndex: number) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].answers.push({text: '', is_correct: false});

        setQuestions(updatedQuestions);
    };

    const updateAnswerText = (questionIndex: number, answerIndex: number, newText: string) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].answers[answerIndex].text = newText;

        setQuestions(updatedQuestions);
    }

    // Function to update an answer's correctness
    const updateAnswerCorrectness = (questionIndex: number, answerIndex: number, is_correct: boolean) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].answers[answerIndex].is_correct = is_correct;

        setQuestions(updatedQuestions);
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
                                onChange={(e) => updateQuestionText(questionIndex, e.target.value)}
                                required
                            />
                        </div>

                        {/* Question type select */}
                        <div>
                            <Label htmlFor={`question-type-${questionIndex}`}>Question Type</Label>
                            <Select
                                onValueChange={(value: 'mcq' | 'short_answer') => updateQuestionType(questionIndex, value)}
                                value={question.question_type}
                            >
                                <SelectTrigger id={`question-type-${questionIndex}`}>
                                    <SelectValue placeholder="Select question type"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mcq">Multiple Choice</SelectItem>
                                    <SelectItem value="short_answer">Short Answer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Answer inputs for multiple choice questions */}
                        {question.question_type === 'mcq' && (
                            <div className="space-y-2">
                                <Label>Answers</Label>
                                {question.answers.map((answer, answerIndex) => (
                                    <div key={answerIndex} className="flex items-center space-x-2">
                                        <Input
                                            value={answer.text}
                                            onChange={(e) => updateAnswerText(questionIndex, answerIndex, e.target.value)}
                                            placeholder={`Answer ${answerIndex + 1}`}
                                        />
                                        <Checkbox
                                            checked={answer.is_correct}
                                            onCheckedChange={(checked) => updateAnswerCorrectness(questionIndex, answerIndex, checked as boolean)}
                                        />
                                        <Label>Correct</Label>
                                    </div>
                                ))}
                                <Button type="button" onClick={() => addAnswer(questionIndex)}>Add Answer</Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
            <Button type="button" onClick={addQuestion}>Add Another Question</Button>
            <Button type="submit">Submit All Questions</Button>
        </form>
    );
}

export default MultiQuestionForm;