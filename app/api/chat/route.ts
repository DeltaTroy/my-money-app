import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const chatRequestSchema = z.object({
  message: z.string().min(1),
  userId: z.string()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, userId } = chatRequestSchema.parse(body)

    // Get user's financial data for context
    const [payees, recentPayments] = await Promise.all([
      prisma.payee.findMany({
        where: { userId, isActive: true }
      }),
      prisma.payment.findMany({
        where: { userId },
        include: { payee: true },
        orderBy: { paidDate: 'desc' },
        take: 10
      })
    ])

    // Generate AI response based on user data
    const response = await generateAIResponse(message, { payees, recentPayments })

    return NextResponse.json({ response })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 })
    }
    
    console.error('Error processing chat:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function generateAIResponse(message: string, context: any): Promise<string> {
  const { payees, recentPayments } = context
  const lowerMessage = message.toLowerCase()
  
  // Calculate totals
  const totalMonthly = payees.reduce((sum: number, p: any) => sum + p.amount, 0)
  const totalPaid = recentPayments
    .filter((p: any) => new Date(p.paidDate).getMonth() === new Date().getMonth())
    .reduce((sum: number, p: any) => sum + p.amount, 0)
  
  // Category breakdown
  const categories = payees.reduce((acc: any, payee: any) => {
    acc[payee.category] = (acc[payee.category] || 0) + payee.amount
    return acc
  }, {})
  
  const biggestCategory = Object.entries(categories)
    .sort(([,a]: any, [,b]: any) => b - a)[0]

  // Generate contextual responses
  if (lowerMessage.includes('total') || lowerMessage.includes('spend')) {
    return `Based on your data, your total monthly bills are $${totalMonthly.toLocaleString()}. You've paid $${totalPaid.toLocaleString()} so far this month across ${recentPayments.length} bills.`
  }
  
  if (lowerMessage.includes('biggest') || lowerMessage.includes('most expensive')) {
    return `Your biggest expense category is ${biggestCategory[0]} at $${biggestCategory[1]} per month, which represents ${((biggestCategory[1] / totalMonthly) * 100).toFixed(1)}% of your total monthly bills.`
  }
  
  if (lowerMessage.includes('budget') || lowerMessage.includes('track')) {
    const remaining = totalMonthly - totalPaid
    return `You have $${remaining.toLocaleString()} in remaining bills this month. You're ${remaining > 0 ? 'on track' : 'ahead of schedule'} with your payments! 🎯`
  }
  
  if (lowerMessage.includes('next') || lowerMessage.includes('due')) {
    const today = new Date()
    const currentDay = today.getDate()
    const nextPayDate = currentDay <= 3 ? 3 : currentDay <= 15 ? 15 : 3
    const nextPayees = payees.filter((p: any) => 
      (nextPayDate === 3 && p.payPeriod === 'THIRD') || 
      (nextPayDate === 15 && p.payPeriod === 'FIFTEENTH')
    )
    
    if (nextPayees.length > 0) {
      const nextTotal = nextPayees.reduce((sum: number, p: any) => sum + p.amount, 0)
      return `Your next bills are due on the ${nextPayDate}${nextPayDate === 3 ? 'rd' : 'th'}: ${nextPayees.map((p: any) => `${p.name} ($${p.amount})`).join(', ')}. Total: $${nextTotal.toLocaleString()}`
    }
  }
  
  if (lowerMessage.includes('save') || lowerMessage.includes('reduce')) {
    return `Here are some ways to optimize your budget:\n\n💡 **Smart Tips:**\n• Review your ${biggestCategory[0]} expenses for potential savings\n• Set up automatic payments to avoid late fees\n• Consider bundling services for discounts\n• Track variable expenses like utilities for patterns\n\nEven small optimizations can add up to significant savings over time!`
  }
  
  // Default response with personalized data
  return `I can help you with your $${totalMonthly.toLocaleString()} in monthly bills across ${payees.length} payees. Your spending is distributed across ${Object.keys(categories).length} categories. What specific aspect of your finances would you like to explore?`
}
