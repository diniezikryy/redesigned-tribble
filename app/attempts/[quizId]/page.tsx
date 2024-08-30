'use client'

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {format} from "date-fns";
import withAuth from "@/components/hoc/withAuth";
import {createAttempt, fetchAllQuestions, fetchAttemptsByQuiz} from "@/lib/api";
import {Question, AttemptResult} from "@/types";
import Loading from "@/components/Loading";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {ChevronUpIcon, ChevronDownIcon} from "lucide-react";

interface PageProps {
  params: {
    quizId: string;
  };
}

type SortField = 'date' | 'score';
type SortOrder = 'asc' | 'desc';

function QuizAttemptDetailPage({params}: PageProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attempts, setAttempts] = useState<AttemptResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [questionsExpanded, setQuestionsExpanded] = useState<boolean>(false);


  const router = useRouter();
  const quizId = parseInt(params.quizId, 10);

  useEffect(() => {
    async function fetchData() {
      try {
        const [questionsData, attemptsData] = await Promise.all([
          fetchAllQuestions(quizId),
          fetchAttemptsByQuiz(quizId),
        ]);

        setQuestions(questionsData);
        setAttempts(attemptsData);
      } catch (error) {
        console.error('Failed to fetch data', error);
        setError('Failed to fetch data. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [quizId]);

  const handleAttemptQuiz = async () => {
    try {
      setLoading(true);
      const attemptData = await createAttempt(quizId);
      router.push(`/attempts/${quizId}/attempt/${attemptData.id}`);
    } catch (error) {
      console.error('Failed to create attempt:', error);
      setError('Failed to start quiz attempt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedAttempts = [...attempts].sort((a, b) => {
    if (sortField === 'date') {
      return sortOrder === 'asc'
        ? new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        : new Date(b.start_time).getTime() - new Date(a.start_time).getTime();
    } else {
      return sortOrder === 'asc' ? a.score - b.score : b.score - a.score;
    }
  });

  function calculateDuration(startTime: string, endTime: string): string {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const durationMs = end - start;
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  if (loading) return <Loading message="Fetching quiz data..."/>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Quiz Attempt Details</h1>

        {/* Attempt Quiz Button */}
        <div>
          <Button onClick={handleAttemptQuiz} disabled={loading}>
            {loading ? 'Creating Attempt...' : 'Attempt Quiz'}
          </Button>
        </div>
      </div>


      {/* Questions Section */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Questions</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuestionsExpanded(!questionsExpanded)}
            >
              {questionsExpanded ? 'Collapse' : 'Expand'}
              {questionsExpanded ? <ChevronUpIcon className="ml-2 h-4 w-4"/> :
                <ChevronDownIcon className="ml-2 h-4 w-4"/>}
            </Button>
          </div>
        </CardHeader>
        {questionsExpanded && (
          <CardContent>
            {questions.map((question, index) => (
              <div key={question.id} className="mb-4 p-4 border rounded">
                <p className="font-semibold">{index + 1}. {question.text}</p>
                <div className="mt-2">
                  Correct Answer:
                  <span>
                    <Badge variant="outline" className="ml-2">
                      {question.answers.find(a => a.is_correct)?.text}
                    </Badge>
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        )}
      </Card>

      {/* Attempts Section */}
      <Card>
        <CardHeader>
          <CardTitle>Previous Attempts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort('date')} className="cursor-pointer">
                  Date {sortField === 'date' && (sortOrder === 'asc' ? <ChevronUpIcon className="inline"/> :
                  <ChevronDownIcon className="inline"/>)}
                </TableHead>
                <TableHead onClick={() => handleSort('score')} className="cursor-pointer">
                  Score {sortField === 'score' && (sortOrder === 'asc' ? <ChevronUpIcon className="inline"/> :
                  <ChevronDownIcon className="inline"/>)}
                </TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAttempts.map((attempt) => (
                <TableRow key={attempt.id}>
                  <TableCell>{format(new Date(attempt.start_time), "PPpp")}</TableCell>
                  <TableCell>{(attempt.score).toFixed(2)}%</TableCell>
                  <TableCell>
                    {calculateDuration(attempt.start_time, attempt.end_time)}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => {
                      router.push(`/attempts/${quizId}/attempt/${attempt.id}/review`);
                    }}>View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(QuizAttemptDetailPage);