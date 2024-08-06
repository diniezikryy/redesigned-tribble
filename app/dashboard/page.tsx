'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {fetchQuizzes, logout} from '@/lib/api'
import withAuth from "@/components/hoc/withAuth";
import Link from 'next/link';
import {QuizCard} from "@/components/QuizCard";

interface Quiz {
    id: number;
    title: string;
    num_questions: number;
    time_limit: number;
}

function DashboardPage() {
    const [quizzes, setQuizzes] = useState<Quiz[] | null>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchQuizzes()
                setQuizzes(result)
            } catch (error) {
                console.error('Failed to fetch quizzes', error)
                router.push('/login')
            }
        }

        fetchData()
    }, [router])

    const handleLogout = async () => {
        try {
            await logout()
            router.push('/login')
        } catch (error) {
            console.error('Logout failed', error)
        }
    }

    if (!quizzes) {
        return <p>Loading...</p>
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div>
                    <Link href="/create-quiz" className="bg-green-500 text-white px-4 py-2 rounded mr-2">
                        Create Quiz
                    </Link>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quizzes.map((quiz) => (
                    <QuizCard key={quiz.id} quiz={quiz}/>
                ))}
            </div>
        </div>
    )
}

export default withAuth(DashboardPage);