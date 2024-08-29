'use client'

// TODO - Fetch all the quiz and its questions, just a simple list will do, then have a attempt be created.

import React, {useEffect, useState} from "react";
import withAuth from "@/components/hoc/withAuth";
import {fetchAllQuestions, fetchAttemptsOverview} from "@/lib/api";
import {Question, Answer} from "@/types";
import Loading from "@/components/Loading";
import {useRouter} from "next/navigation"

// expanded data table
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  ColumnDef,
  flexRender,
  getPaginationRowModel,
} from '@tanstack/react-table'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {ChevronDown, ChevronUp, ChevronRightIcon, ChevronLeft} from 'lucide-react'
import {Button} from "@/components/ui/button";


interface SimpleExpandableTableProps {
  data: Question[]
}

const SimpleExpandableTable: React.FC<SimpleExpandableTableProps> = ({data}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const columns: ColumnDef<Question>[] = [
    {
      header: 'Question',
      accessorKey: 'text',
    },
    {
      header: 'Type',
      accessorKey: 'question_type',
    },
  ]

  // @ts-ignore
  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows: () => undefined,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10.
      }
    }
  })

  // @ts-ignore
  return (
    <>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <React.Fragment key={row.id}>
              <TableRow className="cursor-pointer hover:bg-gray-100" onClick={() => row.toggleExpanded()}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
                <TableCell className="text-right">
                  {row.getIsExpanded() ?
                    <ChevronUp className="inline-block w-5 h-5 text-gray-500"/> :
                    <ChevronDown className="inline-block w-5 h-5 text-gray-500"/>
                  }
                </TableCell>
              </TableRow>
              {row.getIsExpanded() && (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="bg-gray-800">
                    <div className="px-1">
                      <strong className="text-green-600">Correct
                        Answer:</strong> {row.original.answers.find(a => a.is_correct)?.text}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-4 w-4"/>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRightIcon className="h-4 w-4"/>
        </Button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
      </div>
    </>
  )
}


interface PageProps {
  params: {
    quizId: string
  }
}

function QuizAttemptDetailPage({params}: PageProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter();
  const quizId = parseInt(params.quizId, 10);

  // TODO - Send quiz id for post request to /api/attempts/. then quiz attempt id will be generated
  // TODO - once attempt id is generated, then sent to attempt id page detail.

  useEffect(() => {
    async function fetchData() {
      try {
        const questionsData = await fetchAllQuestions(quizId)
        setQuestions(questionsData)
        console.log('Questions Data: ', questionsData)
      } catch (error) {
        console.error('Failed to fetch questions data', error)
        setError('Failed to fetch questions data. Please try again.')
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
      <div className="flex items-center">
        <div>
          Total number of questions: {questions.length}
        </div>
        <div className="ml-auto">
          <Button variant={"outline"}>Attempt Quiz</Button>
        </div>
      </div>

      <div className="mt-4">
        <SimpleExpandableTable data={questions}/>
      </div>
    </div>
  )
}

export default withAuth(QuizAttemptDetailPage);