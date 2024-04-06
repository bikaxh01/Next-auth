import { connectDB } from "@/DBconfig/DBConfig";
import user from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { cookies } from 'next/headers'

connectDB();

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  try {
    // check user

    const User = await user.findOne({ email });
    console.log(User);

    if (!User) {
      return NextResponse.json(
        {
          message: "Invalid User",
          data: null,
        },
        { status: 404 }
      );
    }

    const PwCheck = await bcrypt.compare(password, User.password);

    if (!PwCheck) {
      return NextResponse.json(
        {
          message: "Invalid password",
          data: null,
        },
        { status: 400 }
      );
    }
    // Generate Token
    const Token = sign(
      {
        userid: User._id,
        email: User.email,
      },
      process.env.TOKEN_SECRET as string
    );

    // set cookies
    cookies().set('Token',Token,{httpOnly:true})
    
    // Send Token
    return NextResponse.json(
      {
        message: "LoggedIn success...!",
        data: null,
      },
      { status: 200 }
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
