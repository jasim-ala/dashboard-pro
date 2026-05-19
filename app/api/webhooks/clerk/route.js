import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { clerkClient } from '@clerk/nextjs/server'

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  const headerPayload = headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400
    })
  }

  const { id, email_addresses } = evt.data
  const eventType = evt.type

  if (eventType === 'user.created') {
    const email = email_addresses?.[0]?.email_address
    
    if (email === 'amardun12345@gmail.com') {
      try {
        await clerkClient.users.updateUserMetadata(id, {
          publicMetadata: {
            role: 'Admin'
          }
        })
        console.log(`Automatically assigned Admin role to ${email}`)
      } catch (err) {
        console.error('Failed to update user metadata', err)
      }
    }
  }

  return new Response('', { status: 200 })
}
