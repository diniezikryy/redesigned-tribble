'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {fetchQuizzes, fetchAttempts, AttemptOverview, fetchAttemptsOverview} from '@/lib/api'
import withAuth from "@/components/hoc/withAuth"
import {Quiz, QuizAttempt, User} from "@/types";
import Loading from "@/components/Loading";
import {Attempt, columns} from "./columns"
import {DataTable} from "@/app/attempts/data-table";


type AO = AttemptOverview[];

function AttemptsPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [attemptOverview, setAttemptOverview] = useState<AO>([]);

  // TODO - Fetch all the attempts related to the quiz and display them.

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