import UserModel from "@/models/user.models";
import connectDB from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await connectDB()
    try {
        const session = await getServerSession(authOptions)
        const user: User = session?.user as User
        if (!session || !session.user) {
            return Response.json(
                {
                    success: false,
                    message: "Not Authenticated"

                },
                {
                    status: 401
                }
            )
        }
        const userId = new mongoose.Types.ObjectId(user._id)
        const useraggre = await UserModel.aggregate([
            {
                $match: { id: userId }
            },
            {
                $unwind: "$messages"
            },
            {
                $sort: { "messages.createdAt": -1 }
            },
            {
                $group: { _id: "$_id", messages: { $push: "$messages" } }
            }
        ])
        if (!useraggre || useraggre.length === 0) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"

                },
                {
                    status: 404
                }
            )
        }
        return Response.json(
            {
                success: true,
                messages: useraggre[0].messages

            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.error("An unknown error occured", error);

        return Response.json(
            {
                success: false,
                message: "Not authenticated"
            },
            {
                status: 500
            }
        )
    }
}
