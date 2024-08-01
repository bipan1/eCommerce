import prisma from '@/database'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const data = await req.json()

  try {
    const category = await prisma.category.create({ data })
    return NextResponse.json({ category }, { status: 200 })
  } catch (err) {
    if (err.code === 'P2002') {
      return NextResponse.json(
        { message: 'Category should be unique.' },
        { status: 400 },
      )
    }
    return NextResponse.json(
      { message: 'Error creating a category' },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const category = await prisma.category.findMany()
    return NextResponse.json({ category }, { status: 200 })
  } catch (err) {
    console.log(err)
    return NextResponse.json(
      { message: 'Error Fetching category' },
      { status: 500 },
    )
  }
}

export async function DELETE(req) {
  const { id } = await req.json()
  try {
    const category = await prisma.category.delete({ where: { id } })
    return NextResponse.json(
      { message: 'Category deleted Sucessfully' },
      { status: 200 },
    )
  } catch (err) {
    console.log(err)
    return NextResponse.json(
      { message: 'Error Deleting Category' },
      { status: 500 },
    )
  }
}

export async function PUT(req) {
  const { id, name } = await req.json()
  try {
    const category = await prisma.category.update({
      where: { id },
      data: { name },
    })
    return NextResponse.json({ category }, { status: 200 })
  } catch (err) {
    if (err.code === 'P2002') {
      return NextResponse.json(
        { message: 'Category should be unique.' },
        { status: 400 },
      )
    }
    return NextResponse.json(
      { message: 'Error Updating category' },
      { status: 500 },
    )
  }
}
