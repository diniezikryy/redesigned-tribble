/** @format */

"use client";

import withAuth from "@/components/hoc/withAuth";
import {useState, useEffect} from "react";
import {
  createQuestion,
  deleteQuestion,
  deleteQuiz,
  fetchQuiz,
  generateQuestions,
} from "@/lib/api";
import {Quiz, Question} from "@/types";
import {EditQuizDialog} from "@/components/EditQuizDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
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
import MultiQuestionForm from "@/components/MultiQuestionForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditQuestion from "@/components/EditQuestion";
import FileUploadDialog from "@/components/FileUploadDialog";

interface PageProps {
  params: {
    quizId: string;
  };
}

function QuizDetailPage({params}: PageProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddQuestionDialogOpen, setIsAddQuestionDialogOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(
    null
  );
  const [isFileUploadDialogOpen, setIsFileUploadDialogOpen] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  const router = useRouter();
  const quizId = parseInt(params.quizId, 10);

  const fetchQuizData = async () => {
    try {
      const result = await fetchQuiz(quizId);
      setQuiz(result);
    } catch (error) {
      console.error("Failed to fetch quiz", error);
      setError("Failed to fetch quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizData();
  }, []);

  const handleDeleteQuiz = async () => {
    if (!quiz) return;
    try {
      await deleteQuiz(quizId);
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to delete quiz", error);
      setError("Failed to delete quiz. Please try again.");
    }
  };

  const handleQuizUpdated = async () => {
    await fetchQuizData();
  };

  const handleAddQuestions = async (questions: Omit<Question, "id">[]) => {
    try {
      for (const question of questions) {
        await createQuestion(quizId, question);
      }
      await fetchQuizData();
      setIsAddQuestionDialogOpen(false);
    } catch (error) {
      console.error("Failed to add questions", error);
      setError("Failed to add questions. Please try again.");
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    try {
      await deleteQuestion(quizId, questionId);
      setQuiz((prevQuiz) => {
        if (!prevQuiz) return null;
        return {
          ...prevQuiz,
          questions: prevQuiz.questions.filter((q) => q.id !== questionId),
        };
      });
    } catch (error) {
      console.error("Failed to delete question", error);
      setError("Failed to delete question. Please try again.");
    }
  };

  const handleQuestionUpdated = async () => {
    await fetchQuizData();
    setEditingQuestionId(null);
  };

  const handleFileUpload = async (file: File) => {
    setIsGeneratingQuestions(true);
    try {
      // Add console.log to debug
      console.log('Uploading file for quiz:', quizId);
      
      const generatedQuestions = await generateQuestions(quizId, file);
      console.log("Generated questions:", generatedQuestions);
      
      if (generatedQuestions && generatedQuestions.length > 0) {
        router.push(`/quizzes/${quizId}/review-questions`);
      } else {
        setError("No questions were generated. Please try again.");
      }
    } catch (error) {
      console.error("Error generating questions:", error);
      setError("Failed to generate questions. Please try again.");
    } finally {
      setIsGeneratingQuestions(false);
      setIsFileUploadDialogOpen(false);
    }
  };

  if (loading) {
    return <Loading message="Fetching quiz details"/>;
  }

  if (error) {
    return <ErrorAlert message={error}/>;
  }

  if (!quiz) {
    return <ErrorAlert message={"No quiz data available."}/>;
  }

  return (
    <main>
      {/* Quiz title and action buttons */}
      <div className="flex items-center justify-center">
        <h2 className="mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {quiz.title}
        </h2>

        <div className="flex ml-auto">
          <Button
            variant="outline"
            onClick={() => setIsFileUploadDialogOpen(true)}
          >
            Generate Questions
          </Button>

          <FileUploadDialog
            isOpen={isFileUploadDialogOpen}
            onClose={() => setIsFileUploadDialogOpen(false)}
            onFileUpload={handleFileUpload}
            isLoading={isGeneratingQuestions}
          />

          {/* Add Question Dialog */}
          <Dialog
            open={isAddQuestionDialogOpen}
            onOpenChange={setIsAddQuestionDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline" className="ml-2">
                Add Questions +
              </Button>
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

          <Button className="ml-2" variant="outline">
            Attempt Quiz
          </Button>

          <EditQuizDialog quiz={quiz} onQuizUpdated={handleQuizUpdated}/>

          {/* Delete Quiz Dialog */}
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button className="ml-2" variant="destructive">
                Delete Quiz
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  quiz and all associated data.
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
          <CardDescription>
            Total number of questions: {quiz.questions.length}
          </CardDescription>
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
              <CardTitle className="flex justify-between items-center">
                <span>Question {index + 1}</span>
                <div>
                  {editingQuestionId === question.id ? (
                    <Button
                      variant="outline"
                      onClick={() => setEditingQuestionId(null)}
                    >
                      Cancel Edit
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setEditingQuestionId(question.id)}
                    >
                      Edit Question
                    </Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="ml-2">
                        Delete Question
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the question and all its
                          answers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteQuestion(question.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editingQuestionId === question.id ? (
                <EditQuestion
                  quizId={quizId}
                  questionId={question.id}
                  onQuestionUpdated={handleQuestionUpdated}
                />
              ) : (
                <>
                  <p className="font-semibold mb-2">{question.text}</p>
                  <p className="text-sm text-gray-500 mb-2">
                    Type: {question.question_type}
                  </p>
                  <ul className="list-disc pl-5">
                    {question.answers?.map((answer) => (
                      <li
                        key={answer.id}
                        className={`flex justify-between items-center ${
                          answer.is_correct ? "text-green-600" : ""
                        }`}
                      >
                        <span>
                          {answer.text}{" "}
                          {answer.is_correct && (
                            <span className="font-bold">(Correct)</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}

export default withAuth(QuizDetailPage);
