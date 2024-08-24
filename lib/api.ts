import {AuthData, Question, Quiz} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;


export const login = async (username: string, password: string): Promise<void> => {
    const response = await fetch(`${API_URL}/users/token/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({username, password}),
        credentials: 'include',
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
    }

    return response.json();
};

export const logout = async () => {
    const response = await fetch(`${API_URL}/users/logout/`, {
        method: "POST",
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error("Logout failed")
    }
}

export const refreshToken = async (): Promise<void> => {
    const response = await fetch(`${API_URL}/users/token/refresh/`, {
        method: "POST",
        credentials: 'include', // This is crucial for including cookies
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Token refresh failed", errorData);
        throw new Error(errorData.detail || "Token refresh failed");
    }
};

export const checkAuth = async (): Promise<AuthData> => {
    const response = await fetchWithAuth(`${API_URL}/users/auth-check/`);
    if (!response.ok) {
        throw new Error("Auth check failed");
    }
    return response.json()
};

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    let response = await fetch(url, {
        ...options,
        credentials: 'include',
    });

    if (response.status === 401) {
        // Token is expired, try to refresh
        try {
            await refreshToken();
            // Retry the original request
            response = await fetch(url, {
                ...options,
                credentials: 'include',
            });
        } catch (error) {
            throw new Error("Auth failed");
        }
    }

    return response;
};

// Quizzes

export const fetchQuizzes = async () => {
    const response = await fetchWithAuth(`${API_URL}/quizzes/`);
    if (!response.ok) {
        throw new Error('Failed to fetch quizzes');
    }
    return response.json();
};

export const createQuiz = async (quizData: { title: string; description: string }): Promise<Quiz> => {
    const response = await fetchWithAuth(`${API_URL}/quizzes/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create quiz');
    }
    const result = await response.json();
    console.log(result);
    return result;
}

export const fetchQuiz = async (quizId: number): Promise<Quiz> => {
    const response = await fetchWithAuth(`${API_URL}/quizzes/${quizId}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch quiz');
    }
    return response.json();
}

export const deleteQuiz = async (quizId: number): Promise<void> => {
    const response = await fetch(`${API_URL}/quizzes/${quizId}/`, {
        method: 'DELETE',
        credentials: 'include',
    })

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete quiz');
    }
    return;
}

export const updateQuiz = async (quizId: number, quizData: { title: string; description: string }): Promise<Quiz> => {
    const response = await fetchWithAuth(`${API_URL}/quizzes/${quizId}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update quiz');
    }
    return response.json();
}

// Questions
export const createQuestion = async (quizId: number, questionData:Omit<Question, 'id'>): Promise<Question> => {
    // console.log(questionData)
    const response = await fetchWithAuth(`${API_URL}/quizzes/${quizId}/questions/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create question');
    }

    return response.json();
};

export const fetchQuestion = async (quizId: number, questionId: number): Promise<Question> => {
    const response = await fetchWithAuth(`${API_URL}/quizzes/${quizId}/questions/${questionId}/`);

    if (!response.ok) {
        throw new Error('Failed to fetch question')
    }

    return response.json();
}

export const deleteQuestion = async (quizId: number, questionId: number): Promise<void> => {
    const response = await fetchWithAuth(`${API_URL}/quizzes/${quizId}/questions/${questionId}`, {
        method: 'DELETE',
    })

    if (!response.ok) {
        throw new Error('Failed to delete quiz');
    }
}

export const deleteAnswer = async (quizId: number, questionId: number, answerId: number): Promise<void> => {
    const response = await fetchWithAuth(`${API_URL}/quizzes/${quizId}/questions/${questionId}/answers/${answerId}/`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Failed to delete answer');
    }
}

export const updateQuestion = async (quizId: number, questionId: number, questionData: Partial<Question>): Promise<Question> => {
    const response = await fetchWithAuth(`${API_URL}/quizzes/${quizId}/questions/${questionId}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...questionData,
            answers: questionData.answers?.map(answer => ({
                ...answer,
                id: answer.id && answer.id > 0 ? answer.id : undefined
            }))
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to update question');
    }

    return response.json();
};

