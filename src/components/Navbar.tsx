"use client"
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'

function Navbar() {
    const { data: session } = useSession()
    const user: User = session?.user
    return (
        <nav className='p-4 md:p-6 shadow-md'>
            <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
                <a href="#">Mystery Message</a>
                {session ?
                    <>
                        <span>
                            Welcome {user.username || user.email}
                        </span>
                        <Button onClick={() => signOut()}>Logout</Button>
                    </>
                    : <Link href='/signin'>
                        <Button>
                            Login
                        </Button>
                    </Link>}
            </div>
        </nav>
    )
}

export default Navbar
