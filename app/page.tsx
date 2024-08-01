import Link from "next/link";

export default function Home() {
    return (
        <main>
            <h1 className="text-2xl">Welcome to lazy-quiz</h1>
            <Link href={"/login"}>Login</Link>
        </main>
    );
}
