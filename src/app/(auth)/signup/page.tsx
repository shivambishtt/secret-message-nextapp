"use client"
import { useEffect, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios, { AxiosError } from "axios"
import { useRouter } from 'next/navigation'
import { signupSchemaValidation } from '@/schemas/signupSchema'
import { ApiResponse } from '@/types/apiResponse'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Loader2 } from "lucide-react";
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function Page() {
    const router = useRouter();
    const [username, setUsername] = useState("")
    const [usernameMessage, setUsernameMessage] = useState<string>("")
    const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false)
    const [formSubmitting, setFormSubmitting] = useState<boolean>(false)

    const form = useForm<z.infer<typeof signupSchemaValidation>>({
        resolver: zodResolver(signupSchemaValidation),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        }
    })
    const debounce = useDebounceCallback(setUsername, 500)

    const onsubmit = async (data: unknown) => {
        setFormSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>(`/api/signup`, data)
            toast(response.data.message)
            router.replace(`/verify/${username}`)
            setFormSubmitting(false)
        } catch (error) {
            console.error("Error in signup of user", error);
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data.message
            toast(errorMessage)
            setFormSubmitting(false)
        }
    }

    useEffect(() => {
        if (typeof window === "undefined") return; // Avoid fetching on the server
    
        const checkUsernameUnique = async () => {
            if (!username) return;
            setIsCheckingUsername(true);
            setUsernameMessage("");
    
            try {
                const response = await axios.get(`/api/check-username-unique?username=${username}`);
                setUsernameMessage(response.data?.message);
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                setUsernameMessage(axiosError.response?.data.message || "Error checking username");
            } finally {
                setIsCheckingUsername(false);
            }
        };
    
        checkUsernameUnique();
    }, [username]);
    
    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-300'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                <div className='text-center'>
                    <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
                        Join Mystery Message
                    </h1>
                    <p className="mb-4">Sign up to start your anonymous adventure</p>
                </div>
                <Form {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onsubmit)}>
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-md' >
                                        Username
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter username" {...field}
                                            onChange={(event) => {
                                                field.onChange(event)
                                                debounce(event.target.value)
                                            }}
                                        />
                                    </FormControl>
                                    {
                                        username.length !== 0 && <p className={`text-sm ${usernameMessage === "Username is available" ? 'text-green-500' : 'text-red-500'}`}>
                                            {usernameMessage}
                                        </p>
                                    }

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-md' >
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-md' >
                                        Password
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Enter password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <span className='flex items-center justify-between'>
                            <Button className='' type="submit" disabled={formSubmitting}>
                                {formSubmitting ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please Wait
                                    </>
                                ) : "Signup"}
                            </Button>
                        </span>

                    </form>
                </Form>
                <div className='text-center mt-4'>
                    <p>
                        Already a member?{''}
                        <Link href="/signin" className='text-blue-600 hover:text-blue-800'>
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Page
