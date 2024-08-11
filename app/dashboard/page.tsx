'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {fetchQuizzes} from '@/lib/api'
import withAuth from "@/components/hoc/withAuth"
import {CreateQuizDialog} from "@/components/CreateQuizDialog"  // Import the new component
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"

interface Quiz {
    id: number;
    title: string;
    description: string;
    created_at: string;
}

function DashboardPage() {
    const [quizzes, setQuizzes] = useState<Quiz[] | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const fetchQuizzesData = async () => {
        try {
            const result = await fetchQuizzes()
            setQuizzes(result)
        } catch (error) {
            console.error('Failed to fetch quizzes', error)
            setError('Failed to fetch quizzes. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchQuizzesData()
    }, [])

    const handleQuizCreated = () => {
        fetchQuizzesData()  // Refetch quizzes after a new one is created
    }

    if (loading) {
        return <p>Loading...</p>
    }

    if (error) {
        return <p className="text-red-500">{error}</p>
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center">
                <CreateQuizDialog onQuizCreated={handleQuizCreated}/>
            </div>

            <div className="mt-4">
                {quizzes && quizzes.length > 0 ? (
                    <ul>
                        {quizzes.map((quiz) => (
                            <Card key={quiz.id} className="mb-2">
                                <CardHeader>
                                    <CardTitle>{quiz.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>{quiz.description}</CardDescription>
                                    <CardDescription>
                                        Created at: {new Date(quiz.created_at).toLocaleDateString()}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </ul>
                ) : (
                    <p>No quizzes available. Create your first quiz!</p>
                )}
            </div>
        </div>
    )
}

export default withAuth(DashboardPage);