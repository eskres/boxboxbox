import { NextResponse } from "next/server";

const BACKEND = process.env.API_BASE_URL ?? "http://localhost:8000";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sessionKey = searchParams.get("session_key");
    if (!sessionKey || isNaN(Number(sessionKey))) return NextResponse.json({ error: "session_key must be a number" }, { status: 400 });

    const res = await fetch(`${BACKEND}/openf1/race-laps?session_key=${sessionKey}`);
    if (!res.ok) {
        const text = await res.text();
        console.error(`[race-laps] backend ${res.status}:`, text);
        return NextResponse.json({ error: "backend error" }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
}
