"use client";

import { useEffect, useState } from "react";

interface Props {
    seconds: number;
    onRetry: () => void;
}

export function RetryCountdown({ seconds, onRetry }: Props) {
    const [remaining, setRemaining] = useState(seconds);

    useEffect(() => {
        if (remaining <= 0) return;
        const id = setTimeout(() => setRemaining(r => r - 1), 1000);
        return () => clearTimeout(id);
    }, [remaining]);

    return (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
            <p className="text-sm text-gray-500">Rate limit reached, please wait before retrying.</p>
            <button
                onClick={onRetry}
                disabled={remaining > 0}
                className="px-3 py-1.5 text-sm rounded border border-gray-300 bg-white disabled:opacity-40"
            >
                {remaining > 0 ? `Retry in ${remaining}s` : "Retry"}
            </button>
        </div>
    );
}
