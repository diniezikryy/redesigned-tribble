'use client'

import withAuth from "@/components/hoc/withAuth";
import {useState, useEffect} from "react";
import {deleteQuiz, fetchQuiz, Quiz} from "@/lib/api";
import {EditQuizDialog} from "@/components/EditQuizDialog";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {useRouter} from 'next/navigation';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PageProps {
    params: {
        quiz_id: string
    }
}

function QuizDetailPage({params}: PageProps) {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const router = useRouter();

    const fetchQuizData = async () => {
        try {
            const result = await fetchQuiz(params.quiz_id);
            setQuiz(result);
        } catch (error) {
            console.error('Failed to fetch quiz', error);
            setError('Failed to fetch quiz. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchQuizData();
    }, []);

    const handleDeleteQuiz = async () => {
        if (!quiz) return;

        try {
            await deleteQuiz(params.quiz_id);
            router.push('/dashboard'); // Redirect to quiz list page after successful deletion
        } catch (error) {
            console.error('Failed to delete quiz', error);
            setError('Failed to delete quiz. Please try again.');
        }
    }

    const handleQuizUpdated = async () => {
        await fetchQuizData();
    }

    if (loading) {
        return <p>Loading...</p>
    }

    if (error) {
        return <p className="text-red-500">{error}</p>
    }

    return (
        <main>
            <div className="flex items-center justify-center">
                <h2 className="mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                    {quiz.title}
                </h2>

                <div className="flex ml-auto">
                    <Button variant="secondary">Add Question +</Button>
                    <Button className="ml-2" variant="outline">Attempt Quiz</Button>
                    <EditQuizDialog quiz={quiz} onQuizUpdated={handleQuizUpdated}/>
                    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <Button className="ml-2" variant="destructive">Delete Quiz</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the quiz
                                    and all associated data.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteQuiz}>
                                    Delete Quiz
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Quiz Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription>{quiz?.description}</CardDescription>
                    <CardDescription>No. of attempts: 3</CardDescription>
                    <CardDescription>Total number of questions: 20</CardDescription>
                    <CardDescription>
                        Created at: {new Date(quiz.created_at).toLocaleDateString()}
                    </CardDescription>
                </CardContent>
            </Card>
        </main>
    )
}

export default withAuth(QuizDetailPage);