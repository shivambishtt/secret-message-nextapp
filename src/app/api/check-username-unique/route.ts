import connectDB from "@/lib/dbConnect";
import UserModel from "@/models/user.models";
import { z } from "zod"
import { usernameValidation } from "@/schemas/signupSchema";


const usernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await connectDB()
    try {
        const { searchParams } = new URL(request.url) // extracting username from URL
        const queryParam = {
            username: searchParams.get('username')
        }
        const result = usernameQuerySchema.safeParse(queryParam)
        if (!result.success) {
            const usernameError = result.error.format().username?._errors || []
            return Response.json(
                {
                    success: false,
                    message: usernameError.length > 0 ? usernameError.join(",") : "Invalid query parameter"
                },
                {
                    status: 400
                }
            )
        }
        const { username } = result.data

        const existingUser = UserModel.findOne({ username, isVerified: true })
        if (existingUser) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken"
                },
                {
                    status: 400
                }
            )
        } else {
            return Response.json(
                {
                    success: true,
                    message: "Username is available"
                },
                {
                    status: 400
                }
            )
        }

    } catch (error) {
        console.error("Error checking username", error);
        return Response.json(
            {
                success: false,
                message: "Error checking username"
            },
            {
                status: 500
            }
        )
    }

}