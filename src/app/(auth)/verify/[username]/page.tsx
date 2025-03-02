"use client"
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ApiResponse } from '@/types/apiResponse'
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { verifycodeSchema } from '@/schemas/verifycodeSchema'
import axios, { AxiosError } from 'axios'

function VerifyAccount() {
    const router = useRouter()
    const params = useParams<{ username: string }>()
    const form = useForm<z.infer<typeof verifycodeSchema>>({
        resolver: zodResolver(verifycodeSchema)
    })
    const onsubmit = async (data: z.infer<typeof verifycodeSchema>) => {
        try {
            const response = await axios.post(`/api/auth/verify-code`, {
                username: params.username,
                verifyCode: data.verifyCode
            })
            toast(response.data?.message)
            router.replace(`/signin`)
        } catch (error) {
            console.error("Error in verifying the code of user", error);
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError.message
            console.log(errorMessage);

            toast(errorMessage)
        }
    }

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-300'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                <div className='text-center'>
                    <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
                        Verify your Account
                    </h1>
                    <p className="mb-4">Enter the verification code sent to your email</p>
                </div>

                <Form {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onsubmit)}>
                        <FormField
                            control={form.control}
                            name="verifyCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your code" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type='submit'>Submit</Button>
                    </form>
                </Form>
            </div>

        </div>
    )
}

export default VerifyAccount
