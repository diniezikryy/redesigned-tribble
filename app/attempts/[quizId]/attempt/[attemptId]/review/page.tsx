'use client'

import React, {useEffect, useState} from "react";
import withAuth from "@/components/hoc/withAuth";
import {fetchAttemptResult} from "@/lib/api";
import {AttemptResult} from "@/types";
import Loading from "@/components/Loading";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

interface PageProps {
  params: {
    attemptId: string
  }
}

function AttemptReviewPage({params}: PageProps) {
  const [attemptData, setAttemptData] = useState<AttemptResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const attemptId = parseInt(params.attemptId, 10);

  useEffect(() => {
    async function loadAttemptData() {
      try {
        const data = await fetchAttemptResult(attemptId);
        console.log(data);
        setAttemptData(data);
      } catch (err) {
        setError('Failed to load attempt data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadAttemptData();
  }, [attemptId]);

  if (loading) return <Loading message="Loading attempt review..."/>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!attemptData) return <div>No data available for this attempt</div>;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Attempt Review</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Quiz Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Your Score:</p>
              <p className="text-2xl font-bold text-blue-600">{attemptData.score.toFixed(2)}%</p>
            </div>
            <div>
              <p className="font-semibold">Quiz ID:</p>
              <p>{attemptData.quiz}</p>
            </div>
            <div>
              <p className="font-semibold">Start Time:</p>
              <p>{new Date(attemptData.start_time).toLocaleString()}</p>
            </div>
            <div>
              <p className="font-semibold">End Time:</p>
              <p>{new Date(attemptData.end_time).toLocaleString()}</p>
            </div>
            <div>
              <p className="font-semibold">Correct Answers:</p>
              <p>{attemptData.correct_answers} / {attemptData.total_questions}</p>
            </div>
            <div>
              <p className="font-semibold">Incorrect Answers:</p>
              <p>{attemptData.incorrect_answers} / {attemptData.total_questions}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Detailed Results</h2>

      {attemptData.user_answers.map((answer, index) => (
        <Card key={answer.id} className={`mb-4 ${answer.is_correct ? 'bg-green-50' : 'bg-red-50'}`}>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Question {index + 1}: {answer.question_text}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">
              <span className="font-semibold text-gray-700">Your answer: </span>
              <span className={answer.is_correct ? "text-green-600" : "text-red-600"}>
        {answer.selected_answer_text}
      </span>
            </p>
            {!answer.is_correct && (
              <p>
                <span className="font-semibold text-gray-700">Correct answer: </span>
                <span className="text-green-600">{answer.correct_answer_text}</span>
              </p>
            )}
          </CardContent>
        </Card>
      ))}

      <Button onClick={() => router.push('/dashboard')} className="mt-6">
        Back to Quizzes
      </Button>
    </div>
  );
}

export default withAuth(AttemptReviewPage);