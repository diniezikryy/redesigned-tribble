import React, {useState} from 'react';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

interface QuestionData {
    text: string;
    question_type: 'mcq' | 'short_answer';
    answers: {text: string; is_correct: boolean}[];
}

interface QuestionFormProps {
    onSubmit: (questionData: any) => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({onSubmit}) => {
    const [questionText, setQuestionText] = useState('')
    const [questionType, setQuestionType] = useState('mcq')
    const [answers, setAnswers] = useState([{text: '', is_correct: false}])

    const handleAddAnswer = () => {
        setAnswers([...answers, {text: '', is_correct: false}]);
    }

    const handleAnswerChange = (index: number, field: 'text' | 'is_correct', value: string | boolean) => {
        const newAnswers = [...answers];
        if (field === 'text' && typeof value === 'string') {
            newAnswers[index].text = value;
        } else if (field === 'is_correct' && typeof value === 'boolean') {
            newAnswers[index].is_correct = value;
        }
        setAnswers(newAnswers);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({
            text: questionText,
            question_type: questionType,
            answers: answers,
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="question-text">Question Text</Label>
                <Input
                    id="question-text"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    required
                />
            </div>
            <div>
                <Label htmlFor="question-type">Question Type</Label>
                <Select onValueChange={setQuestionType} defaultValue={questionType}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select question type"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="mcq">Multiple Choice</SelectItem>
                        <SelectItem value="short_answer">Short Answer</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {answers.map((answer, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <Input
                        value={answer.text}
                        onChange={(e) => handleAnswerChange(index, 'text', e.target.value)}
                        placeholder={`Answer ${index + 1}`}
                    />
                    <Checkbox
                        checked={answer.is_correct}
                        onCheckedChange={(checked) => handleAnswerChange(index, 'is_correct', checked as boolean)}
                    />
                    <Label>Correct</Label>
                </div>
            ))}
            <Button type="button" variant={"outline"} onClick={handleAddAnswer}>Add Answer</Button>
            <Button type="submit" variant={"outline"}>Create Question</Button>
        </form>
    )
}

export default QuestionForm;