# Healthcare Market Research Agent

AI-powered web application for generating comprehensive healthcare market research reports with intelligent insights, market sizing, competitive analysis, and forecasts.

## Features

- 🤖 **AI-Powered Analysis**: Uses DeepSeek AI for comprehensive market research
- 📊 **Visual Infographics**: Generates charts, graphs, and data visualizations
- 📄 **PDF Reports**: Professional market research reports in PDF format
- ☁️ **Cloud Storage**: Automatic backup to Google Drive
- 🔐 **User Authentication**: Secure Google OAuth integration
- 📧 **Email Notifications**: Success/failure notifications via Gmail
- 📱 **Responsive Design**: Modern, mobile-friendly interface
- ⚡ **Real-time Status**: Live progress tracking for report generation

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js with Google OAuth
- **AI Integration**: n8n workflow with DeepSeek AI
- **Deployment**: Vercel

## Setup Instructions

### 1. Clone and Install

\`\`\`bash
git clone <your-repo-url>
cd healthcare-market-research-app
npm install
\`\`\`

### 2. Database Setup

1. Create a PostgreSQL database
2. Copy \`.env.example\` to \`.env.local\`
3. Update \`DATABASE_URL\` with your database connection string
4. Run database migrations:

\`\`\`bash
npx prisma migrate dev
npx prisma generate
\`\`\`

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: \`http://localhost:3000/api/auth/callback/google\`
5. Copy Client ID and Client Secret to \`.env.local\`

### 4. NextAuth Configuration

Generate a secret key:
\`\`\`bash
openssl rand -base64 32
\`\`\`

Add to \`.env.local\`:
\`\`\`
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"
\`\`\`

### 5. n8n Webhook Setup

1. The n8n workflow webhook URL should be set in \`.env.local\`
2. Default: \`N8N_WEBHOOK_URL="https://getzero11-n8n-gz.hf.space/webhook/healthcare-report-generator"\`

### 6. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## n8n Workflow Integration

The application integrates with a modified n8n workflow that:

1. **Receives webhook** with keyword and report ID
2. **Generates market research** using DeepSeek AI
3. **Creates PDF report** with charts and infographics
4. **Saves to Google Drive** for backup
5. **Sends callback** to update report status
6. **Sends email notifications** for success/failure

### Webhook Payload Format

\`\`\`json
{
  "keyword": "Alzheimer's Disease Diagnostics",
  "reportId": "clx123abc456",
  "userEmail": "user@example.com"
}
\`\`\`

### Callback Webhook Format

\`\`\`json
{
  "reportId": "clx123abc456",
  "status": "completed",
  "pdfUrl": "https://example.com/report.pdf",
  "driveUrl": "https://drive.google.com/file/d/xyz/view",
  "error": null
}
\`\`\`

## Deployment to Vercel

### 1. Push to GitHub

\`\`\`bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
\`\`\`

### 2. Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables:
   - \`DATABASE_URL\`
   - \`NEXTAUTH_SECRET\`
   - \`NEXTAUTH_URL\` (your Vercel domain)
   - \`GOOGLE_CLIENT_ID\`
   - \`GOOGLE_CLIENT_SECRET\`
   - \`N8N_WEBHOOK_URL\`
5. Deploy

### 3. Update OAuth Settings

After deployment, update Google OAuth settings:
- Add your Vercel domain to authorized redirect URIs
- Format: \`https://your-app.vercel.app/api/auth/callback/google\`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| \`DATABASE_URL\` | PostgreSQL connection string | Yes |
| \`NEXTAUTH_SECRET\` | NextAuth.js secret key | Yes |
| \`NEXTAUTH_URL\` | Application base URL | Yes |
| \`GOOGLE_CLIENT_ID\` | Google OAuth client ID | Yes |
| \`GOOGLE_CLIENT_SECRET\` | Google OAuth client secret | Yes |
| \`N8N_WEBHOOK_URL\` | n8n workflow webhook URL | Yes |

## API Endpoints

- \`POST /api/generate-report\` - Start report generation
- \`GET /api/report-status/[id]\` - Get report status
- \`POST /api/webhook/n8n-callback\` - n8n callback webhook
- \`/api/auth/*\` - NextAuth.js authentication endpoints

## Database Schema

### Reports Table
- \`id\`: Unique report identifier
- \`keyword\`: Healthcare market keyword
- \`status\`: Report generation status
- \`userEmail\`: User who requested the report
- \`pdfUrl\`: Direct PDF download URL
- \`driveUrl\`: Google Drive view URL
- \`error\`: Error message if failed
- \`createdAt\`: Report creation timestamp
- \`completedAt\`: Report completion timestamp

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

Private repository - All rights reserved.

## Support

For support or questions, contact: ihealthcareanalyst@gmail.com