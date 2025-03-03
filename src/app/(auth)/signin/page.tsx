"use client"
import { useState } from 'react'
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from 'next/navigation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Loader2 } from "lucide-react";
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { verifySignInSchema } from '@/schemas/signinSchema'
import { signIn } from 'next-auth/react'

function Page() {
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof verifySignInSchema>>({
    resolver: zodResolver(verifySignInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    }
  })

  const onsubmit = async (data: z.infer<typeof verifySignInSchema>) => {
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    })
    if (result?.error) {
      toast(result?.error)
      console.error("Error occured while logging in the user", result.error)
    }
    if (result?.url) {
      router.replace("/dashboard")
    }
  }
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-300'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign In to start your anonymous journey</p>
        </div>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onsubmit)}>
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel >
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
                  <FormLabel >
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={formSubmitting}>
              {formSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please Wait
                </>
              ) : "Signin"}
            </Button>
          </form>
        </Form>
        <div className='text-center mt-4'>
          <p>
            Not a member?{''}
            <Link href="/signup" className='text-blue-600 hover:text-blue-800'>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page
