"use client"
import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Message } from '@/models/user.models'
import { accpetMessageSchemaValidation } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/apiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

function Page() {
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

  const acceptMessage = watch("isAcceptingMessages")

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>(`/api/acceptmessage`)
      const isAccepting = response?.data?.isAcceptingMessages ?? false

      setValue("isAcceptingMessages", isAccepting)

    } catch (error) {
      const axiosEror = error as AxiosError<ApiResponse>
      toast(axiosEror.message)
    }
    setIsSwitchLoading(false)
  }, [setValue])

  const fetchMessage = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    setIsSwitchLoading(false)
    try {
      const response = await axios.get<ApiResponse>(`/api/getmessage`)
      setMessages(response.data.messages || [])
      if (refresh) {
        toast("Refreshed messages")
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast(axiosError.message)
    }
    finally {
      setIsSwitchLoading(false)
    }
  }, [setIsLoading, setMessages])

  useEffect(() => {
    if (!session || !session.user) {
      return
    }
    fetchMessage()
    fetchAcceptMessage()
  }, [session, setValue, fetchMessage, fetchAcceptMessage])

  const handleSwitchChange = async () => {
    try {
      const newStatus = !acceptMessage;
      const response = await axios.post<ApiResponse>(`/api/acceptmessage`, {
        acceptMessage: newStatus
      })
      setValue("isAcceptingMessages", newStatus)
      toast(response.data.message)
    } catch (error) {
      const axiosEror = error as AxiosError<ApiResponse>
      toast(axiosEror.message)
    }
  }
  const { username } = session?.user ?? {}
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast("Copied to clipboard")
  }
  if (!session || !session.user) {
    return <div className="flex justify-center items-center">
      <h1 className='text-xl mt-16 font-semibold'>
        Oops You are not logged in !😪
      </h1>
    </div>
  }

  return (
    <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded  w-full max-w-6xl'>
      <h1 className='text-4xl font-bold mb-4'>User Dashboard</h1>
      <div className='mb-4'>
        <h2 className='text-lg font-semibold mb-2'>Copy your Unique Link</h2>{' '}
        <div className='flex items-center'>
          <input
            type="text"
            value={profileUrl}
            disabled
            className='input input-bordered w-full p-2 mr-2'
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>
      <div className='mb-4'>
        <Switch {...register("isAcceptingMessages")}
          checked={acceptMessage}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className='ml-2'>
          Accept Messages: {acceptMessage ? "On" : "Off"}
        </span>
      </div>
      <Separator />
      <Button
        className="mt-4"
        variant="outline"
        onClick={(event) => {
          event.preventDefault()
          fetchMessage(true)
        }}
      >
        {isLoading ? (<Loader2 className='h-4 w-4 animate-spin' />) : (
          <RefreshCcw className='h-4 w-4' />
        )}
      </Button>
      <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message.id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display</p>
        )}
      </div>
    </div>
  )
}

export default Page
