import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const filename = `${id}.pdf`
    const filepath = path.join('/tmp', filename)

    const buffer = await readFile(filepath)

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Teamed-Crossover-Memo.pdf"',
      },
    })
  } catch (err) {
    console.error('[pdf] File not found:', err)
    return new NextResponse(null, { status: 404 })
  }
}
