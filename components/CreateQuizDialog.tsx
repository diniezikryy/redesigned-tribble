import { useState } from 'react'
import { useForm } from "react-hook-form"
import { createQuiz } from '@/lib/api'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {useRouter} from "next/navigation";

interface FormData {
    title: string
    description: string
}

export function CreateQuizDialog({ onQuizCreated }: { onQuizCreated: () => void }) {
    const [error, setError] = useState<string | null>(null)
    const router = useRouter();

    const form = useForm<FormData>({
        defaultValues: {
            title: "",
            description: "",
        },
    })

    const handleCreateQuiz = async (data: FormData) => {
        try {
            const newQuiz = await createQuiz(data)
            form.reset()
            onQuizCreated()
            router.push(`/quizzes/${newQuiz.id}`)
        } catch (error) {
            console.error('Failed to create quiz', error)
            setError('Failed to create quiz. Please try again.')
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Create Quiz +</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create new quiz</DialogTitle>
                    <DialogDescription>Create a new quiz, add questions later</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleCreateQuiz)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Quiz Title" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Quiz description" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        {error && <p className="text-red-500">{error}</p>}
                        <DialogClose asChild>
                            <Button type="submit">Create Quiz</Button>
                        </DialogClose>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}