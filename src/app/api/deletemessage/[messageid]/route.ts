import UserModel from "@/models/user.models";
import { User } from "@/models/user.models";
import connectDB from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {
    const messageId = params.messageid
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
        const updatedResult = await UserModel.updateOne({ _id: user._id }, { $pull: { messages: { _id: messageId } } })
        if (updatedResult.modifiedCount === 0) {
            return Response.json(
                {
                    success: false,
                    message: "Message not found or already deleted"
                },
                {
                    status: 404
                }
            )
        }
        return Response.json(
            {
                success: true,
                message: "Message deleted succesfully"
            },
            {
                status: 200
            }
        )
    } catch (error: unknown) {
        return Response.json(
            {
                success: false,
                message: "Error occured while deleting message"
            },
            {
                status: 500
            }
        )
    }
}
