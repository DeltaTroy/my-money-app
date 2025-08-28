import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createOneTimePaymentSchema = z.object({
  name: z.string().min(1),
  amount: z.number().positive(),
  dueDate: z.string().datetime(),
  category: z.string().optional(),
  notes: z.string().optional(),
  userId: z.string()
})

const updateOneTimePaymentSchema = z.object({
  id: z.string(),
  isPaid: z.boolean(),
  paidDate: z.string().datetime().optional(),
  amount: z.number().positive().optional(),
  notes: z.string().optional()
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const includeCompleted = searchParams.get('includeCompleted') === 'true'
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const whereClause: any = { userId }
    
    if (!includeCompleted) {
      whereClause.isPaid = false
    }

    const oneTimePayments = await prisma.oneTimePayment.findMany({
      where: whereClause,
      orderBy: { dueDate: 'asc' }
    })

    return NextResponse.json(oneTimePayments)
  } catch (error) {
    console.error('Error fetching one-time payments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createOneTimePaymentSchema.parse(body)

    const oneTimePayment = await prisma.oneTimePayment.create({
      data: {
        ...validatedData,
        dueDate: new Date(validatedData.dueDate)
      }
    })

    return NextResponse.json(oneTimePayment, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 })
    }
    
    console.error('Error creating one-time payment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = updateOneTimePaymentSchema.parse(body)
    
    const updateData: any = {
      isPaid: validatedData.isPaid
    }
    
    if (validatedData.paidDate) {
      updateData.paidDate = new Date(validatedData.paidDate)
    }
    
    if (validatedData.amount) {
      updateData.amount = validatedData.amount
    }
    
    if (validatedData.notes !== undefined) {
      updateData.notes = validatedData.notes
    }

    const oneTimePayment = await prisma.oneTimePayment.update({
      where: { id: validatedData.id },
      data: updateData
    })

    return NextResponse.json(oneTimePayment)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 })
    }
    
    console.error('Error updating one-time payment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
