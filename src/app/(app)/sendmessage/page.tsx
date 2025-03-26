"use client"
import React, { useState } from 'react'
import MessageCard from '@/components/MessageCard'
import axios, { AxiosError } from 'axios'
import { Input } from '@/components/ui/input'
import { ApiResponse } from '@/types/apiResponse'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { Message } from '@/models/user.models'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

function Page() {
    const [messages, setMessages] = useState<Message[]>([])
    const form = useForm({
        defaultValues: {
            username: "",
            content: "",
            email: ""
        }
    })
    const addMessage = async (data: Message) => {
        try {
            const response = await axios.post("/api/sendmessage", data)
            toast(response.data?.message)
            setMessages((prevMessages) => [...prevMessages, data]);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast(axiosError.response?.data.message);
        }
    }
    const deleteMessage = async (messageid: string) => {
        try {
            const response = await axios.delete(`/api/deletemessage/${messageid}`)
            toast(response.data.message)
            setMessages((prevMessages) => prevMessages.filter((message) => {
                return message.id !== messageid
            }))
        } catch (error) {
            const axiosError = error as AxiosError
            console.log(axiosError);
        }
    }
    return (
        <div>
            <Form  {...form}>
                <form onSubmit={form.handleSubmit(addMessage)}>
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-md'>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter username" {...field} onChange={(event) => {
                                        field.onChange(event);
                                    }} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-md'>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter email" {...field} onChange={(event) => {
                                        field.onChange(event);
                                    }} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-md'>Content</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter content / message" {...field} onChange={(event) => {
                                        field.onChange(event);
                                    }} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
                {messages.map((message) => (
                    <MessageCard key={message._id as string} message={message} onMessageDelete={deleteMessage} />
                ))}



            </Form>
        </div>
    )
}

export default Page
