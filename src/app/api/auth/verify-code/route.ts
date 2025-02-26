import connectDB from "@/lib/dbConnect";
import UserModel from "@/models/user.models";
import { z } from "zod"
import { usernameValidation } from "@/schemas/signupSchema";

export async function POST(request: Request) {
    await connectDB()
    try {
        const { username, code } = await request.json()
        const decodedUsername = decodeURIComponent(username)

        const user = await UserModel.findOne({ username: decodedUsername })
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found in database"
                },
                {
                    status: 404
                }
            )
        }
        const isCodeValid = user.verifyCode === code
        const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date()
        if (isCodeValid && isCodeExpired) {
            user.isVerified = true
            await user.save()
            return Response.json(
                {
                    success: true,
                    message: "Account verified successfully"
                },
                {
                    status: 200
                }
            )
        }
        else if (!isCodeExpired) { // code is expir
            return Response.json(
                {
                    success: false,
                    message: "Verification code is expired"
                },
                {
                    status: 400
                }
            )
        }
        else {
            return Response.json(
                {
                    success: false,
                    message: "Incorrect verification code"
                },
                {
                    status: 400
                }
            )
        }

    } catch (error) {
        console.error("Error occured while verifying the code", error);
        return Response.json(
            {
                success: false,
                message: "Error occured while verifying the code"
            },
            {
                status: 500
            }
        )
    }
}
