import { NextResponse } from "next/server";

export async function GET(req: Request) {
  return NextResponse.json(
    { message: "provide email and password" },
    {
      status: 200,
    }
  );
}