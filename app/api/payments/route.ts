import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createPaymentSchema = z.object({
  payeeId: z.string(),
  userId: z.string(),
  amount: z.number().positive(),
  payPeriod: z.enum(['THIRD', 'FIFTEENTH']),
  notes: z.string().optional()
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const month = searchParams.get('month')
    const year = searchParams.get('year')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const whereClause: any = { userId }
    
    if (month && year) {
      whereClause.month = parseInt(month)
      whereClause.year = parseInt(year)
    }

    const payments = await prisma.payment.findMany({
      where: whereClause,
      include: {
        payee: true
      },
      orderBy: { paidDate: 'desc' }
    })

    return NextResponse.json(payments)
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createPaymentSchema.parse(body)
    
    const currentDate = new Date()
    
    const payment = await prisma.payment.create({
      data: {
        ...validatedData,
        paidDate: currentDate,
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear()
      },
      include: {
        payee: true
      }
    })

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 })
    }
    
    console.error('Error creating payment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
