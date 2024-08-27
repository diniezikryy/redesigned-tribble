'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {fetchQuizzes, fetchAttempts, AttemptOverview, fetchAttemptsOverview} from '@/lib/api'
import withAuth from "@/components/hoc/withAuth"
import {Quiz, QuizAttempt, User} from "@/types";
import Loading from "@/components/Loading";
import {Attempt, columns} from "./columns"
import {DataTable} from "@/app/attempts/data-table";


// export interface QuizAttempt {
//   id: number;
//   user: User;
//   quiz: Quiz;
//   startTime: Date;
//   endTime: Date | null;
//   score: number | null;
// }

// const mockData = [
//     {
//         id: 1,
//         quizTitle: "Test Quiz 1",
//         attempts: 2,
//         highestScore: 100
//     },
//     {
//         id: 2,
//         quizTitle: "Test Quiz 2",
//         attempts: 1,
//         highestScore: 66
//     }
// ]

type AO = AttemptOverview[];

function AttemptsPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [attemptOverview, setAttemptOverview] = useState<AO>([]);

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const [quizzesData, attemptsData] = await Promise.all([
  //         fetchQuizzes(),
  //         fetchAttempts()
  //       ])
  //
  //       setQuizzes(quizzesData)
  //       console.log("Quizzes:", quizzesData)
  //
  //       const processedAttempts = processAttempts(attemptsData, quizzesData)
  //       setAttempts(processedAttempts)
  //       console.log('Processed Attempts:', processedAttempts)
  //     } catch (error) {
  //       console.error('Failed to fetch data', error)
  //       setError('Failed to fetch data. Please try again.')
  //     } finally {
  //       setLoading(false)
  //     }
  //   }
  //
  //   fetchData()
  // }, [])

  // function processAttempts(rawAttempts: any[], quizzes: Quiz[]): Attempt[] {
  //   return rawAttempts.map(attempt => {
  //     const quiz = quizzes.find(q => q.id == attempt.quiz)
  //     return {
  //       id: attempt.id,
  //       quizTitle: quiz?.title || 'Unknown Quiz',
  //       attempts: 1, // This is to be hardcoded, consider if this should be dynamic
  //       highestScore: attempt.score || 0,
  //     }
  //   })
  // }

  useEffect(() => {
    async function fetchData() {
      try {
        const overviewData = await fetchAttemptsOverview()
        setAttemptOverview(overviewData)
        console.log('Attempts Overview:', overviewData)
      } catch (error) {
        console.error('Failed to fetch attempt overview data', error)
        setError('Failed to fetch attempt overview data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <Loading message="Fetching all quizzes & attempt data"/>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div>
      <DataTable columns={columns} data={attemptOverview}/>
    </div>
  )
}

export default withAuth(AttemptsPage)