import React, { useState, useEffect } from 'react';
import { fetchQuestion, updateQuestion } from '@/lib/api';
import EditQuestionForm from './EditQuestionForm';
import { useToast } from '@/components/ui/use-toast';
import { Question } from '@/lib/api';  // Import the Question type

interface EditQuestionProps {
  quizId: string;
  questionId: number;
  onQuestionUpdated: () => void;
}

const EditQuestion: React.FC<EditQuestionProps> = ({ quizId, questionId, onQuestionUpdated }) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        const fetchedQuestion = await fetchQuestion(quizId, questionId.toString());
        setQuestion(fetchedQuestion);
      } catch (err) {
        setError('Failed to load question');
      } finally {
        setLoading(false);
      }
    };

    loadQuestion();
  }, [quizId, questionId]);

  const handleSubmit = async (updatedQuestion: Question) => {
    try {
      await updateQuestion(quizId, questionId, updatedQuestion);
      toast({
        title: "Success",
        description: "Question updated successfully",
      });
      onQuestionUpdated();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update question",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!question) return <div>Question not found</div>;

  return <EditQuestionForm question={question} onSubmit={handleSubmit} />;
};

export default EditQuestion;