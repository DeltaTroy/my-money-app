import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createPayeeSchema = z.object({
  name: z.string().min(1),
  amount: z.number().positive(),
  dueDate: z.number().min(1).max(31),
  payPeriod: z.enum(['THIRD', 'FIFTEENTH']),
  category: z.string().optional(),
  userId: z.string()
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const payees = await prisma.payee.findMany({
      where: {
        userId,
        isActive: true
      },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    return NextResponse.json(payees)
  } catch (error) {
    console.error('Error fetching payees:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createPayeeSchema.parse(body)

    const payee = await prisma.payee.create({
      data: validatedData
    })

    return NextResponse.json(payee, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 })
    }
    
    console.error('Error creating payee:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
