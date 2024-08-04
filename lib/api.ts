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
        credentials: 'include', // This is crucial for including cookies
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Token refresh failed", errorData);
        throw new Error(errorData.detail || "Token refresh failed");
    }
};

export const checkAuth = async (): Promise<boolean> => {
    try {
        const response = await fetchWithAuth(`${API_URL}/users/auth-check/`);
        return response.ok;
    } catch (error) {
        console.error('Auth check failed:', error);
        return false;
    }
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
            // Refresh failed, redirect to login
            window.location.href = '/login';
            throw error;
        }
    }

    return response;
};

export const fetchQuizzes = async () => {
    const response = await fetchWithAuth(`${API_URL}/quizzes/`);
    if (!response.ok) {
        throw new Error('Failed to fetch quizzes');
    }
    return response.json();
};

