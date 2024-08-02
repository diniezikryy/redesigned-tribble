const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const login = async (username: string, password: string) => {
    const response = await fetch(`${API_URL}/users/token/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({username, password}),
    });

    if (!response.ok) {
        throw new Error("Login failed");
    }

    const data = await response.json();
    return {user: {username}, accessToken: data.access};
};

export const refreshToken = async () => {
    const response = await fetch(`${API_URL}/users/token/refresh/`, {
        method: "POST",
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error("Token refresh failed");
    }

    const data = await response.json();
    return {username: data.username, accessToken: data.access};
};

export const fetchQuizzes = async (token: string) => {
    const response = await fetch(`${API_URL}/quizzes/`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch quizzes');
    }

    return response.json();
};