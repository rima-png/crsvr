import { NextResponse } from 'next/server'

interface SubmitLeadBody {
  lead: {
    firstName: string
    email: string
    companyName: string
    currentProvider: string
  }
  inputs: {
    country: string
    currentHeadcount: number
    plannedHeadcount: number
    eorFeePerMonth: number
  }
  result: {
    crossoverMonth: number | null
    totalEorCost: number
    totalEntityCost: number
    totalSavings: number
    status: string
    readinessScore: number
  }
}

export async function POST(request: Request) {
  try {
    const body: SubmitLeadBody = await request.json()

    const payload = {
      email: body.lead.email,
      firstname: body.lead.firstName,
      company: body.lead.companyName,
      crossover_country: body.inputs.country,
      crossover_current_headcount: body.inputs.currentHeadcount,
      crossover_planned_headcount: body.inputs.plannedHeadcount,
      crossover_month: body.result.crossoverMonth ?? 0,
      crossover_3yr_savings: body.result.totalSavings,
      crossover_current_provider: body.lead.currentProvider,
      crossover_readiness_score: body.result.readinessScore,
      crossover_status: body.result.status,
      crossover_eor_fee: body.inputs.eorFeePerMonth,
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
          console.error('[submit-lead] External request failed:', res.status)
        }
      } catch (err) {
        console.error('[submit-lead]', err)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[submit-lead]', err)
    return NextResponse.json({ success: true })
  }
}
