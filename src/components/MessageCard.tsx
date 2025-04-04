"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { toast } from "sonner"
import { X } from 'lucide-react'
import { Message } from '@/models/user.models'
import axios from 'axios'
import { ApiResponse } from '@/types/apiResponse'

interface MessageCardProps {
    message: Message,
    key?: string,
    onMessageDelete: (messageId: string) => void
}

function MessageCard({ message }: MessageCardProps) {

    const handleDeleteConfirm = async () => {
        const response = await axios.delete<ApiResponse>(`/api/deletemessage/${message._id}`)
        toast(response.data.message)
    }

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>{message.content}</CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button>
                                <X className='w-5 h-5' />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your message
                                    from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardHeader>
                <CardContent>
                </CardContent>
            </Card>
        </div>
    )
}

export default MessageCard
