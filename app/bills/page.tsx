"use client"

import { useState } from "react"
import { Navigation } from "@/components/layout/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock
} from "lucide-react"
import { format } from "date-fns"

// Mock data
const mockPayees = [
  { 
    id: "1", 
    name: "Rent", 
    amount: 1200, 
    dueDate: 3, 
    payPeriod: "THIRD", 
    category: "Housing",
    isActive: true,
    lastPaid: "2024-01-03"
  },
  { 
    id: "2", 
    name: "Electric", 
    amount: 150, 
    dueDate: 15, 
    payPeriod: "FIFTEENTH", 
    category: "Utilities",
    isActive: true,
    lastPaid: "2024-01-15"
  },
  { 
    id: "3", 
    name: "Internet", 
    amount: 80, 
    dueDate: 3, 
    payPeriod: "THIRD", 
    category: "Utilities",
    isActive: true,
    lastPaid: "2024-01-03"
  },
  { 
    id: "4", 
    name: "Car Payment", 
    amount: 350, 
    dueDate: 15, 
    payPeriod: "FIFTEENTH", 
    category: "Transportation",
    isActive: true,
    lastPaid: "2024-01-15"
  },
]

const categories = ["Housing", "Utilities", "Transportation", "Insurance", "Food", "Entertainment", "Other"]

export default function BillsPage() {
  const [payees, setPayees] = useState(mockPayees)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newPayee, setNewPayee] = useState({
    name: "",
    amount: "",
    dueDate: "",
    payPeriod: "",
    category: ""
  })

  const handleAddPayee = () => {
    if (newPayee.name && newPayee.amount && newPayee.dueDate && newPayee.payPeriod) {
      const payee = {
        id: Date.now().toString(),
        name: newPayee.name,
        amount: parseFloat(newPayee.amount),
        dueDate: parseInt(newPayee.dueDate),
        payPeriod: newPayee.payPeriod,
        category: newPayee.category || "Other",
        isActive: true,
        lastPaid: null
      }
      setPayees([...payees, payee])
      setNewPayee({ name: "", amount: "", dueDate: "", payPeriod: "", category: "" })
      setIsAddDialogOpen(false)
    }
  }

  const handleMarkAsPaid = (payeeId: string, amount: number) => {
    setPayees(payees.map(payee => 
      payee.id === payeeId 
        ? { ...payee, lastPaid: new Date().toISOString().split('T')[0] }
        : payee
    ))
  }

  const thirdPayees = payees.filter(p => p.payPeriod === "THIRD")
  const fifteenthPayees = payees.filter(p => p.payPeriod === "FIFTEENTH")

  const PayeeCard = ({ payee }: { payee: any }) => {
    const isRecentlyPaid = payee.lastPaid && 
      new Date(payee.lastPaid).getMonth() === new Date().getMonth()

    return (
      <Card className="animate-slide-up">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{payee.name}</h3>
                <p className="text-sm text-muted-foreground">Due on the {payee.dueDate}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">${payee.amount}</p>
              <Badge variant="secondary">{payee.category}</Badge>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isRecentlyPaid ? (
                <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Paid this month
                </Badge>
              ) : (
                <Badge variant="outline">
                  <Clock className="w-3 h-3 mr-1" />
                  Pending
                </Badge>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleMarkAsPaid(payee.id, payee.amount)}
                disabled={isRecentlyPaid}
              >
                {isRecentlyPaid ? "Paid" : "Mark Paid"}
              </Button>
              <Button size="sm" variant="ghost">
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {payee.lastPaid && (
            <p className="text-xs text-muted-foreground mt-2">
              Last paid: {format(new Date(payee.lastPaid), "MMM dd, yyyy")}
            </p>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Bills & Payees</h1>
            <p className="text-muted-foreground">
              Manage your recurring bills and payment schedule
            </p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Bill
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Bill</DialogTitle>
                <DialogDescription>
                  Add a new recurring bill to your payment schedule.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Bill Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Electric Bill"
                    value={newPayee.name}
                    onChange={(e) => setNewPayee({...newPayee, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={newPayee.amount}
                    onChange={(e) => setNewPayee({...newPayee, amount: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="number"
                    min="1"
                    max="31"
                    placeholder="Day of month (1-31)"
                    value={newPayee.dueDate}
                    onChange={(e) => setNewPayee({...newPayee, dueDate: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="payPeriod">Pay Period</Label>
                  <Select value={newPayee.payPeriod} onValueChange={(value) => setNewPayee({...newPayee, payPeriod: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pay period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="THIRD">3rd of the month</SelectItem>
                      <SelectItem value="FIFTEENTH">15th of the month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newPayee.category} onValueChange={(value) => setNewPayee({...newPayee, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <Button onClick={handleAddPayee} className="flex-1">
                    Add Bill
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Bills ({payees.length})</TabsTrigger>
            <TabsTrigger value="third">3rd of Month ({thirdPayees.length})</TabsTrigger>
            <TabsTrigger value="fifteenth">15th of Month ({fifteenthPayees.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {payees.map((payee) => (
                <PayeeCard key={payee.id} payee={payee} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="third" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Bills Due on the 3rd</span>
                </CardTitle>
                <CardDescription>
                  Total: ${thirdPayees.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                </CardDescription>
              </CardHeader>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {thirdPayees.map((payee) => (
                <PayeeCard key={payee.id} payee={payee} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="fifteenth" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Bills Due on the 15th</span>
                </CardTitle>
                <CardDescription>
                  Total: ${fifteenthPayees.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                </CardDescription>
              </CardHeader>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fifteenthPayees.map((payee) => (
                <PayeeCard key={payee.id} payee={payee} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
