const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const login = async (username: string, password: string): Promise<void> => {
    const response = await fetch(`${API_URL}/users/token/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({username, password}),
    });

    if (!response.ok) {
        throw new Error("Login failed")
    }

    return response.json();
};

export const fetchQuizzes = async (token: string) => {
  // console.log(`Fetching Quizzes with token: ${token}`);
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

  const data = await response.json();
  // console.log("Received data from server:", data);
  return data;
};