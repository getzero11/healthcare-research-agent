#!/bin/bash

# Healthcare Market Research App - GitHub Setup Script

echo "🏥 Setting up Healthcare Market Research App for GitHub..."

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "🚀 Initial commit: Healthcare Market Research Agent

Features:
- AI-powered market research with DeepSeek
- Modern React/Next.js frontend with healthcare theme
- Google OAuth authentication
- Real-time report status tracking
- PDF generation with charts and infographics
- Google Drive integration
- Email notifications
- n8n workflow integration via webhooks
- PostgreSQL database with Prisma ORM
- Vercel deployment ready

Tech Stack:
- Frontend: Next.js 14, React, TypeScript, Tailwind CSS
- Backend: Next.js API Routes, Prisma ORM
- Database: PostgreSQL (Supabase)
- Authentication: NextAuth.js with Google OAuth
- AI Integration: n8n workflow with DeepSeek AI
- Deployment: Vercel"

# Set main branch
git branch -M main

echo "✅ Git repository initialized!"
echo ""
echo "Next steps:"
echo "1. Create a private repository on GitHub"
echo "2. Run: git remote add origin https://github.com/yourusername/healthcare-market-research-app.git"
echo "3. Run: git push -u origin main"
echo "4. Follow DEPLOYMENT.md for Vercel setup"
echo ""
echo "🎉 Ready to deploy your Healthcare Market Research Agent!"