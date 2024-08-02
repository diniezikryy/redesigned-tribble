'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "../../components/LoginForm"
import { login } from "@/lib/api"
import { LoginForm as LoginFormType } from "../../types"
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { login: authLogin } = useAuth();

    const handleSubmit = async (data: LoginFormType) => {
        try {
            const { user, accessToken } = await login(data.username, data.password);
            authLogin(user, accessToken);
            router.push("/dashboard");
        } catch (error) {
            console.error('Login error:', error);
            setError("Invalid Credentials");
        }
    }

    return (
        <div>
            <h1>Login Page</h1>
            {error && <p>{error}</p>}
            <LoginForm onSubmit={handleSubmit}/>
        </div>
    )
}