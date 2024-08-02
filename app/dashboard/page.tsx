'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {fetchQuizzes} from '@/lib/api'
import {useAuth} from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'

interface Answer {
    id: number;
    text: string;
    is_correct: boolean;
}

interface Question {
    id: number;
    quiz: number;
    text: string;
    question_type: string;
    difficulty: number;
    answers: Answer[];
}

interface Quiz {
    id: number;
    title: string;
    num_questions: number;
    time_limit: number;
    questions: Question[];
}

function Dashboard() {
    const [quizzes, setQuizzes] = useState<Quiz[] | null>(null)
    const router = useRouter()
    const {isAuthenticated, getAccessToken} = useAuth()

    useEffect(() => {
        const fetchData = async () => {
            if (!isAuthenticated) {
                router.push('/login')
                return
            }
            try {
                const token = getAccessToken()
                if (!token) {
                    throw new Error('No access token available')
                }
                const result = await fetchQuizzes(token)
                setQuizzes(result)
            } catch (error) {
                console.error('Failed to fetch quizzes', error)
                router.push('/login')
            }
        }

        fetchData()
    }, [isAuthenticated, router, getAccessToken])

    if (!quizzes) {
        return <p>Loading...</p>
    }

    return (
        <div>
            <h1>Dashboard</h1>
            {quizzes.map((quiz) => (
                <div key={quiz.id} style={{marginBottom: '20px', padding: '10px', border: '1px solid #ccc'}}>
                    <h2>{quiz.title}</h2>
                    <p>Number of Questions: {quiz.num_questions}</p>
                    <p>Time Limit: {quiz.time_limit} minutes</p>
                    {quiz.questions.map((question) => (
                        <div key={question.id} style={{marginBottom: '10px'}}>
                            <h3>{question.text}</h3>
                            <p>Type: {question.question_type}</p>
                            <p>Difficulty: {question.difficulty}</p>
                            <ul>
                                {question.answers.map((answer) => (
                                    <li key={answer.id} style={{color: answer.is_correct ? 'green' : 'red'}}>
                                        {answer.text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <Dashboard/>
        </ProtectedRoute>
    )
}