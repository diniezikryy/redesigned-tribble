import React, {useState} from 'react';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";
import {Question, Answer} from '@/types';

interface EditQuestionFormProps {
    question: Question;
    onSubmit: (updatedQuestion: Question) => void;
}

const EditQuestionForm: React.FC<EditQuestionFormProps> = ({question, onSubmit}) => {
    const [questionText, setQuestionText] = useState(question.text);
    const [questionType, setQuestionType] = useState(question.question_type);
    const [answers, setAnswers] = useState<Answer[]>(question.answers || []);

    const handleAddAnswer = () => {
        const newAnswer = {id: -Date.now(), text: '', is_correct: false};
        setAnswers([...answers, newAnswer]);
    };

    const handleAnswerChange = (index: number, field: keyof Answer, value: string | boolean) => {
        // create a new copy of the answers array and update the specific field of the answer at the given index
        const newAnswers = [...answers];
        newAnswers[index] = {...newAnswers[index], [field]: value};

        setAnswers(newAnswers);
    };

    const handleDeleteAnswer = (index: number) => {
        const newAnswers = answers.filter((_, i) => i !== index);

        setAnswers(newAnswers);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // creates a new object with all the updated question information
        const updatedQuestion = {
            ...question,
            text: questionText,
            question_type: questionType,
            answers: answers.map(answer => ({
                ...answer,
                // If it's a new answer (negative id), remove the id so the backend can create a new one
                id: answer.id !== undefined ? answer.id : -1, // Provide a default value of -1
            }))
        }

        onSubmit(updatedQuestion);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Question Text Input */}
            <div>
                <Label htmlFor="question-text">Question Text</Label>
                <Input
                    id="question-text"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    required
                />
            </div>

            {/* Question Type Select */}
            <div>
                <Label htmlFor="question-type">Question Type</Label>
                <Select onValueChange={(value) => setQuestionType(value as 'mcq' | 'short_answer')}
                        value={questionType}>
                    <SelectTrigger id="question-type">
                        <SelectValue placeholder="Select question type"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="mcq">Multiple Choice</SelectItem>
                        <SelectItem value="short_answer">Short Answer</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Answers Section (only for multiple choice questions) */}
            {questionType === 'mcq' && (
                <div className="space-y-2">
                    <Label>Answers</Label>
                    {answers.map((answer, index) => (
                        <div key={answer.id} className="flex items-center space-x-2">
                            {/* Answer Text Input */}
                            <Input
                                value={answer.text}
                                onChange={(e) => handleAnswerChange(index, 'text', e.target.value)}
                                placeholder={`Answer ${index + 1}`}
                            />
                            {/* Is Correct Checkbox */}
                            <Checkbox
                                checked={answer.is_correct}
                                onCheckedChange={(checked) => handleAnswerChange(index, 'is_correct', !!checked)}
                            />
                            <Label>Correct</Label>
                            {/* Delete Answer Button */}
                            <Button type="button" onClick={() => handleDeleteAnswer(index)}>Delete</Button>
                        </div>
                    ))}
                    {/* Add New Answer Button */}
                    <Button type="button" onClick={handleAddAnswer}>Add Answer</Button>
                </div>
            )}

            {/* Submit Button */}
            <Button type="submit">Update Question</Button>
        </form>
    );
};

export default EditQuestionForm;