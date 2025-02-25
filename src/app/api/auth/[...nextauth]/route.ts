import NextAuth from "next-auth/next"
import { authOptions } from "./options"

const handler = NextAuth(authOptions) //initialize next auth with our custom option

export { handler as GET, handler as POST } 