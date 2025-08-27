"use client"

import { useState } from "react"
import { Navigation } from "@/components/layout/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts"
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Download,
  Filter
} from "lucide-react"

// Mock data for charts
const monthlyData = [
  { month: "Jan", amount: 1780, paid: 1780, budget: 1800 },
  { month: "Feb", amount: 1750, paid: 1750, budget: 1800 },
  { month: "Mar", amount: 1820, paid: 1800, budget: 1800 },
  { month: "Apr", amount: 1780, paid: 1780, budget: 1800 },
  { month: "May", amount: 1790, paid: 1790, budget: 1800 },
  { month: "Jun", amount: 1780, paid: 1780, budget: 1800 },
]

const categoryData = [
  { name: "Housing", value: 1200, color: "#8884d8" },
  { name: "Utilities", value: 230, color: "#82ca9d" },
  { name: "Transportation", value: 350, color: "#ffc658" },
  { name: "Insurance", value: 180, color: "#ff7300" },
  { name: "Other", value: 120, color: "#00ff88" },
]

const yearOverYearData = [
  { month: "Jan", "2023": 1650, "2024": 1780 },
  { month: "Feb", "2023": 1680, "2024": 1750 },
  { month: "Mar", "2023": 1720, "2024": 1820 },
  { month: "Apr", "2023": 1700, "2024": 1780 },
  { month: "May", "2023": 1750, "2024": 1790 },
  { month: "Jun", "2023": 1730, "2024": 1780 },
]

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff88']

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months")
  
  const totalSpent = monthlyData.reduce((sum, month) => sum + month.paid, 0)
  const avgMonthly = totalSpent / monthlyData.length
  const lastMonth = monthlyData[monthlyData.length - 1]
  const previousMonth = monthlyData[monthlyData.length - 2]
  const monthlyChange = ((lastMonth.paid - previousMonth.paid) / previousMonth.paid) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Financial Reports</h1>
            <p className="text-muted-foreground">
              Analyze your spending patterns and budget performance
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">Last 3 months</SelectItem>
                <SelectItem value="6months">Last 6 months</SelectItem>
                <SelectItem value="12months">Last 12 months</SelectItem>
                <SelectItem value="ytd">Year to date</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="animate-slide-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSpent.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Last 6 months
              </p>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Average</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${Math.round(avgMonthly).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Per month
              </p>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Change</CardTitle>
              {monthlyChange >= 0 ? (
                <TrendingUp className="h-4 w-4 text-red-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${monthlyChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {monthlyChange >= 0 ? '+' : ''}{monthlyChange.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                vs last month
              </p>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget Status</CardTitle>
              <Badge variant={lastMonth.paid <= lastMonth.budget ? "default" : "destructive"}>
                {lastMonth.paid <= lastMonth.budget ? "On Track" : "Over Budget"}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(lastMonth.budget - lastMonth.paid).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {lastMonth.paid <= lastMonth.budget ? "Under budget" : "Over budget"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="animate-slide-up">
                <CardHeader>
                  <CardTitle>Monthly Spending</CardTitle>
                  <CardDescription>
                    Your spending vs budget over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, ""]} />
                      <Area 
                        type="monotone" 
                        dataKey="budget" 
                        stackId="1"
                        stroke="#e2e8f0" 
                        fill="#e2e8f0" 
                        name="Budget"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="paid" 
                        stackId="2"
                        stroke="#8884d8" 
                        fill="#8884d8" 
                        name="Spent"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <CardHeader>
                  <CardTitle>Spending by Category</CardTitle>
                  <CardDescription>
                    Breakdown of your expenses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value}`, ""]} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>
                  Detailed view of spending by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={categoryData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value) => [`$${value}`, ""]} />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryData.map((category, index) => (
                <Card key={category.name} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-2xl font-bold">${category.value}</p>
                      </div>
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {((category.value / categoryData.reduce((sum, c) => sum + c.value, 0)) * 100).toFixed(1)}% of total
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle>Spending Trends</CardTitle>
                <CardDescription>
                  Track your spending patterns over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, ""]} />
                    <Line 
                      type="monotone" 
                      dataKey="paid" 
                      stroke="#8884d8" 
                      strokeWidth={3}
                      name="Actual Spending"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="budget" 
                      stroke="#82ca9d" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Budget"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle>Year-over-Year Comparison</CardTitle>
                <CardDescription>
                  Compare your spending with previous year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={yearOverYearData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, ""]} />
                    <Bar dataKey="2023" fill="#82ca9d" name="2023" />
                    <Bar dataKey="2024" fill="#8884d8" name="2024" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="animate-slide-up">
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">2024 vs 2023</p>
                    <p className="text-2xl font-bold text-red-600">+8.2%</p>
                    <p className="text-sm text-muted-foreground">Increase in spending</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Average Monthly</p>
                    <p className="text-2xl font-bold">$1,783</p>
                    <p className="text-sm text-muted-foreground">2024 spending</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Highest Month</p>
                    <p className="text-2xl font-bold">$1,820</p>
                    <p className="text-sm text-muted-foreground">March 2024</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
