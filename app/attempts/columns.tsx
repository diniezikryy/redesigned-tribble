"use client"

import {ColumnDef} from "@tanstack/react-table"
import {MoreHorizontal} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {AttemptOverview} from "@/lib/api";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export type Attempt = {
    id: number;
    quizTitle: string;
    attempts: number;
    highestScore: number;
};

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
        cell: ({row}) => {
            const attempt = row.original;
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const router = useRouter();

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={() => router.push(`/quizzes/`)}>Go to quiz</DropdownMenuItem>
                        {/*TODO - Attempt Quiz functionality.*/}
                        <DropdownMenuItem>Attempt Quiz</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]


