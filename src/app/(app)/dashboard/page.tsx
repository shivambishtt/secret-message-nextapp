"use client"
import { Message } from '@/models/user.models'
import { accpetMessageSchemaValidation } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/apiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useSession } from 'next-auth/react'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

function page() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false)
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId))
  }
  const { data: session } = useSession()
  const form = useForm({
    resolver: zodResolver(accpetMessageSchemaValidation)
  })
  const { register, watch, setValue } = form
  const acceptingMessages = watch("isAcceptingMessages")
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>(`/api/acceptmessage`)
      setValue("isAcceptingMessages", response.data.isAcceptingMessages)
    } catch (error) {
      const axiosEror = error as AxiosError<ApiResponse>
      toast(axiosEror.message)
    }
  }, [])
  return (
    <div>
      Dashboard
    </div>
  )
}

export default page
