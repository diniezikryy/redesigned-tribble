// columns.tsx

import { ColumnDef } from "@tanstack/react-table"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AttemptOverview } from "@/lib/api";

export const columns: ColumnDef<AttemptOverview>[] = [
    {
        accessorKey: "title",
        header: "Quiz Title",
    },
    {
        accessorKey: "attempt_count",
        header: "Attempts",
    },
    {
        accessorKey: "highest_score",
        header: "Highest Score",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const attempt = row.original;
            const router = useRouter();

            return (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/quizzes/${attempt.id}`);
                    }}
                >
                    Quiz Details
                </Button>
            )
        }
    }
]