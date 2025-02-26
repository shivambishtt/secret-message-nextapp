import UserModel from "@/models/user.models";
import connectDB from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import { Message } from "@/models/user.models";

export async function POST(request: Request) {
    await connectDB()
    const { username, content } = request.json()
    try {
        const user = await UserModel.findOne({ username })
        if (!user) {
            return Response.json(
                {
                    succes: false,
                    message: "User not found"
                },
                {
                    status: 404
                }
            )
        }
        if (!user.isAcceptingMessages) {
            return Response.json(
                {
                    succes: false,
                    message: "User is not accepting messages currently"
                },
                {
                    status: 403
                }
            )
        }
        const newMessage = {
            content,
            createdAt: new Date()
        }
        user.messages.push(newMessage as Message)
        await user.save()
        return Response.json(
            {
                succes: true,
                message: "Message sent successfully"
            },
            {
                status: 403
            }
        )

    } catch (error) {
        return Response.json(
            {
                succes: false,
                message: "Error while sending messages"
            },
            {
                status: 404
            }
        )
    }
}