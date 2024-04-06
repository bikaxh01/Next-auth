import { connectDB } from "@/DBconfig/DBConfig";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

connectDB();

export async function GET(req: NextRequest) {
  try {
    cookies().delete("Token");

    return NextResponse.json(
      {
        message: "Loggout succes...!",
        data: null,
      },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Something went wrong...!",
        data: error.message,
      },
      { status: 400 }
    );
  }
}
