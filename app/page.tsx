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
  CheckCircle2
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

export default function Dashboard() {
  const [currentDate] = useState(new Date())
  const [upcomingBills, setUpcomingBills] = useState<any[]>([])
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
    
    setUpcomingBills(upcoming)
    setTotalMonthlyBills(mockPayees.reduce((sum, payee) => sum + payee.amount, 0))
  }, [])

  const nextPayDate = currentDate.getDate() <= 3 ? 3 : currentDate.getDate() <= 15 ? 15 : 3
  const nextPayMonth = currentDate.getDate() > 15 ? currentDate.getMonth() + 1 : currentDate.getMonth()

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
                Total monthly obligations
              </p>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
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

          <Card className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bills Paid</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockRecentPayments.length}</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingBills.length}</div>
              <p className="text-xs text-muted-foreground">
                Bills due soon
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Bills */}
          <Card className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Upcoming Bills
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

          {/* Recent Payments */}
          <Card className="animate-slide-up" style={{ animationDelay: "0.5s" }}>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>
                Your latest bill payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentPayments.length > 0 ? (
                  mockRecentPayments.map((payment) => (
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
                          Paid
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No recent payments</p>
                    <p className="text-sm">Start tracking your bills</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8 animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to manage your budget
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-20 flex flex-col space-y-2" variant="outline">
                <Plus className="w-6 h-6" />
                <span>Add New Bill</span>
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
