import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
) {
    try {
        const { userId } = auth();
        const { isCompleted } = await req.json();  

        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userProgress = await db.userProgress.upsert({
            where: {
                userId_chapterId: {
                    userId: userId,
                    chapterId: params.chapterId,
                }
            },
            update: {
                isCompleted,
            },
            create: {
                userId: userId,
                chapterId: params.chapterId,
                isCompleted,
            }
        })
        
        return NextResponse.json(userProgress);
    } catch (error) {
        console.log("[PROGRESS] Error updating progress", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}