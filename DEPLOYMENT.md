# Deployment Guide

## Step 1: Database Setup (Supabase - Free Option)

1. Go to [Supabase](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (it looks like: `postgresql://postgres:[password]@[host]:5432/postgres`)
5. Save this as your `DATABASE_URL`

## Step 2: Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Application type: Web application
   - Name: Healthcare Market Research App
   - Authorized redirect URIs: 
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://your-app.vercel.app/api/auth/callback/google` (for production)
5. Copy the Client ID and Client Secret

## Step 3: Generate NextAuth Secret

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

## Step 4: Update n8n Workflow Callback URL

1. In your n8n workflow, update the callback URLs in "Success Callback" and "Error Callback" nodes
2. Replace `https://your-app.vercel.app/api/webhook/n8n-callback` with your actual Vercel domain

## Step 5: Deploy to Vercel

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/healthcare-market-research-app.git
git push -u origin main
```

2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables:
   - `DATABASE_URL`: Your Supabase connection string
   - `NEXTAUTH_SECRET`: The generated secret from Step 3
   - `NEXTAUTH_URL`: Your Vercel app URL (e.g., `https://your-app.vercel.app`)
   - `GOOGLE_CLIENT_ID`: From Step 2
   - `GOOGLE_CLIENT_SECRET`: From Step 2
   - `N8N_WEBHOOK_URL`: `https://getzero11-n8n-gz.hf.space/webhook/healthcare-report-generator`

6. Click "Deploy"

## Step 6: Run Database Migrations

After deployment, you need to run the database migrations:

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Link your project: `vercel link`
4. Run migrations: `vercel env pull .env.local && npx prisma migrate deploy`

## Step 7: Update Google OAuth Settings

After deployment:
1. Go back to Google Cloud Console
2. Update the OAuth 2.0 credentials
3. Add your production URL to authorized redirect URIs:
   `https://your-actual-vercel-domain.vercel.app/api/auth/callback/google`

## Step 8: Update n8n Workflow

Update the callback URLs in your n8n workflow:
1. Go to your n8n workflow
2. Update "Success Callback" node URL to: `https://your-actual-vercel-domain.vercel.app/api/webhook/n8n-callback`
3. Update "Error Callback" node URL to: `https://your-actual-vercel-domain.vercel.app/api/webhook/n8n-callback`
4. Save and activate the workflow

## Step 9: Test the Application

1. Visit your deployed app
2. Sign in with Google
3. Enter a healthcare keyword (e.g., "Digital Therapeutics")
4. Wait for the report to generate
5. Download the PDF when complete

## Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Make sure Supabase project is active
- Check if you need to run migrations: `npx prisma migrate deploy`

### OAuth Issues
- Verify redirect URIs match exactly (including https/http)
- Check that Google+ API is enabled
- Ensure client ID and secret are correct

### n8n Webhook Issues
- Verify the webhook URL is accessible
- Check n8n workflow is active
- Ensure callback URLs point to your deployed app

### Report Generation Issues
- Check n8n workflow logs
- Verify DeepSeek API credentials in n8n
- Check Gmail credentials for notifications

## Environment Variables Summary

```env
DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="https://your-app.vercel.app"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
N8N_WEBHOOK_URL="https://getzero11-n8n-gz.hf.space/webhook/healthcare-report-generator"
```

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for frontend errors
3. Check n8n workflow execution logs
4. Contact: ihealthcareanalyst@gmail.com