'use client'

import withAuth from "@/components/hoc/withAuth";
import {useEffect, useState} from "react";
import {fetchQuiz, Quiz} from "@/lib/api";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

interface PageProps {
    params: {
        quiz_id: string
    }
}

function QuizDetailPage({params}: PageProps) {
    const [quiz, setQuiz] = useState<Quiz | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const fetchQuizData = async () => {
        try {
            const result = await fetchQuiz(params.quiz_id)
            setQuiz(result)
        } catch (error) {
            console.error('Failed to fetch quiz', error)
            setError('Failed to fetch quiz. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchQuizData()
    }, [])

    if (loading) {
        return <p>Loading...</p>
    }

    if (error) {
        return <p className="text-red-500">{error}</p>
    }

    console.log(quiz)

    return (
        <div className="">
            <Card className="">
                <CardHeader>
                    <CardTitle>{quiz.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        content
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default withAuth(QuizDetailPage);