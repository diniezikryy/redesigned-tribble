'use client'

import {useState} from "react";
import {useRouter} from "next/navigation";
import LoginForm from "../../components/LoginForm"
import {login} from "../../lib/api"
import {LoginForm as LoginFormType} from "../../types"

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (data: LoginFormType) => {
        try {
            const response = await login(data.username, data.password)
            // Store the token in localstorage
            localStorage.setItem("refresh_token", response.refresh)
            localStorage.setItem("access_token", response.access);
            router.push("/dashboard")
        } catch (error) {
            setError("Invalid Credentials")
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

