# 💰 My Money - AI Personal Budget App

A modern, intelligent personal budget tracking application built with Next.js, featuring AI-powered financial insights and comprehensive bill management.

![My Money App](https://img.shields.io/badge/Next.js-15.5.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-336791?style=for-the-badge&logo=postgresql)

## 🚀 Live Demo

**[View Live App](https://my-money.lindy.site)**

## ✨ Features

### 📊 **Dashboard**
- Real-time financial overview
- Upcoming bills and payments
- Monthly spending insights
- Quick action buttons

### 💳 **Bill Management**
- **Recurring Bills**: Track bills due on 3rd and 15th of each month
- **One-Time Payments**: Handle irregular expenses (car registration, medical bills, etc.)
- **Edit & Delete**: Full CRUD operations for all bills
- **Payment Tracking**: Mark bills as paid with automatic status updates
- **Categories**: Organize bills by Housing, Utilities, Transportation, etc.

### 📈 **Reports & Analytics**
- Interactive charts (Bar, Pie, Line, Area)
- Month-over-month comparisons
- Category breakdowns
- Spending trends analysis

### 🤖 **AI Chat Assistant**
- Contextual financial insights
- Suggested questions
- Real-time budget advice
- Smart spending recommendations

### ⚙️ **Settings**
- Profile management
- Theme switching (Light/Dark/System)
- Notification preferences
- Data export/import
- Security settings

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/ui, Lucide React Icons
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Styling**: Tailwind CSS with custom animations

## 🏗️ Architecture

```
my-money/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API Routes
│   │   ├── payees/        # Recurring bills API
│   │   ├── payments/      # Payment tracking API
│   │   ├── one-time-payments/ # One-time payments API
│   │   └── chat/          # AI chat API
│   ├── bills/             # Bills management page
│   ├── reports/           # Analytics & reports
│   ├── chat/              # AI chat interface
│   └── settings/          # User settings
├── components/            # Reusable UI components
│   ├── ui/               # Shadcn/ui components
│   └── layout/           # Layout components
├── lib/                  # Utilities & configurations
├── prisma/               # Database schema & migrations
└── public/               # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 13+
- npm or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HowAI-1811/my-money-app.git
   cd my-money-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your values:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/my_money"
   NEXTAUTH_SECRET="your-secret-key"
   OPENAI_API_KEY="your-openai-api-key" # Optional for AI features
   ```

4. **Set up the database**
   ```bash
   # Create database
   createdb my_money
   
   # Run migrations
   npx prisma migrate dev
   
   # Generate Prisma client
   npx prisma generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### Adding Recurring Bills
1. Go to **Bills** page
2. Click **"Add Recurring Bill"**
3. Fill in bill details (name, amount, due date, pay period)
4. Select category and save

### Managing One-Time Payments
1. Click **"Add One-Time Payment"**
2. Set custom due date (any date, not just 3rd/15th)
3. Add notes for context
4. Track until completion

### Editing Bills
1. Click the edit (✏️) button on any bill card
2. Modify any field (amount, date, category, etc.)
3. Save changes - updates appear immediately

### AI Chat
1. Go to **AI Chat** page
2. Ask questions about your finances
3. Get personalized insights and recommendations

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy automatically

3. **Set up Database**
   - Use Vercel Postgres or external PostgreSQL
   - Update `DATABASE_URL` in Vercel environment variables
   - Run migrations: `npx prisma migrate deploy`

### Deploy to Other Platforms

The app is compatible with:
- **Netlify** (with serverless functions)
- **Railway** (with built-in PostgreSQL)
- **Heroku** (with Heroku Postgres)
- **DigitalOcean App Platform**

## 🗄️ Database Schema

```sql
-- Users
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Recurring Bills (Payees)
CREATE TABLE payees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  due_date INTEGER NOT NULL,
  pay_period TEXT NOT NULL, -- 'THIRD' or 'FIFTEENTH'
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  user_id TEXT REFERENCES users(id)
);

-- One-Time Payments
CREATE TABLE one_time_payments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  due_date TIMESTAMP NOT NULL,
  category TEXT,
  is_paid BOOLEAN DEFAULT false,
  paid_date TIMESTAMP,
  notes TEXT,
  user_id TEXT REFERENCES users(id)
);

-- Payment History
CREATE TABLE payments (
  id TEXT PRIMARY KEY,
  amount DECIMAL NOT NULL,
  paid_date TIMESTAMP NOT NULL,
  pay_period TEXT NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  notes TEXT,
  payee_id TEXT REFERENCES payees(id),
  user_id TEXT REFERENCES users(id)
);
```

## 🎨 Features in Detail

### Bi-Monthly Payment System
- **3rd of Month**: First pay period bills
- **15th of Month**: Second pay period bills
- **Flexible Scheduling**: One-time payments for any date

### Smart Categories
- Housing (Rent, Mortgage, Insurance)
- Utilities (Electric, Gas, Water, Internet)
- Transportation (Car Payment, Gas, Insurance)
- Healthcare (Insurance, Doctor visits)
- Entertainment (Subscriptions, Dining)
- And more...

### AI-Powered Insights
- Spending pattern analysis
- Budget recommendations
- Bill payment reminders
- Financial goal suggestions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Prisma](https://prisma.io/) - Database ORM
- [Vercel](https://vercel.com/) - Deployment platform

## 📞 Support

If you have any questions or need help:

1. Check the [Issues](https://github.com/HowAI-1811/my-money-app/issues) page
2. Create a new issue if your problem isn't already listed
3. Provide detailed information about your setup and the issue

---

**Built with ❤️ for better financial management**

![GitHub stars](https://img.shields.io/github/stars/HowAI-1811/my-money-app?style=social)
![GitHub forks](https://img.shields.io/github/forks/HowAI-1811/my-money-app?style=social)
# My Money App - Live on Vercel!
