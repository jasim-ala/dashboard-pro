import { updateUserRole } from '@/app/actions'
import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'

export async function POST(req) {
  const user = await currentUser()
  if (user?.publicMetadata?.role !== 'Admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { id, clerkId, newRole, email } = await req.json()
  const result = await updateUserRole(id, clerkId, newRole, email)
  return NextResponse.json(result)
}
