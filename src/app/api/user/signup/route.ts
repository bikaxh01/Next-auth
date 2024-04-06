import { connectDB } from "@/DBconfig/DBConfig";
import user from "@/models/user.model";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/utils/mailer";

import { NextRequest, NextResponse } from "next/server";

//DB Connection
connectDB()
  .then(() => console.log("connected to DB"))
  .catch((e) => console.log(e));

// handling Signup
export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();
    

    // validation
    if (!username || !email || !password) {
     
      return NextResponse.json(
        {
          message: "Error Occured",
          data: "Invalid inputs",
        },
        { status: 400 }
      );
    }
    const isExists = await user.findOne({ email });
    
    if (isExists) {
      return NextResponse.json(
        {
          message: "Error Occured",
          data: "user already exists",
        },
        { status: 400 }
      );
    }

    // password Hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPW = await bcrypt.hash(password, salt);

    // Adding user to DB
    const data = await user.create({
      email,
      password: hashedPW,
      username,
    });
  
    // Send verification mail
    await sendEmail({
      emailReceiver: email,
      mailType: "VERIFY",
      userId: data._id,
    });

    // return Response
    return NextResponse.json(
      {
        message: "Account Created",
        data: data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Error Occured",
        data: error.message,
      },
      { status: 403 }
    );
  }
}
