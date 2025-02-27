"use client"
import { useEffect, useState } from 'react'
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from 'next/link'
import axios, { AxiosError } from "axios"
import { useRouter } from 'next/navigation'
import { signupSchemaValidation } from '@/schemas/signupSchema'
import { ApiResponse } from '@/types/apiResponse'

function page() {
    const [username, setUsername] = useState("")
    const [usernameMessage, setUsernameMessage] = useState<string>("")
    const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false)
    const [formSubmitting, setFormSubmitting] = useState<boolean>(false)

    const { register, handleSubmit, formState } = useForm<z.infer<typeof signupSchemaValidation>>({
        resolver: zodResolver(signupSchemaValidation),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        }
    })
    const debouncedUsername = useDebounceValue(username, 500)
    const router = useRouter();

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (debouncedUsername) {
                setIsCheckingUsername(true)
                setUsernameMessage("")
            }
            try {
                const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`)
                console.log(response, "response");
                setUsernameMessage(response.data.message)
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>
                setUsernameMessage(axiosError.response?.data.message || "Error checking username")
            }
            finally {
                setIsCheckingUsername(false)
            }
        }
        checkUsernameUnique()

    }, [debouncedUsername])
    return (
        <div>

        </div>
    )
}

export default page
