"use client"

import { useState, useRef, useEffect } from "react"
import { Navigation } from "@/components/layout/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Send,
  Bot,
  User,
  Sparkles,
  TrendingUp,
  DollarSign,
  Calendar,
  PieChart
} from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const suggestedQuestions = [
  "How much did I spend on utilities this month?",
  "What's my biggest expense category?",
  "Am I on track with my budget?",
  "Show me my spending trends",
  "When is my next bill due?",
  "How can I reduce my monthly expenses?"
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm your AI financial assistant. I can help you analyze your spending, track your bills, and provide insights about your budget. What would you like to know?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response (in real app, this would call OpenAI API)
    setTimeout(() => {
      const aiResponse = generateAIResponse(input)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const generateAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase()
    
    if (lowerQuestion.includes("utilities") || lowerQuestion.includes("electric") || lowerQuestion.includes("internet")) {
      return "Based on your data, you spent $230 on utilities this month. This includes $150 for electricity and $80 for internet. This is about 13% of your total monthly expenses and is consistent with your average spending."
    }
    
    if (lowerQuestion.includes("biggest expense") || lowerQuestion.includes("most expensive")) {
      return "Your biggest expense category is Housing at $1,200 per month (67% of total expenses), followed by Transportation at $350 (20%). This is a healthy distribution as housing typically should be 25-30% of income."
    }
    
    if (lowerQuestion.includes("budget") || lowerQuestion.includes("on track")) {
      return "You're doing great! You're currently $20 under budget this month. Your total spending is $1,780 against a budget of $1,800. Keep up the good work! 🎉"
    }
    
    if (lowerQuestion.includes("trends") || lowerQuestion.includes("spending pattern")) {
      return "Your spending has been relatively stable over the past 6 months, averaging $1,783 per month. There was a slight increase in March ($1,820) but you've maintained good consistency overall. Your year-over-year spending is up 8.2% compared to last year."
    }
    
    if (lowerQuestion.includes("next bill") || lowerQuestion.includes("due")) {
      return "Your next bills are due on the 15th: Electric ($150) and Car Payment ($350). That's a total of $500 due in a few days. Would you like me to remind you closer to the date?"
    }
    
    if (lowerQuestion.includes("reduce") || lowerQuestion.includes("save") || lowerQuestion.includes("cut")) {
      return "Here are some ways to reduce your monthly expenses:\n\n1. **Utilities**: Consider energy-efficient appliances or a different internet plan\n2. **Transportation**: Look into refinancing your car loan for a lower rate\n3. **Subscriptions**: Review and cancel unused services\n4. **Negotiate**: Call providers to ask for better rates\n\nEven small changes can add up to significant savings over time!"
    }
    
    return "I understand you're asking about your finances. Based on your current data, you have 4 active bills totaling $1,780 per month. Your spending is well-organized across Housing (67%), Transportation (20%), and Utilities (13%). Is there something specific you'd like to know more about?"
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
            <Sparkles className="w-8 h-8 mr-3 text-primary" />
            AI Financial Assistant
          </h1>
          <p className="text-muted-foreground">
            Get insights about your spending, budget analysis, and personalized financial advice
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="w-5 h-5 text-primary" />
                  <span>Chat</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[450px] p-4" ref={scrollAreaRef}>
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <div className="flex items-start space-x-2">
                            {message.role === "assistant" && (
                              <Bot className="w-4 h-4 mt-0.5 text-primary" />
                            )}
                            {message.role === "user" && (
                              <User className="w-4 h-4 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm whitespace-pre-line">{message.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {message.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                          <div className="flex items-center space-x-2">
                            <Bot className="w-4 h-4 text-primary" />
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                
                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Ask me about your finances..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      disabled={isLoading}
                    />
                    <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Monthly Total</span>
                  </div>
                  <span className="font-semibold">$1,780</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Next Due</span>
                  </div>
                  <span className="font-semibold">15th</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                    <span className="text-sm">Budget Status</span>
                  </div>
                  <Badge variant="default">On Track</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Suggested Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Suggested Questions</CardTitle>
                <CardDescription>
                  Click to ask common questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-left h-auto p-2 text-wrap"
                      onClick={() => handleSuggestedQuestion(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    💡 Tip
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    You're spending 67% on housing, which is higher than the recommended 30%. Consider ways to reduce this.
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    ✅ Good Job
                  </p>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    You've been consistent with payments and staying within budget!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
