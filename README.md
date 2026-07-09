
# AskIt

Multi-Agent AI Platform built with MERN stack, microservices architecture, RAG implementation, LangGraph orchestration, Docker containerization, and AWS deployment.

## Architecture

### Technology Stack

**Frontend**
- React 18
- TypeScript 5
- Vite 8
- React Router DOM 6
- Axios

**Backend Services**
- Node.js 22
- Express 5
- MongoDB (Mongoose)
- Passport.js (Google OAuth2)
- JWT authentication
- Redis (session storage)

**Infrastructure**
- Docker & Docker Compose
- AWS (EC2, S3, RDS)
- Nginx (reverse proxy)

### Microservices Structure

```
backend/
├── gateway/          # Port 8000 - API Gateway / Request Router
├── services/
│   ├── auth/        # Port 8001 - Authentication & User Management
│   ├── chat/        # Port 8002 - Conversational AI [Future]
│   ├── agent/       # Port 8003 - Agent Orchestration [Future]
│   └── billing/     # Port 8004 - Payments & Credits [Future]
└── shared/         # Common utilities & middleware
```

### Data Flow

```
Frontend (Port 5173)
    ↓
API Gateway (Port 8000)
    ↓ /api/auth/*    → Auth Service (Port 8001)
    ↓ /api/chat/*    → Chat Service (Port 8002)
    ↓ /api/agent/*   → Agent Service (Port 8003)
    ↓ /api/billing/* → Billing Service (Port 8004)
```

## Features

**Authentication**
- Google OAuth2 integration
- JWT-based stateless authentication
- Session management via Redis
- Role-based access control

**AI Agents**
- Chat Agent: Natural language conversation
- Code Agent: Code generation, execution, preview
- PDF Agent: Document generation
- PPT Agent: Presentation creation
- Image Agent: Visual content generation
- Search Agent: Real-time web research with image extraction

**Monetization**
- Credit-based consumption model
- Razorpay payment gateway integration
- Tiered pricing (Free / Starter / Pro)

**Technical Highlights**
- RAG (Retrieval Augmented Generation) for context-aware responses
- LangGraph for multi-step agent workflows
- Microservices communication via API Gateway
- Horizontal scaling per service
- Containerized deployment with Docker

## Project Structure

```
AskIt/
├── backend/
│   ├── gateway/
│   │   ├── config/
│   │   ├── index.js
│   │   ├── package.json
│   │   └── .env
│   │
│   ├── services/
│   │   ├── auth/
│   │   │   ├── config/
│   │   │   │   ├── db.js
│   │   │   │   └── passport.js
│   │   │   ├── controllers/
│   │   │   ├── middleware/
│   │   │   ├── models/
│   │   │   │   └── user.model.js
│   │   │   ├── routes/
│   │   │   │   ├── auth.routes.js
│   │   │   │   └── user.routes.js
│   │   │   ├── index.js
│   │   │   ├── package.json
│   │   │   └── .env
│   │   │
│   │   ├── chat/         [Planned]
│   │   ├── agent/        [Planned]
│   │   └── billing/      [Planned]
│   │
│   └── shared/           [Common utilities]
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   │   └── styles/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   └── Card.tsx
│   │   │   ├── common/
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   └── layout/
│   │   ├── features/
│   │   │   └── auth/
│   │   │       ├── components/
│   │   │       ├── hooks/
│   │   │       ├── services/
│   │   │       └── types/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── docker-compose.yml
├── Dockerfile
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js >= 22.x
- npm >= 10.x
- MongoDB Atlas account (free tier acceptable)
- Google Cloud Console project (for OAuth credentials)
- Docker Desktop (optional, for containerized deployment)
- Git for version control

## Installation

### Backend Services

```bash
# Clone repository
git clone <repository-url>
cd AskIt

# Install gateway dependencies
cd backend/gateway
npm install

# Install auth service dependencies
cd ../services/auth
npm install

# Return to root
cd ../../
```

### Frontend

```bash
cd frontend
npm install
```

## Configuration

### Environment Variables

Create `.env` files in each service directory:

**Gateway (.env)**
```
PORT=8000
AUTH_SERVICE_URL=http://localhost:8001
CHAT_SERVICE_URL=http://localhost:8002
AGENT_SERVICE_URL=http://localhost:8003
FRONTEND_URL=http://localhost:5173
```

**Auth Service (.env)**
```
PORT=8001
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
JWT_SECRET=<minimum-32-character-random-string>
SESSION_SECRET=<random-string-for-sessions>
FRONTEND_URL=http://localhost:5173
GATEWAY_URL=http://localhost:8000
```

**Frontend (.env.development or .env)**
```
VITE_API_BASE_URL=/api
VITE_GATEWAY_URL=http://localhost:8000
```

### Google OAuth2 Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Navigate to APIs & Services > Credentials
4. Create OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized redirect URIs:
   - Development: `http://localhost:8000/api/auth/google/callback`
   - Production: `https://yourdomain.com/api/auth/google/callback`
7. Copy Client ID and Secret to Auth service `.env`

### MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Build free tier cluster (M0 Sandbox)
3. Configure network access (allow IP 0.0.0.0/0 for development)
4. Create database user with read/write permissions
5. Copy connection string to Auth service `.env`

## Running the Application

### Development Mode

**Terminal 1: Auth Service**
```bash
cd backend/services/auth
npm run dev
# Server running on http://localhost:8001
```

**Terminal 2: API Gateway**
```bash
cd backend/gateway
npm run dev
# Server running on http://localhost:8000
# Shows auth service health status
```

**Terminal 3: Frontend**
```bash
cd frontend
npm run dev
# Application running on http://localhost:5173
```

### Production Mode (Docker)

```bash
# Build all containers
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Service |
|--------|----------|-------------|---------|
| GET | `/health` | Health check | Gateway |
| GET | `/api/auth/google` | Initiate Google OAuth | Auth |
| GET | `/api/auth/google/callback` | OAuth callback | Auth |
| POST | `/api/user/logout` | Invalidate session | Auth |
| GET | `/api/user/me` | Get current user profile | Auth |

### Future Endpoints (Planned)

| Method | Endpoint | Service |
|--------|----------|---------|
| POST | `/api/chat` | Send message | Chat |
| GET | `/api/chat/history` | Conversation history | Chat |
| POST | `/api/agent/code` | Generate code | Agent |
| POST | `/api/agent/pdf` | Generate PDF | Agent |
| POST | `/api/agent/ppt` | Generate PPT | Agent |
| POST | `/api/agent/image` | Generate image | Agent |
| GET | `/api/agent/search` | Web search | Agent |
| POST | `/api/billing/purchase` | Buy credits | Billing |

## Database Schema

### Users Collection (Auth Service)

```typescript
interface User {
  _id: ObjectId;
  googleId: string;           // Unique Google identifier
  name: string;
  email: string;             // Unique, lowercase
  picture: string;            // Google profile photo URL
  credits: number;           // Default: 100
  plan: 'free' | 'starter' | 'pro';
  createdAt: Date;
  updatedAt: Date;
}
```

## Deployment

### AWS EC2 (Manual)

1. Launch Ubuntu 22.04 LTS instance (t3.micro for testing)
2. Install Node.js 22, Docker, PM2, Nginx
3. Clone repository
4. Copy environment variables
5. Run database migrations (if any)
6. Start services with PM2
7. Configure Nginx reverse proxy
8. Obtain SSL certificate (Let's Encrypt)
9. Update DNS records

### Docker Swarm (Recommended)

1. Provision EC2 instance or use ECS
2. Clone repository
3. Create Docker Compose override file for production
4. Deploy stack
5. Configure load balancer
6. Set up monitoring (CloudWatch)

### CI/CD Pipeline (Optional)

GitHub Actions workflow:
- Push to main branch
- Run tests (lint, type-check, unit tests)
- Build Docker images
- Push to ECR
- Deploy to ECS/Fargate
- Run database migrations

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-service`)
3. Make changes following existing code style
4. Test thoroughly (local development environment)
5. Commit with conventional commits
6. Push to feature branch
7. Open Pull Request
8. Ensure CI passes before merge

## License

MIT License

## Author

Rajesh Kayal
g

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-service`)
3. Make changes following existing code style
4. Test thoroughly (local development environment)
5. Commit with conventional commits
6. Push to feature branch
7. Open Pull Request
8. Ensure CI passes before merge

## License

MIT License

## Author

Rajesh Kayal
