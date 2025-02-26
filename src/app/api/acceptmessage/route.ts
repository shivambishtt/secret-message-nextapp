import UserModel from "@/models/user.models";
import connectDB from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function POST(request: Request) {
    await connectDB()
    try {
        const session = await getServerSession(authOptions)
        const user: User = session?.user as User
        if (!session || !session.user) {
            return Response.json(
                {
                    success: false,
                    message: "User not authenticated."
                },
                {
                    status: 401
                }
            )
        }
        const userId = user._id
        const { acceptMessages } = await request.json()

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        )
        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Failed to update user status "
                },
                {
                    status: 401
                }
            )
        }
        return Response.json(
            {
                success: true,
                message: "Message acceptance status updated successfully",
                updatedUser
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.error("Failed to update user status to accept messages");
        return Response.json(
            {
                success: false,
                message: "Failed to update user status to accept messages"
            },
            {
                status: 500
            }
        )

    }
}
export async function GET(request: Request) {
    await connectDB()
    try {
        const session = await getServerSession(authOptions)
        const user: User = session?.user as User
        if (!session || !session.user) {
            return Response.json(
                {
                    success: false,
                    message: "User not authenticated."
                },
                {
                    status: 401
                }
            )
        }
        const userId = user._id
        const userFound = await UserModel.findById(userId)
        if (!userFound) {
            return Response.json(
                {
                    success: false,
                    message: "User not found."
                },
                {
                    status: 401
                }
            )
        }
        return Response.json(
            {
                success: true,
                isAcceptingMessages: userFound.isAcceptingMessages
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log(error);
        return Response.json(
            {
                success: false,
                message: 'Error is getting message acceptance status',
            },
            {
                status: 200
            }
        )
    }
}