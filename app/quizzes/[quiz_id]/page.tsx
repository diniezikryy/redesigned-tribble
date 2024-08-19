'use client'

import withAuth from "@/components/hoc/withAuth";
import {useState, useEffect} from "react";
import {createQuestion, deleteQuiz, fetchQuiz, Quiz} from "@/lib/api";
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
import Loading from "@/components/Loading";
import ErrorAlert from "@/components/ErrorAlert";
import QuestionForm from "@/components/QuestionForm";
import MultiQuestionForm from "@/components/MultiQuestionForm";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";

// These interfaces are well-defined and useful for type checking
export interface Answer {
    id: number;
    text: string;
    is_correct: boolean;
}

export interface Question {
    id: number;
    text: string;
    question_type: 'mcq' | 'short_answer';
    answers: Answer[];
}

export interface Quiz {
    id: number;
    title: string;
    description: string;
    creator: string;
    created_at: string;
    questions: Question[];
}

interface PageProps {
    params: {
        quiz_id: string
    }
}

function QuizDetailPage({params}: PageProps) {
    // State declarations are good and clear
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isAddQuestionDialogOpen, setIsAddQuestionDialogOpen] = useState(false);

    const router = useRouter();

    // Fetch quiz data function
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

    // Use effect to fetch quiz data on component mount
    useEffect(() => {
        fetchQuizData();
    }, []);  // Consider adding params.quiz_id to the dependency array if it can change

    // Handle quiz deletion
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

    // Handle quiz update
    const handleQuizUpdated = async () => {
        await fetchQuizData();
    }

    // Handle adding new questions
    const handleAddQuestions = async (questions: Question[]) => {
        try {
            for (const question of questions) {
                await createQuestion(params.quiz_id, question);
            }
            await fetchQuizData(); // Refresh quiz data
            setIsAddQuestionDialogOpen(false); // Close the dialog
        } catch (error) {
            console.error('Failed to add questions', error);
            setError('Failed to add questions. Please try again.');
        }
    }

    // Loading and error states
    if (loading) {
        return <Loading message="Fetching quiz details"/>;
    }

    if (error) {
        return <ErrorAlert message={error}/>;
    }

    // Main render
    return (
        <main>
            <div className="flex items-center justify-center">
                <h2 className="mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                    {quiz.title}
                </h2>

                <div className="flex ml-auto">
                    {/* Add Question Dialog */}
                    <Dialog open={isAddQuestionDialogOpen} onOpenChange={setIsAddQuestionDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">Add Questions +</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
                            <DialogHeader>
                                <DialogTitle>Add New Questions</DialogTitle>
                            </DialogHeader>
                            <div className="flex-grow overflow-y-auto pr-4">
                                <MultiQuestionForm onSubmit={handleAddQuestions}/>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Button className="ml-2" variant="outline">Attempt Quiz</Button>
                    <EditQuizDialog quiz={quiz} onQuizUpdated={handleQuizUpdated}/>
                    {/* Delete Quiz Dialog */}
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

            {/* Quiz Details Card */}
            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Quiz Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription>{quiz?.description}</CardDescription>
                    <CardDescription>No. of attempts: 3</CardDescription>
                    <CardDescription>Total number of questions: {quiz.questions.length}</CardDescription>
                    <CardDescription>
                        Created at: {new Date(quiz.created_at).toLocaleDateString()}
                    </CardDescription>
                </CardContent>
            </Card>

            {/* Questions List */}
            <div className="mt-4">
                <h2 className="text-2xl font-bold mb-4">Questions</h2>
                {quiz.questions.map((question, index) => (
                    <Card key={question.id} className="mb-4">
                        <CardHeader>
                            <CardTitle>Question {index + 1}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="font-semibold mb-2">{question.text}</p>
                            <p className="text-sm text-gray-500 mb-2">Type: {question.question_type}</p>
                            <ul className="list-disc pl-5">
                                {question.answers.map((answer) => (
                                    <li
                                        key={answer.id}
                                        className={answer.is_correct ? 'text-green-600' : ''}
                                    >
                                        {answer.text} {answer.is_correct &&
                                        <span className="font-bold">(Correct)</span>}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </main>
    )
}

export default withAuth(QuizDetailPage);