import { NextResponse } from 'next/server'
import { generatePreSignedURL } from '../../../utils/generateAwsUrl'

export async function POST(req) {
  const data = await req.json()
  const { fileName, fileType } = data
  try {
    const url = await generatePreSignedURL(fileName, fileType)

    return NextResponse.json({ url }, { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json(
      { message: 'Error creating signed url' },
      { status: 500 },
    )
  }
}
