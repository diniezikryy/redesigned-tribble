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
        throw new Error("Login failed")
    }
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
        credentials: 'include', // This is important for including cookies
    });

    if (!response.ok) {
        throw new Error("Token refresh failed");
    }
};

export const checkAuth = async (): Promise<boolean> => {
    try {
        const response = await fetch(`${API_URL}/users/auth-check/`, {
            method: 'GET',
            credentials: 'include',
        });
        return response.ok;
    } catch (error) {
        console.error('Auth check failed:', error);
        return false;
    }
};

export const fetchQuizzes = async () => {
    // console.log(`Fetching Quizzes with token: ${token}`);
    const response = await fetch(`${API_URL}/quizzes/`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch quizzes');
    }

    return response.json();
};

