import { connectDB } from "@/DBconfig/DBConfig";
import user from "@/models/user.model";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
connectDB();

export async function GET(req: NextRequest) {
  try {
    // Extracting cookies
    const token: any = cookies().get("Token");

    if (!token) {
      return NextResponse.json(
        {
          message: "Invalid User",
          data: null,
        },
        { status: 400 }
      );
    }

    // decoding cookies token
    const verifyToken = verify(token.value, process.env.TOKEN_SECRET as string);
   
    
    if (!verifyToken.userid) {
      return NextResponse.json(
        {
          message: "Invalid Token",
          data: null,
        },
        { status: 400 }
      );
    }
 
    // geting user from DB
    const userDetail = await user.findById(
      { _id: verifyToken.userid },
      "username email isVerified"
    );

    if(!userDetail){
        return NextResponse.json(
            {
              message: "Invalid user",
              data: null,
            },
            { status: 400 }
          );
    }

    return NextResponse.json(
      {
        message: "Success...!",
        data: userDetail,
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Something went wrong",
        data: error.message,
      },
      { status: 400 }
    );
  }
}
