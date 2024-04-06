import { connectDB } from "@/DBconfig/DBConfig";
import user from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function PUT(req: NextResponse) {
  try {
   
    const { token } = await req.json();

    // Match Token

    
    const userDetail = await user.findOne({
      verifyToken: token,
      verifyTokenExpiry:{$gt: Date.now()},
    });

  
    if (!userDetail) {
      return NextResponse.json(
        {
          message: "Invalid User",
          data: user,
        },
        { status: 404 }
      );
    }

    //update isverified 
    userDetail.isVerified = true;
    userDetail.verifyToken = undefined;
    userDetail.verifyTokenExpiry = undefined;

    const verifiedUser= await userDetail.save();

    return NextResponse.json(
      {
        message: "user verified successfully..!",
        data: verifiedUser,
      },
      { status: 202 }
    );
  } catch (error:any) {

    return NextResponse.json(
        {
          message: "Something went wrong",
          data: error.message,
        },
        { status: 400 }
      );
  }

  return NextResponse.json("hello");
}
