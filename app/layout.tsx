// app/layout.tsx

import {AuthProvider} from '@/contexts/AuthContext'
import Header from '@/components/Header'
import "./globals.css";


export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body>
        <AuthProvider>
            <Header/>
            {children}
        </AuthProvider>
        </body>
        </html>
    )
}