import { FaCropSimple } from 'react-icons/fa6'
import prisma from '@/database'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const data = await req.json()
  const formattedData = { ...data, userId: Number(data.userId) }

  try {
    const post = await prisma.post.create({ data: formattedData })
    return NextResponse.json({ post }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Failed to add a post' }, { status: 500 })
  }
}

export async function GET(req) {
  const url = new URL(req.url)
  const category = url.searchParams.get('category')

  try {
    const posts = await prisma.post.findMany({
      where: {
        category: category,
      },
    })
    return NextResponse.json({ posts }, { status: 200 })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: err.message, status: 500 })
  }
}
