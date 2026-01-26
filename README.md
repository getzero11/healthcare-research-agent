# Healthcare Market Research Agent

AI-powered healthcare market research report generator that creates comprehensive market analysis reports with intelligent insights, market sizing, competitive analysis, and forecasts.

## Features

- 🤖 **AI-Powered Analysis**: Generate comprehensive market research reports using advanced AI
- 📊 **Visual Infographics**: Automatic generation of charts, graphs, and market data visualizations
- 📧 **Email Notifications**: Automatic email delivery when reports are complete
- ☁️ **Google Drive Integration**: Reports automatically saved to Google Drive
- 🎯 **Real-time Status**: Live updates on report generation progress
- 🌐 **Global Market Focus**: Generates reports for global healthcare markets

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI Processing**: n8n workflow automation with DeepSeek AI
- **PDF Generation**: Puppeteer-based PDF service
- **Storage**: Google Drive integration
- **Deployment**: Vercel

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/getzero11/healthcare-research-agent.git
cd healthcare-research-agent/healthcare-market-research-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Update `.env` with your n8n webhook URL:

```env
N8N_WEBHOOK_URL="https://your-n8n-instance.com/webhook/healthcare-report-generator"
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set the environment variable:
   - `N8N_WEBHOOK_URL`: Your n8n webhook endpoint
4. Deploy

### n8n Workflow Setup

The application requires an n8n workflow with:

1. **Webhook Node**: Path `healthcare-report-generator`
2. **AI Processing**: Market research analysis and report generation
3. **PDF Generation**: Convert reports to PDF format
4. **Google Drive**: Save PDFs to cloud storage
5. **Email Notification**: Send completion emails
6. **Callback**: Notify frontend when complete

See `DEPLOYMENT.md` for detailed n8n workflow configuration.

## Usage

1. **Enter Keyword**: Type any healthcare market keyword (e.g., "Digital Therapeutics", "Robotic Surgery")
2. **Generate Report**: Click "Generate Market Research Report"
3. **Monitor Progress**: Watch real-time status updates
4. **Download**: Access completed reports via Google Drive links

## API Endpoints

- `POST /api/generate-report` - Trigger report generation
- `POST /api/webhook/n8n-callback` - Receive completion notifications
- `GET /api/webhook/n8n-callback?keyword=X` - Check report status

## Project Structure

```
healthcare-market-research-app/
├── app/
│   ├── api/
│   │   ├── generate-report/     # Report generation endpoint
│   │   └── webhook/
│   │       └── n8n-callback/    # n8n completion callback
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # App layout
│   └── page.tsx                 # Main application page
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── DEPLOYMENT.md                # Deployment guide
└── README.md                    # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Email: getzero11@gmail.com
- Website: [iHealthcareAnalyst.com](https://www.ihealthcareanalyst.com)
