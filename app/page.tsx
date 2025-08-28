"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/layout/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Plus,
  CheckCircle2,
  CalendarDays
} from "lucide-react"
import { format, isAfter, isBefore, addDays } from "date-fns"

// Mock data - will be replaced with real data from database
const mockPayees = [
  { id: "1", name: "Rent", amount: 1200, dueDate: 3, payPeriod: "THIRD", category: "Housing" },
  { id: "2", name: "Electric", amount: 150, dueDate: 15, payPeriod: "FIFTEENTH", category: "Utilities" },
  { id: "3", name: "Internet", amount: 80, dueDate: 3, payPeriod: "THIRD", category: "Utilities" },
  { id: "4", name: "Car Payment", amount: 350, dueDate: 15, payPeriod: "FIFTEENTH", category: "Transportation" },
]

const mockRecentPayments = [
  { id: "1", payeeName: "Rent", amount: 1200, paidDate: "2024-01-03", category: "Housing" },
  { id: "2", payeeName: "Electric", amount: 145, paidDate: "2024-01-15", category: "Utilities" },
]

const mockOneTimePayments = [
  {
    id: "ot1",
    name: "Car Registration",
    amount: 85,
    dueDate: "2024-02-20",
    category: "Transportation",
    isPaid: false,
    notes: "Annual registration renewal"
  },
  {
    id: "ot2",
    name: "Doctor Visit",
    amount: 150,
    dueDate: "2024-02-25",
    category: "Healthcare",
    isPaid: false,
    notes: "Annual checkup"
  },
  {
    id: "ot3",
    name: "Home Repair",
    amount: 300,
    dueDate: "2024-01-28",
    category: "Housing",
    isPaid: true,
    paidDate: "2024-01-28",
    notes: "Fixed leaky faucet"
  }
]

export default function Dashboard() {
  const [currentDate] = useState(new Date())
  const [upcomingBills, setUpcomingBills] = useState<any[]>([])
  const [upcomingOneTime, setUpcomingOneTime] = useState<any[]>([])
  const [totalMonthlyBills, setTotalMonthlyBills] = useState(0)

  useEffect(() => {
    // Calculate upcoming bills based on current date
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentDay = today.getDate()
    
    const upcoming = mockPayees.filter(payee => {
      const dueDate = payee.dueDate
      if (currentDay <= 3 && payee.payPeriod === "THIRD") return true
      if (currentDay > 3 && currentDay <= 15 && payee.payPeriod === "FIFTEENTH") return true
      if (currentDay > 15 && payee.payPeriod === "THIRD") return true
      return false
    }).slice(0, 3)
    
    // Get upcoming one-time payments (next 30 days)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    
    const upcomingOneTimeFiltered = mockOneTimePayments.filter(payment => 
      !payment.isPaid && 
      new Date(payment.dueDate) >= today && 
      new Date(payment.dueDate) <= thirtyDaysFromNow
    ).slice(0, 2)
    
    setUpcomingBills(upcoming)
    setUpcomingOneTime(upcomingOneTimeFiltered)
    setTotalMonthlyBills(mockPayees.reduce((sum, payee) => sum + payee.amount, 0))
  }, [])

  const nextPayDate = currentDate.getDate() <= 3 ? 3 : currentDate.getDate() <= 15 ? 15 : 3
  const nextPayMonth = currentDate.getDate() > 15 ? currentDate.getMonth() + 1 : currentDate.getMonth()

  const totalUpcomingOneTime = upcomingOneTime.reduce((sum, payment) => sum + payment.amount, 0)
  const completedOneTimeThisMonth = mockOneTimePayments.filter(p => 
    p.isPaid && p.paidDate && new Date(p.paidDate).getMonth() === new Date().getMonth()
  ).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's your financial overview for {format(currentDate, "MMMM yyyy")}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="animate-slide-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Bills</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalMonthlyBills.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Recurring obligations
              </p>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">One-Time Payments</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalUpcomingOneTime.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Due in next 30 days
              </p>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bills Paid</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockRecentPayments.length + completedOneTimeThisMonth}</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Pay Date</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{nextPayDate}</div>
              <p className="text-xs text-muted-foreground">
                {format(new Date(2024, nextPayMonth, nextPayDate), "MMM dd, yyyy")}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Bills */}
          <Card className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Upcoming Recurring Bills
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Bill
                </Button>
              </CardTitle>
              <CardDescription>
                Bills due in the next payment period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingBills.length > 0 ? (
                  upcomingBills.map((bill) => (
                    <div key={bill.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{bill.name}</p>
                          <p className="text-sm text-muted-foreground">Due {bill.dueDate}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${bill.amount}</p>
                        <Badge variant="secondary" className="text-xs">
                          {bill.category}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No upcoming bills</p>
                    <p className="text-sm">All caught up! 🎉</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* One-Time Payments */}
          <Card className="animate-slide-up" style={{ animationDelay: "0.5s" }}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Upcoming One-Time Payments
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payment
                </Button>
              </CardTitle>
              <CardDescription>
                Non-recurring payments due soon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingOneTime.length > 0 ? (
                  upcomingOneTime.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                          <CalendarDays className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium">{payment.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(payment.dueDate), "MMM dd, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${payment.amount}</p>
                        <Badge variant="outline" className="text-xs">
                          {payment.category}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarDays className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No upcoming one-time payments</p>
                    <p className="text-sm">Nothing scheduled</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8 animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest payments and transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{payment.payeeName}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(payment.paidDate), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${payment.amount}</p>
                    <Badge variant="outline" className="text-xs">
                      Recurring
                    </Badge>
                  </div>
                </div>
              ))}
              
              {mockOneTimePayments.filter(p => p.isPaid).map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{payment.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(payment.paidDate!), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${payment.amount}</p>
                    <Badge variant="outline" className="text-xs">
                      One-time
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mt-8 animate-slide-up" style={{ animationDelay: "0.7s" }}>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to manage your budget
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button className="h-20 flex flex-col space-y-2" variant="outline">
                <Plus className="w-6 h-6" />
                <span>Add Recurring Bill</span>
              </Button>
              <Button className="h-20 flex flex-col space-y-2" variant="outline">
                <CalendarDays className="w-6 h-6" />
                <span>Add One-Time Payment</span>
              </Button>
              <Button className="h-20 flex flex-col space-y-2" variant="outline">
                <CheckCircle2 className="w-6 h-6" />
                <span>Mark as Paid</span>
              </Button>
              <Button className="h-20 flex flex-col space-y-2" variant="outline">
                <TrendingUp className="w-6 h-6" />
                <span>View Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
