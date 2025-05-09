import UserModel from "@/models/user.models";
import connectDB from "@/lib/dbConnect";
import { Message } from "@/models/user.models";

export async function POST(request: Request) {
    await connectDB()
    const { username, content, email } = await request.json() // frontend 
    try {
        const user = await UserModel.findOne({
            $or: [{ username }, { email }] // backend looking in db
        })
        if (!user) {
            return Response.json(
                {
                    succes: false,
                    message: "User does not exists"
                },
                {
                    status: 404
                }
            )
        }
        if (user?.username === username) {
            return Response.json(
                {
                    succes: false,
                    message: "You cannot send message to yourself"
                },
                {
                    status: 403
                }
            )
        }
        if (!user.isAcceptingMessages) {
            return Response.json(
                {
                    success: false,
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
                status: 200
            }
        )

    } catch (error) {
        return Response.json(
            {
                succes: false,
                message: "Error occured while sending messages"
            },
            {
                status: 500
            }
        )
    }
}



