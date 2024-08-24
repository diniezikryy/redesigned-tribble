import { useState } from 'react'
import { useForm } from "react-hook-form"
import { updateQuiz } from '@/lib/api'
import { Button } from "@/components/ui/button"
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {Quiz} from "@/types"

interface FormData {
    title: string
    description: string
}

interface EditQuizDialogProps {
    quiz: Quiz,
    onQuizUpdated: () => void;
}

export function EditQuizDialog({ quiz, onQuizUpdated }: EditQuizDialogProps) {
    const [error, setError] = useState<string | null>(null)

    const form = useForm<FormData>({
        defaultValues: {
            title: quiz.title,
            description: quiz.description,
        },
    })

    const handleUpdateQuiz = async (data: FormData) => {
        try {
            await updateQuiz(quiz.id, data)
            onQuizUpdated()
        } catch (error) {
            console.error('Failed to update quiz', error)
            setError('Failed to update quiz. Please try again.')
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="ml-2" variant="outline">Edit Quiz</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit quiz</DialogTitle>
                    <DialogDescription>Make changes to your quiz here.</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleUpdateQuiz)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
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
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        {error && <p className="text-red-500">{error}</p>}
                        <DialogClose asChild>
                            <Button type="submit">Update Quiz</Button>
                        </DialogClose>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}