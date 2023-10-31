// Prisma client ibaratnya berfungsi sebagai jasa penyedia query yang mudah dibaca dan dikelola yang disediakan oleh prisma, query seperti :
// prisma.user.findUnique, 
// prisma.user.findMany 
// prisma.user.create, 
// prisma.user.update, 
// prisma.user.delete dan lain-lain
import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}
const client = globalThis.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = client
}

export default client
