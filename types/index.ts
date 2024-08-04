export interface User {
    id: number;
    username: string;
    email: string;
}

export interface LoginForm {
    username: string;
    password: string;
}

export interface AuthData {
  authenticated: boolean;
  username: string;
}