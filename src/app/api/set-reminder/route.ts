import { NextResponse } from 'next/server'

interface SetReminderBody {
  email: string
  reminderDate: string
  country: string
  threshold: number
}

export async function POST(request: Request) {
  try {
    const body: SetReminderBody = await request.json()

    const payload = {
      email: body.email,
      reminder_type: 'crossover_review',
      reminder_date: body.reminderDate,
      crossover_country: body.country,
      crossover_threshold: body.threshold,
    }

    const webhookUrl = process.env.HUBSPOT_WEBHOOK_URL
    if (webhookUrl) {
      try {
        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) {
          await res.text()
          console.error('[set-reminder] External request failed:', res.status)
        }
      } catch (err) {
        console.error('[set-reminder]', err)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[set-reminder]', err)
    return NextResponse.json({ success: true })
  }
}
