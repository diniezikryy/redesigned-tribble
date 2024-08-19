import React from 'react';
import {Loader2} from 'lucide-react'

interface LoadingProps {
    message?: string;
}

const Loading: React.FC<LoadingProps> = ({message = "Loading..."}) => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary"/>
            <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        </div>
    )
}

export default Loading;