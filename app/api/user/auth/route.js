// import prisma client
import prisma from '../../../../database'
import { hashPassword } from '../create/route'
import { NextResponse } from 'next/server'
import { exclude } from '../../../../utils'

export async function POST(req) {
  const data = await req.json()
  const { email, password } = data

  if (!email || !password) {
    return NextResponse.json({ message: 'invalid inputs' }, { status: 400 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    })

    if (user && user.password === hashPassword(password)) {
      return NextResponse.json(exclude(user, ['password']), { status: 200 })
    } else {
      return NextResponse.json(
        { message: 'invalid credentials' },
        { status: 401 },
      )
    }
  } catch (e) {
    console.log(e)
    // throw new Error(e)
  }
}
