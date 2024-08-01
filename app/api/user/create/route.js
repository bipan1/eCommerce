import { SHA256 as sha256 } from 'crypto-js'
import prisma from '@/database'
import { NextResponse } from 'next/server'

export const hashPassword = (string) => {
  return sha256(string).toString()
}

export async function POST(req) {
  const data = await req.json()
  const { password } = data

  if (password.length < 8) {
    errors.push('password length should be more than 8 characters')
    return NextResponse.json({ errors }, { status: 400 })
  }

  try {
    const user = await prisma.user.create({
      data: { ...data, password: hashPassword(password), cart: { create: {} } },
    })
    console.log(user)
    return NextResponse.json({ user }, { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json(
      { message: 'invalid credentials' },
      { status: 401 },
    )
  }
}
