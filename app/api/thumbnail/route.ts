import { LinkPreviewResponse } from '@/models/types/thumbnail'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { url } = body

    const response = await fetch(`https://api.linkpreview.net/?q=${encodeURIComponent(url)}`, {
      method: 'GET',
      headers: {
        'X-Linkpreview-Api-Key': process.env.LINKPREVIEW_API_KEY || ''
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch link preview')
    }

    const data = await response.json() as LinkPreviewResponse
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate link preview' },
      { status: 500 }
    )
  }
}