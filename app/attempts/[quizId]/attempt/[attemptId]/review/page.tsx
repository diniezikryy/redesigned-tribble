'use client'

import React, { useEffect, useState } from "react";
import withAuth from "@/components/hoc/withAuth";
import { fetchAttemptResult } from "@/lib/api";
import { AttemptResult } from "@/types";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: {
    attemptId: string
  }
}

function AttemptReviewPage({ params }: PageProps) {
  const [attemptData, setAttemptData] = useState<AttemptResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const attemptId = parseInt(params.attemptId, 10);

  useEffect(() => {
    async function loadAttemptData() {
      try {
        const data = await fetchAttemptResult(attemptId);
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

  if (loading) return <Loading message="Loading attempt review..." />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!attemptData) return <div>No data available for this attempt</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Attempt Review</h1>
      <div className="mb-6">
        <p className="text-xl">Your Score: {attemptData.score.toFixed(2)}%</p>
        <p>Quiz ID: {attemptData.quiz}</p>
        <p>Start Time: {new Date(attemptData.start_time).toLocaleString()}</p>
        <p>End Time: {new Date(attemptData.end_time).toLocaleString()}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Your Answers:</h2>
        {attemptData.user_answers.map((answer, index) => (
          <div key={index} className="mb-4 p-4 border rounded">
            <p className="font-semibold">Question {index + 1}</p>
            <p>Your answer: {answer.selected_answer}</p>
          </div>
        ))}
      </div>

      <Button onClick={() => router.push('/dashboard')}>Back to Quizzes</Button>
    </div>
  );
}

export default withAuth(AttemptReviewPage);