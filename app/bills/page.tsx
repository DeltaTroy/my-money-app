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
  Clock,
  CalendarDays
} from "lucide-react"
import { format } from "date-fns"

// Mock data for recurring bills
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

// Mock data for one-time payments
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

const categories = ["Housing", "Utilities", "Transportation", "Insurance", "Food", "Entertainment", "Healthcare", "Other"]

export default function BillsPage() {
  const [payees, setPayees] = useState(mockPayees)
  const [oneTimePayments, setOneTimePayments] = useState(mockOneTimePayments)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isAddOneTimeDialogOpen, setIsAddOneTimeDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isEditOneTimeDialogOpen, setIsEditOneTimeDialogOpen] = useState(false)
  const [editingPayee, setEditingPayee] = useState<any>(null)
  const [editingOneTimePayment, setEditingOneTimePayment] = useState<any>(null)
  const [newPayee, setNewPayee] = useState({
    name: "",
    amount: "",
    dueDate: "",
    payPeriod: "",
    category: ""
  })
  const [newOneTimePayment, setNewOneTimePayment] = useState({
    name: "",
    amount: "",
    dueDate: "",
    category: "",
    notes: ""
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

  const handleEditPayee = (payee: any) => {
    setEditingPayee(payee)
    setNewPayee({
      name: payee.name,
      amount: payee.amount.toString(),
      dueDate: payee.dueDate.toString(),
      payPeriod: payee.payPeriod,
      category: payee.category
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdatePayee = () => {
    if (editingPayee && newPayee.name && newPayee.amount && newPayee.dueDate && newPayee.payPeriod) {
      const updatedPayees = payees.map(payee => 
        payee.id === editingPayee.id 
          ? {
              ...payee,
              name: newPayee.name,
              amount: parseFloat(newPayee.amount),
              dueDate: parseInt(newPayee.dueDate),
              payPeriod: newPayee.payPeriod,
              category: newPayee.category || "Other"
            }
          : payee
      )
      setPayees(updatedPayees)
      setNewPayee({ name: "", amount: "", dueDate: "", payPeriod: "", category: "" })
      setEditingPayee(null)
      setIsEditDialogOpen(false)
    }
  }

  const handleAddOneTimePayment = () => {
    if (newOneTimePayment.name && newOneTimePayment.amount && newOneTimePayment.dueDate) {
      const payment = {
        id: Date.now().toString(),
        name: newOneTimePayment.name,
        amount: parseFloat(newOneTimePayment.amount),
        dueDate: newOneTimePayment.dueDate,
        category: newOneTimePayment.category || "Other",
        isPaid: false,
        notes: newOneTimePayment.notes
      }
      setOneTimePayments([...oneTimePayments, payment])
      setNewOneTimePayment({ name: "", amount: "", dueDate: "", category: "", notes: "" })
      setIsAddOneTimeDialogOpen(false)
    }
  }

  const handleEditOneTimePayment = (payment: any) => {
    setEditingOneTimePayment(payment)
    setNewOneTimePayment({
      name: payment.name,
      amount: payment.amount.toString(),
      dueDate: payment.dueDate,
      category: payment.category,
      notes: payment.notes || ""
    })
    setIsEditOneTimeDialogOpen(true)
  }

  const handleUpdateOneTimePayment = () => {
    if (editingOneTimePayment && newOneTimePayment.name && newOneTimePayment.amount && newOneTimePayment.dueDate) {
      const updatedPayments = oneTimePayments.map(payment =>
        payment.id === editingOneTimePayment.id
          ? {
              ...payment,
              name: newOneTimePayment.name,
              amount: parseFloat(newOneTimePayment.amount),
              dueDate: newOneTimePayment.dueDate,
              category: newOneTimePayment.category || "Other",
              notes: newOneTimePayment.notes
            }
          : payment
      )
      setOneTimePayments(updatedPayments)
      setNewOneTimePayment({ name: "", amount: "", dueDate: "", category: "", notes: "" })
      setEditingOneTimePayment(null)
      setIsEditOneTimeDialogOpen(false)
    }
  }

  const handleMarkAsPaid = (payeeId: string, amount: number) => {
    setPayees(payees.map(payee => 
      payee.id === payeeId 
        ? { ...payee, lastPaid: new Date().toISOString().split('T')[0] }
        : payee
    ))
  }

  const handleMarkOneTimeAsPaid = (paymentId: string) => {
    setOneTimePayments(oneTimePayments.map(payment =>
      payment.id === paymentId
        ? { ...payment, isPaid: true, paidDate: new Date().toISOString().split('T')[0] }
        : payment
    ))
  }

  const handleDeletePayee = (payeeId: string) => {
    setPayees(payees.filter(payee => payee.id !== payeeId))
  }

  const handleDeleteOneTimePayment = (paymentId: string) => {
    setOneTimePayments(oneTimePayments.filter(payment => payment.id !== paymentId))
  }

  const thirdPayees = payees.filter(p => p.payPeriod === "THIRD")
  const fifteenthPayees = payees.filter(p => p.payPeriod === "FIFTEENTH")
  const upcomingOneTime = oneTimePayments.filter(p => !p.isPaid && new Date(p.dueDate) >= new Date())
  const completedOneTime = oneTimePayments.filter(p => p.isPaid)

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
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => handleEditPayee(payee)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => handleDeletePayee(payee.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
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

  const OneTimePaymentCard = ({ payment }: { payment: any }) => {
    const isOverdue = new Date(payment.dueDate) < new Date() && !payment.isPaid
    const dueDate = new Date(payment.dueDate)

    return (
      <Card className="animate-slide-up">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{payment.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Due {format(dueDate, "MMM dd, yyyy")}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">${payment.amount}</p>
              <Badge variant="secondary">{payment.category}</Badge>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {payment.isPaid ? (
                <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              ) : isOverdue ? (
                <Badge variant="destructive">
                  <Clock className="w-3 h-3 mr-1" />
                  Overdue
                </Badge>
              ) : (
                <Badge variant="outline">
                  <Clock className="w-3 h-3 mr-1" />
                  Upcoming
                </Badge>
              )}
            </div>
            
            <div className="flex space-x-2">
              {!payment.isPaid && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMarkOneTimeAsPaid(payment.id)}
                >
                  Mark Paid
                </Button>
              )}
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => handleEditOneTimePayment(payment)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => handleDeleteOneTimePayment(payment.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {payment.notes && (
            <p className="text-xs text-muted-foreground mt-2">
              Note: {payment.notes}
            </p>
          )}
          
          {payment.paidDate && (
            <p className="text-xs text-muted-foreground mt-1">
              Paid: {format(new Date(payment.paidDate), "MMM dd, yyyy")}
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Bills & Payments</h1>
            <p className="text-muted-foreground">
              Manage your recurring bills and one-time payments
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Recurring Bill
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Recurring Bill</DialogTitle>
                  <DialogDescription>
                    Add a new bill that repeats on the 3rd or 15th of each month.
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

            {/* Edit Recurring Bill Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Recurring Bill</DialogTitle>
                  <DialogDescription>
                    Update the details of your recurring bill.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="editName">Bill Name</Label>
                    <Input
                      id="editName"
                      placeholder="e.g., Electric Bill"
                      value={newPayee.name}
                      onChange={(e) => setNewPayee({...newPayee, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="editAmount">Amount</Label>
                    <Input
                      id="editAmount"
                      type="number"
                      placeholder="0.00"
                      value={newPayee.amount}
                      onChange={(e) => setNewPayee({...newPayee, amount: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="editDueDate">Due Date</Label>
                    <Input
                      id="editDueDate"
                      type="number"
                      min="1"
                      max="31"
                      placeholder="Day of month (1-31)"
                      value={newPayee.dueDate}
                      onChange={(e) => setNewPayee({...newPayee, dueDate: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="editPayPeriod">Pay Period</Label>
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
                    <Label htmlFor="editCategory">Category</Label>
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
                    <Button onClick={handleUpdatePayee} className="flex-1">
                      Update Bill
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddOneTimeDialogOpen} onOpenChange={setIsAddOneTimeDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add One-Time Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add One-Time Payment</DialogTitle>
                  <DialogDescription>
                    Add a payment that doesn't repeat monthly.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="otName">Payment Name</Label>
                    <Input
                      id="otName"
                      placeholder="e.g., Car Registration"
                      value={newOneTimePayment.name}
                      onChange={(e) => setNewOneTimePayment({...newOneTimePayment, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="otAmount">Amount</Label>
                    <Input
                      id="otAmount"
                      type="number"
                      placeholder="0.00"
                      value={newOneTimePayment.amount}
                      onChange={(e) => setNewOneTimePayment({...newOneTimePayment, amount: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="otDueDate">Due Date</Label>
                    <Input
                      id="otDueDate"
                      type="date"
                      value={newOneTimePayment.dueDate}
                      onChange={(e) => setNewOneTimePayment({...newOneTimePayment, dueDate: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="otCategory">Category</Label>
                    <Select value={newOneTimePayment.category} onValueChange={(value) => setNewOneTimePayment({...newOneTimePayment, category: value})}>
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
                  
                  <div>
                    <Label htmlFor="otNotes">Notes (Optional)</Label>
                    <Input
                      id="otNotes"
                      placeholder="Additional notes..."
                      value={newOneTimePayment.notes}
                      onChange={(e) => setNewOneTimePayment({...newOneTimePayment, notes: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex space-x-2 pt-4">
                    <Button onClick={handleAddOneTimePayment} className="flex-1">
                      Add Payment
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddOneTimeDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit One-Time Payment Dialog */}
            <Dialog open={isEditOneTimeDialogOpen} onOpenChange={setIsEditOneTimeDialogOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit One-Time Payment</DialogTitle>
                  <DialogDescription>
                    Update the details of your one-time payment.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="editOtName">Payment Name</Label>
                    <Input
                      id="editOtName"
                      placeholder="e.g., Car Registration"
                      value={newOneTimePayment.name}
                      onChange={(e) => setNewOneTimePayment({...newOneTimePayment, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="editOtAmount">Amount</Label>
                    <Input
                      id="editOtAmount"
                      type="number"
                      placeholder="0.00"
                      value={newOneTimePayment.amount}
                      onChange={(e) => setNewOneTimePayment({...newOneTimePayment, amount: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="editOtDueDate">Due Date</Label>
                    <Input
                      id="editOtDueDate"
                      type="date"
                      value={newOneTimePayment.dueDate}
                      onChange={(e) => setNewOneTimePayment({...newOneTimePayment, dueDate: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="editOtCategory">Category</Label>
                    <Select value={newOneTimePayment.category} onValueChange={(value) => setNewOneTimePayment({...newOneTimePayment, category: value})}>
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
                  
                  <div>
                    <Label htmlFor="editOtNotes">Notes (Optional)</Label>
                    <Input
                      id="editOtNotes"
                      placeholder="Additional notes..."
                      value={newOneTimePayment.notes}
                      onChange={(e) => setNewOneTimePayment({...newOneTimePayment, notes: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex space-x-2 pt-4">
                    <Button onClick={handleUpdateOneTimePayment} className="flex-1">
                      Update Payment
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditOneTimeDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="recurring" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="recurring">Recurring Bills ({payees.length})</TabsTrigger>
            <TabsTrigger value="one-time">One-Time ({upcomingOneTime.length})</TabsTrigger>
            <TabsTrigger value="third">3rd of Month ({thirdPayees.length})</TabsTrigger>
            <TabsTrigger value="fifteenth">15th of Month ({fifteenthPayees.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recurring" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {payees.map((payee) => (
                <PayeeCard key={payee.id} payee={payee} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="one-time" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CalendarDays className="w-5 h-5" />
                  <span>One-Time Payments</span>
                </CardTitle>
                <CardDescription>
                  Payments that don't follow your regular schedule
                </CardDescription>
              </CardHeader>
            </Card>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Upcoming</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingOneTime.map((payment) => (
                  <OneTimePaymentCard key={payment.id} payment={payment} />
                ))}
                {upcomingOneTime.length === 0 && (
                  <div className="col-span-2 text-center py-8 text-muted-foreground">
                    <CalendarDays className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No upcoming one-time payments</p>
                  </div>
                )}
              </div>
              
              {completedOneTime.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold mt-8">Completed</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {completedOneTime.map((payment) => (
                      <OneTimePaymentCard key={payment.id} payment={payment} />
                    ))}
                  </div>
                </>
              )}
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
