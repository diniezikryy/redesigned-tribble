'use client'

import {useState} from "react";
import {useRouter} from "next/navigation";
import LoginForm from "../../components/LoginForm";
import {login} from "@/lib/api";
import {LoginForm as LoginFormType} from "../../types";

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (data: LoginFormType) => {
        try {
            await login(data.username, data.password);
            router.push("/dashboard");
        } catch (error) {
            setError("Invalid Credentials");
        }
    };

    return (
        <div>
            <h1>Login Page</h1>
            {error && <p>{error}</p>}
            <LoginForm onSubmit={handleSubmit}/>
        </div>
    );
}