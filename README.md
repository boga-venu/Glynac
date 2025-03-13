# Glynac Workplace Analytics

A comprehensive workplace analytics dashboard built with Next.js, Prisma, and Recharts to monitor employee behavior, risk management, retention metrics, and performance analysis.

![Screenshot (77)](https://github.com/user-attachments/assets/1d286791-d7b3-4d49-bead-6d51c6a4de45)

## Features

### Authentication
- Secure login with JWT tokens using Next-Auth
- Password hashing with bcrypt
- Prisma ORM integration with PostgreSQL
- CSRF protection
- Session management

### Dashboard
- Real-time analytics with React Query for data caching
- Interactive charts using Recharts
- Risk alerts monitoring system
- Performance and retention metrics
- Modern UI with shadcn/ui components

### Risk Management
- Sexual harassment detection
- Abusive language monitoring
- Employee-leader dispute tracking
- Client interaction monitoring (missed meetings, lies to clients)
- Security risk analysis (sharing confidential information, password exposures)

### Retention Analytics
- Employee retention rate tracking
- Calendar workload analysis
- Complaint trend monitoring
- Communication volume metrics
- Sentiment analysis of workplace communications
- Meeting load optimization suggestions

### Performance Metrics
- Performance drag visualization
- Response time analysis
- Negative communication tracking
- Task completion monitoring
- Skill utilization analysis

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS, shadcn/ui, Lucide icons
- **State Management**: React Query for server state
- **Authentication**: NextAuth.js with JWT
- **Database**: PostgreSQL with Supabase
- **ORM**: Prisma
- **Data Visualization**: Recharts
- **API Handling**: Axios
- **Form Validation**: Zod
- **Deployment**: Render with Supabase connection pooling

## Installation and Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL database (or Supabase account)

### Setup
1. Clone the repository
```bash
git clone https://github.com/boga-venu/Glynac.git
cd Glynac
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file with your environment variables:
```
DATABASE_URL="postgresql://username:password@host:port/database"
DIRECT_URL="postgresql://username:password@host:port/database"
NEXTAUTH_SECRET="your-secure-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

4. Run Prisma migrations
```bash
npx prisma migrate dev
```

5. Seed the database
```bash
npx prisma db seed
```

6. Start the development server
```bash
npm run dev
```

7. Navigate to [Glynac](https://workspace-analytics-381y.onrender.com/) to see the application

## Production Deployment

### Deploying to Render

1. Create a new Web Service in Render
2. Connect your GitHub repository
3. Add the following environment variables:
   - `DATABASE_URL`: Your Supabase connection pooler URL
   - `DIRECT_URL`: Your direct Supabase connection URL
   - `NEXTAUTH_SECRET`: A secure secret for NextAuth
   - `NEXTAUTH_URL`: Your Render deployment URL
   - `PRISMA_CLIENT_ENGINE_TYPE`: Set to "dataproxy"
4. Deploy the application

## Authentication

The application uses NextAuth.js with JWT tokens for authentication. Users can log in with their email and password, which are validated against the database. Passwords are securely hashed using bcrypt.

### Default Credentials

For testing purposes, you can use the following credentials:
- Email: `admin@company.com`
- Password: `admin123`

## Database Schema

The database schema is defined using Prisma and includes models for:

- Users (employees)
- Messages (communications)
- Calendar items (meetings and focus time)
- Files and file activities
- Risk alerts
- Performance data
- Retention data

## API Routes

The application provides several API endpoints for fetching data:

- `/api/dashboard/*` - Dashboard data endpoints
- `/api/risks/*` - Risk management endpoints
- `/api/performance/*` - Performance metrics endpoints
- `/api/retention/*` - Retention analytics endpoints
- `/api/employees/*` - Employee details endpoints

## Acknowledgements

- [shadcn/ui](https://ui.shadcn.com/) for the UI components
- [Recharts](https://recharts.org/en-US/) for the data visualization
- [NextAuth.js](https://next-auth.js.org/) for authentication
- [Prisma](https://www.prisma.io/) for database access
- [React Query](https://tanstack.com/query/latest) for data fetching
- [Tailwind CSS](https://tailwindcss.com/) for styling
