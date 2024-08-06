'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { fetchQuizDetails } from '@/lib/api'
import withAuth from "@/components/hoc/withAuth";
import Link from 'next/link';

interface Answer {
    id: number;
    text: string;
    is_correct: boolean;
}

interface Question {
    id: number;
    text: string;
    question_type: string;
    difficulty: number;
    answers: Answer[];
}

interface QuizDetails {
    id: number;
    title: string;
    num_questions: number;
    time_limit: number | null;
    questions: Question[];
}

function QuestionItem({ question, onSave }: { question: Question, onSave: (updatedQuestion: Question) => void }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [editedQuestion, setEditedQuestion] = useState(question);

    const handleSave = () => {
        onSave(editedQuestion);
        setIsExpanded(false);
    };

    return (
        <li className="mb-4 p-4 border rounded bg-gray-800">
            <div className="flex justify-between items-center">
                <p className="font-semibold">{question.text}</p>
                <button onClick={() => setIsExpanded(!isExpanded)} className="text-blue-500">
                    {isExpanded ? '▲' : '▼'}
                </button>
            </div>
            {isExpanded && (
                <div className="mt-2">
                    <input
                        type="text"
                        value={editedQuestion.text}
                        onChange={(e) => setEditedQuestion({...editedQuestion, text: e.target.value})}
                        className="w-full p-2 mb-2 bg-gray-700 text-white"
                    />
                    <p className="text-sm mb-2">
                        Type: {question.question_type},
                        Difficulty: {['Easy', 'Medium', 'Hard'][question.difficulty - 1]}
                    </p>
                    <ul>
                        {editedQuestion.answers.map((answer, index) => (
                            <li key={answer.id} className="flex items-center mb-2">
                                <input
                                    type="radio"
                                    checked={answer.is_correct}
                                    onChange={() => {
                                        const newAnswers = editedQuestion.answers.map(a => ({...a, is_correct: a.id === answer.id}));
                                        setEditedQuestion({...editedQuestion, answers: newAnswers});
                                    }}
                                    className="mr-2"
                                />
                                <input
                                    type="text"
                                    value={answer.text}
                                    onChange={(e) => {
                                        const newAnswers = [...editedQuestion.answers];
                                        newAnswers[index] = {...newAnswers[index], text: e.target.value};
                                        setEditedQuestion({...editedQuestion, answers: newAnswers});
                                    }}
                                    className="flex-grow p-1 bg-gray-700 text-white"
                                />
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleSave} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
                        Save Changes
                    </button>
                </div>
            )}
        </li>
    );
}

function QuizDetailPage({ params }: { params: { quiz_id: string } }) {
    const [quiz, setQuiz] = useState<QuizDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchQuizDetails(params.quiz_id)
                setQuiz(result)
            } catch (error) {
                console.error('Failed to fetch quiz details', error)
                setError('Failed to load quiz details. Please try again.')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [params.quiz_id])

    const handleQuestionSave = async (updatedQuestion: Question) => {
        try {
            await updateQuestion(params.quiz_id, updatedQuestion.id, updatedQuestion);
            setQuiz(prevQuiz => {
                if (!prevQuiz) return null;
                const updatedQuestions = prevQuiz.questions.map(q =>
                    q.id === updatedQuestion.id ? updatedQuestion : q
                );
                return {...prevQuiz, questions: updatedQuestions};
            });
        } catch (error) {
            console.error('Failed to update question', error);
            // Handle error (e.g., show error message to user)
        }
    };

    if (loading) return <div>Loading...</div>
    if (error) return <div>{error}</div>
    if (!quiz) return <div>Quiz not found.</div>

    return (
        <div className="p-4 bg-gray-900 text-white">
            <div className="flex justify-between items-center mb-4">
                <Link href="/dashboard" className="text-blue-500">
                    ← Back to Dashboard
                </Link>
                <div>
                    <button
                        onClick={() => router.push(`#`)}
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    >
                        Add Question
                    </button>
                    <button
                        onClick={() => router.push(`#`)}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        Start Quiz
                    </button>
                </div>
            </div>

            <div className="bg-gray-800 p-4 rounded shadow">
                <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
                <p>Number of Questions: {quiz.num_questions}</p>
                <p>Time Limit: {quiz.time_limit ? `${quiz.time_limit} minutes` : 'No time limit'}</p>

                <h2 className="text-xl font-semibold mt-4 mb-2">Questions:</h2>
                <ul>
                    {quiz.questions.map((question) => (
                        <QuestionItem key={question.id} question={question} onSave={handleQuestionSave} />
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default withAuth(QuizDetailPage);