# Branch Data Collection App

A modern web application for collecting and managing branch location data with Google Sheets integration.

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd branch-data-collector
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your Google Sheets credentials
   ```

4. **Start the development servers**
   ```bash
   npm run dev:integrated
   ```

5. **Access the application**
   - Frontend: http://localhost:4000
   - Backend API: http://localhost:3000
   - Health Check: http://localhost:3000/health

### Production Deployment

See [SETUP.md](./SETUP.md) for detailed AWS App Runner deployment instructions.

## 📋 Features

- **Branch Data Collection**: Capture branch information including location, images, and metadata
- **Google Sheets Integration**: Automatic data storage in Google Sheets
- **Real-time Location**: GPS-based location capture
- **Image Upload**: Support for multiple image types (notice board, waiting area, branch board)
- **Responsive Design**: Mobile-friendly interface
- **Health Monitoring**: Built-in health check endpoints

## 🛠️ Technology Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **Data Storage**: Google Sheets API
- **Deployment**: AWS App Runner
- **Authentication**: JWT-based Google Sheets API authentication

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── page.jsx          # Main application page
│   │   ├── root.tsx          # Root component
│   │   └── not-found.tsx     # 404 page
│   └── __create/
│       └── PolymorphicComponent.tsx
├── Backend/
│   ├── app.js                # Main backend application
│   └── services/
│       └── googleSheetsService.js
├── backend-server.cjs        # Express server
├── Dockerfile                # Docker configuration
├── apprunner.yaml           # AWS App Runner configuration
└── SETUP.md                 # Deployment guide
```

## 🔧 API Endpoints

- `GET /health` - Health check
- `POST /api/branches` - Create/update branch data
- `GET /api/branches` - Get all branches
- `GET /api/branches?branchId=123` - Get specific branch

## 📝 Environment Variables

The Google Sheets credentials are hardcoded in the application. For local development, you can create a `.env` file with:

```env
# App Configuration
PORT=3000
NODE_ENV=development
```

## 🚨 Troubleshooting

### Common Issues

1. **Google Sheets API Errors**
   - Verify service account credentials
   - Check if Google Sheets API is enabled
   - Ensure spreadsheet is shared with service account

2. **Build Failures**
   - Check Node.js version (requires 20+)
   - Verify all dependencies are installed
   - Check for TypeScript errors

3. **Deployment Issues**
   - Verify AWS credentials
   - Check App Runner service configuration
   - Review CloudWatch logs

## 📊 Monitoring

- **Health Check**: `/health` endpoint
- **Logs**: AWS CloudWatch Logs
- **Metrics**: AWS CloudWatch Metrics
- **Alerts**: Configure CloudWatch alarms

## 🔒 Security

- Environment variables are securely managed
- Google Sheets API uses service account authentication
- HTTPS enforced in production
- No sensitive data stored in code

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Check the [SETUP.md](./SETUP.md) documentation
- Review AWS App Runner logs
- Check Google Sheets API documentation
