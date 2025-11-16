import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    
    const { email, password } = await req.json();


    const hashedPassword = await hash(password, 10);

    const isUserExist = await prisma.user.findUnique({
      where: { email: email },
    });

    if(isUserExist){
      return NextResponse.json(
      { message: "Already Registered" },
      { status: 400 }
    );
    }

     const user = await prisma.user.create({
      data: { email, password: hashedPassword }
    });



    return NextResponse.json({user:{email: user.email, id: user.id}}, { status: 200 });
  } catch (error) {
    console.error("Error while registration of user:", error);
    return NextResponse.json(
      { message: "Error while registering user" },
      { status: 500 }
    );
  }
}
