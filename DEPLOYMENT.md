# Deployment Guide - Simplified Version

## Overview
This is a simplified version that works with keyword-only input and connects directly to your n8n workflow without database dependency.

## Step 1: Deploy to Vercel

1. Push your code to GitHub (already done)
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables:
   - `N8N_WEBHOOK_URL`: `https://getzero11-n8n-gz.hf.space/webhook/healthcare-report-generator`

6. Click "Deploy"

## Step 2: Update n8n Workflow

Make sure your n8n workflow has these configurations:

### Webhook Node:
- **Path**: `healthcare-report-generator`
- **HTTP Method**: `POST`
- **Response Mode**: `Response Node`

### Respond to Webhook Node:
- **Response Body**:
```json
{
  "success": true,
  "message": "Report generation started",
  "keyword": "{{ $json.keyword }}",
  "status": "processing"
}
```

### Callback Node (at the end):
- **URL**: `https://healthcare-research-agent.vercel.app/api/webhook/n8n-callback`
- **Method**: `POST`
- **Body Parameters**:
  - `status`: `completed`
  - `keyword`: `{{ $('Set Title').item.json.ai_input }}`
  - `pdfUrl`: `{{ $('Create PDF').item.json.data }}`
  - `driveUrl`: `{{ $('Google Drive').item.json.webViewLink }}`

## Step 3: Test the Application

1. Visit your deployed app: https://healthcare-research-agent.vercel.app
2. Enter a healthcare keyword (e.g., "Digital Diagnostics")
3. Click "Generate Report"
4. The workflow should execute and you'll see processing status

## Step 4: Test with curl

```bash
curl -X POST "https://getzero11-n8n-gz.hf.space/webhook/healthcare-report-generator" \
  -H "Content-Type: application/json" \
  -d '{"keyword":"Digital Diagnostics"}'
```

Expected response:
```json
{
  "success": true,
  "message": "Report generation started",
  "keyword": "Digital Diagnostics",
  "status": "processing"
}
```

## Environment Variables Summary

```env
N8N_WEBHOOK_URL="https://getzero11-n8n-gz.hf.space/webhook/healthcare-report-generator"
```

## How It Works

1. **User Input**: User enters keyword in frontend
2. **API Call**: Frontend calls `/api/generate-report` with keyword
3. **Webhook Trigger**: Backend triggers n8n webhook with keyword
4. **Processing**: n8n workflow processes the keyword and generates report
5. **Callback**: n8n calls back to `/api/webhook/n8n-callback` when complete
6. **Logging**: Callback is logged (in future versions, this could update frontend)

## Troubleshooting

### Frontend Issues
- Check browser console for errors
- Verify Vercel deployment logs

### n8n Workflow Issues
- Ensure workflow is active (green toggle)
- Check n8n execution logs
- Verify webhook path is `healthcare-report-generator`
- Ensure callback URL points to your Vercel app

### API Issues
- Check Vercel function logs
- Verify `N8N_WEBHOOK_URL` environment variable is set correctly

## Next Steps (Optional Enhancements)

1. **Real-time Updates**: Add WebSocket/SSE for real-time status updates
2. **Database Integration**: Add back database for report history
3. **User Authentication**: Add user accounts and report management
4. **Email Notifications**: Send emails when reports are complete
5. **File Storage**: Store PDFs in cloud storage with proper URLs

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for frontend errors  
3. Check n8n workflow execution logs
4. Contact: ihealthcareanalyst@gmail.com