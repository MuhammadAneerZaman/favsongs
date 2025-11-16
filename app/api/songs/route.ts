import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import {  NextResponse } from "next/server";
import {authOptions} from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Get logged-in user session
    // const session = await getServerSession(authOptions);
    // if (!session || !session.user?.email) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // const userId = "cmi0loozp0000p26kcpxrhnyn";


    // Parse request body
    const { song } = await req.json();
    if (!song) {
      return NextResponse.json({ error: "Song name required" }, { status: 400 });
    }

    // Find user by email
    // const user = await prisma.user.findUnique({
    //   where: { email: session.user.email }
    // });

       const user = await prisma.user.findUnique({
      where: { email: "aneertest@gmail.com" }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Save favorite song
    const favorite = await prisma.favorite.create({
      data: {
        song,
        userId: user.id
      }
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    console.error("Error saving favorite:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Song ID required" }, { status: 400 });
    }

    // Ensure the song belongs to the logged-in user
    const favorite = await prisma.favorite.findUnique({ where: { id } });
    if (!favorite) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

     
    if (favorite.userId !== user?.id) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    await prisma.favorite.delete({ where: { id } });

    return NextResponse.json({ message: "Song deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting favorite:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}



export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session: ", session);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { favorites: true }
    });

    console.log("User Favorites: ", user?.favorites);
    

    return NextResponse.json(user?.favorites ?? [], { status: 200 });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function PUT(req: Request) {
   const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  try {
    // Parse request body
    const { id, song } = await req.json();

    if (!id || !song) {
      return NextResponse.json(
        { error: "Song ID and new name required" },
        { status: 400 }
      );
    }

    // Find the favorite by ID
    const favorite = await prisma.favorite.findUnique({ where: { id } });
    if (!favorite) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    // Hardcoded user check (replace with session later)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (favorite.userId !== user?.id) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    // Update the song name
    const updatedFavorite = await prisma.favorite.update({
      where: { id },
      data: { song }
    });

    return NextResponse.json(updatedFavorite, { status: 200 });
  } catch (error) {
    console.error("Error updating favorite:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}