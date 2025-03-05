"use client"
import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import messages from "@/messages.json"
import { Card, CardContent, CardHeader } from '@/components/ui/card'

const Home = () => {
  return (
    <main className='flex flex-grow flex-col items-center justify-center px-4 md:px-24 py-12'>
      <section className='text-center mb- md:mb-12'>
        <h1 className='text-3xl md:text-5xl font-bold'>Dive into the World of Anonymous Conversations</h1>
        <p className='mt-3 md:mt-4 text-base md:text-lg'>Explore Mystery Message - Where tour identity remains a secret</p>
      </section>
      <Carousel className="w-2/4">
        <CarouselContent>
          {messages.map((message, index) => (
            <CarouselItem key={index} className="flex justify-center">
              <Card className="w-full p-6 shadow-lg rounded-lg text-center">
                <CardHeader className="text-xl font-semibold">{message.title}</CardHeader>
                <CardContent className="font-bold text-3xl">{message.content}</CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

    </main>
  )
}

export default Home 
