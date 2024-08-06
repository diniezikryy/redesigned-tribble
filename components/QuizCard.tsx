// components/QuizCard.tsx
import Link from 'next/link';

interface Quiz {
    id: number;
    title: string;
    num_questions: number;
    time_limit: number | null;
}

interface QuizCardProps {
    quiz: Quiz;
}

export function QuizCard({quiz}: QuizCardProps) {
    return (
        <Link href={`/dashboard/quiz/${quiz.id}`} className="block">
            <div className="border rounded-lg p-4 shadow-md">
                <h2 className="text-xl font-semibold mb-2">{quiz.title}</h2>
                <p>Number of Questions: {quiz.num_questions}</p>
                {/*<p>Time Limit: {quiz.time_limit ? `${quiz.time_limit} minutes` : 'No time limit'}</p>*/}
                <div className="mt-4 flex justify-between">
                    <Link href={`/quiz/${quiz.id}/edit`} className="text-blue-500 hover:underline">
                        Edit Quiz
                    </Link>
                    <Link href={`/quiz/${quiz.id}/attempt`} className="text-green-500 hover:underline">
                        Start Quiz
                    </Link>
                </div>
            </div>
        </Link>
    );
}