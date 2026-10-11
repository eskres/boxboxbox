import { NextResponse } from "next/server";

const BACKEND = process.env.API_BASE_URL ?? "http://localhost:8000";

export async function GET() {
    const res = await fetch(`${BACKEND}/openf1/race-sessions`);
    const data = await res.json();
    return NextResponse.json(data);
}
