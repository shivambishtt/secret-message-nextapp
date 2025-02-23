import connectDB from "@/lib/dbConnect";
import UserModel from "@/models/user.models";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await connectDB()
    try {
        const { username, email, password } = await request.json()
        const userExists = await UserModel.findOne({ username, isVerified: true }) //should be verified also
        if (userExists) {
            return Response.json({
                success: false, message: "User already exists"
            },
                {
                    status: 400
                })
        }
        const existingUserByEmail = await UserModel.findOne({ email })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false, message: "User is already registered with this email"
                }, {
                    status: 400
                })
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
        }
        else {
            const hashPassword = await bcrypt.hash(password, 10)
            const expiryTime = new Date()
            expiryTime.setHours(expiryTime.getHours() + 1)

            const user = await new UserModel({
                username,
                email,
                password: hashPassword,
                verifyCode,
                verifyCodeExpiry: expiryTime,
                isVerified: false,
                isAcceptingMessages: true,
                messages: []
            })
            await user.save()
        }
        const emailResponse = await sendVerificationEmail({
            username,
            email,
            verifyCode
        })
        if (!emailResponse.success) {
            return Response.json({
                success: false, message: emailResponse.message
            }, {
                status: 500
            })
        }

        return Response.json({
            success: true, message: "User registered successfully. Please verify your email",
        }, {
            status: 500
        }

        )
    } catch (error) {
        console.error("Error occured while registering the user");
        return Response.json(
            {
                success: false,
                message: "Error occured while registering the user"
            },
            {
                status: 500
            }
        )

    }
}
