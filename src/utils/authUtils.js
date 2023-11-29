import { getSession } from 'next-auth/react'
import { NextResponse } from 'next/server'

export async function requireAuthentication(req) {
  const session = await getSession({ req })

  if (!session) {
    NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    return false
  }

  return true
}
