# AWS App Runner Deployment Guide

This guide will help you deploy the Branch Data Collection App to AWS App Runner.

## 📋 Prerequisites

- AWS Account with appropriate permissions
- AWS CLI installed and configured
- Google Cloud Console account (for Google Sheets API)
- Git repository (GitHub, GitLab, or Bitbucket)

## 🔧 Google Sheets API Setup

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

### 2. Create Service Account
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - Name: `branch-data-collector`
   - Description: `Service account for branch data collection app`
4. Click "Create and Continue"
5. Skip role assignment (click "Continue")
6. Click "Done"

### 3. Generate Service Account Key
1. Click on the created service account
2. Go to "Keys" tab
3. Click "Add Key" > "Create new key"
4. Select "JSON" format
5. Download the key file (keep it secure!)

### 4. Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet
3. Name it "Branch Data Collection"
4. Share the sheet with your service account email:
   - Click "Share" button
   - Add the service account email (from the JSON key file)
   - Give "Editor" permissions
5. Copy the Spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
   ```

## 🚀 AWS App Runner Setup

### 1. Prepare Your Repository

#### Create Dockerfile
Create a `Dockerfile` in your project root:

```dockerfile
# Use Node.js 20 Alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
```

#### Update package.json Scripts
Ensure your `package.json` has these scripts:

```json
{
  "scripts": {
    "start": "node backend-server.cjs",
    "build": "npm run build:frontend",
    "build:frontend": "vite build",
    "dev": "vite",
    "dev:integrated": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\" --names \"BACKEND,FRONTEND\" --prefix-colors \"blue,green\"",
    "dev:backend": "node backend-server.cjs",
    "dev:frontend": "vite"
  }
}
```

#### Create .dockerignore
Create a `.dockerignore` file:

```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.nyc_output
coverage
.env.local
.env.development.local
.env.test.local
.env.production.local
```

### 2. Environment Variables

The Google Sheets credentials are already hardcoded in the application. No additional environment variables are needed for the Google Sheets integration.

For local development, you can create a `.env` file with:

```env
# App Configuration
PORT=3000
NODE_ENV=development
```

Or copy from the example file:
```bash
cp env.example .env
```

### 3. Deploy to AWS App Runner

#### Option A: Using AWS Console

1. **Go to AWS App Runner Console**
   - Navigate to AWS App Runner in the AWS Console
   - Click "Create service"

2. **Configure Source**
   - Choose "Source code repository"
   - Connect your Git provider (GitHub, GitLab, Bitbucket)
   - Select your repository
   - Choose branch (usually `main` or `master`)

3. **Configure Build**
   - Build type: Docker
   - Dockerfile: `Dockerfile` (default)
   - Build command: (leave empty)
   - Start command: (leave empty)

4. **Configure Service**
   - Service name: `branch-data-collector`
   - Virtual CPU: 0.25 vCPU
   - Virtual memory: 0.5 GB
   - Environment variables:
     ```
     PORT = 3000
     NODE_ENV = production
     ```
   - Health check path: `/health`

5. **Review and Create**
   - Review all settings
   - Click "Create & deploy"

#### Option B: Using AWS CLI

1. **Create apprunner.yaml**
   ```yaml
   version: 1.0
   runtime: docker
   build:
     commands:
       build:
         - echo "Building the application..."
   run:
     runtime-version: latest
     command: npm start
     network:
       port: 3000
       env: PORT
     env:
       - name: PORT
         value: "3000"
       - name: NODE_ENV
         value: "production"
   ```

2. **Deploy using CLI**
   ```bash
   aws apprunner create-service \
     --service-name "branch-data-collector" \
     --source-configuration '{
       "CodeRepository": {
         "RepositoryUrl": "https://github.com/yourusername/your-repo",
         "SourceCodeVersion": {
           "Type": "BRANCH",
           "Value": "main"
         },
         "CodeConfiguration": {
           "ConfigurationSource": "REPOSITORY",
           "CodeConfigurationValues": {
             "Runtime": "DOCKER",
             "BuildCommand": "",
             "StartCommand": "",
             "RuntimeEnvironmentVariables": {
               "PORT": "3000",
               "NODE_ENV": "production"
             }
           }
         }
       }
     }' \
     --instance-configuration '{
       "Cpu": "0.25 vCPU",
       "Memory": "0.5 GB"
     }' \
     --health-check-configuration '{
       "Protocol": "HTTP",
       "Path": "/health",
       "Interval": 10,
       "Timeout": 5,
       "HealthyThreshold": 1,
       "UnhealthyThreshold": 5
     }'
   ```

### 4. Configure Custom Domain (Optional)

1. **In App Runner Console**
   - Go to your service
   - Click "Custom domains"
   - Click "Add domain"
   - Enter your domain name
   - Follow DNS configuration instructions

2. **DNS Configuration**
   - Add CNAME record pointing to your App Runner URL
   - Example: `api.yourdomain.com` → `your-app-runner-url.us-east-1.awsapprunner.com`

## 🔍 Monitoring and Logs

### 1. CloudWatch Logs
- App Runner automatically sends logs to CloudWatch
- View logs in AWS CloudWatch Console
- Log group: `/aws/apprunner/branch-data-collector/service/`

### 2. Health Monitoring
- Health check endpoint: `https://your-app-url/health`
- Monitor service health in App Runner console
- Set up CloudWatch alarms for service metrics

### 3. Performance Monitoring
- Monitor CPU and memory usage
- Set up alerts for high resource usage
- Use AWS X-Ray for distributed tracing (optional)

## 🔒 Security Considerations

### 1. Environment Variables
- Google Sheets credentials are hardcoded in the application
- Only basic app configuration variables are needed
- Use AWS Secrets Manager for additional sensitive data if needed

### 2. Network Security
- App Runner provides automatic HTTPS
- Configure VPC connector if needed for private resources
- Use IAM roles for service permissions

### 3. Google Sheets API
- Limit service account permissions
- Use least privilege principle
- Monitor API usage in Google Cloud Console

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Dockerfile syntax
   - Verify all dependencies are in package.json
   - Check build logs in App Runner console

2. **Runtime Errors**
   - Check application logs in CloudWatch
   - Ensure Google Sheets API is enabled
   - Verify hardcoded credentials are correct

3. **Health Check Failures**
   - Verify `/health` endpoint is accessible
   - Check if PORT environment variable is set
   - Ensure application starts successfully

### Debug Commands

```bash
# Check service status
aws apprunner describe-service --service-arn "your-service-arn"

# View service logs
aws logs describe-log-groups --log-group-name-prefix "/aws/apprunner"

# Test health endpoint
curl https://your-app-url/health
```

## 📊 Cost Optimization

### 1. Resource Sizing
- Start with minimal resources (0.25 vCPU, 0.5 GB)
- Monitor usage and scale as needed
- Use auto-scaling for variable workloads

### 2. Environment Management
- Use different App Runner services for dev/staging/prod
- Implement proper CI/CD pipelines
- Use infrastructure as code (Terraform/CloudFormation)

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions Example

```yaml
name: Deploy to AWS App Runner

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1
    
    - name: Deploy to App Runner
      run: |
        aws apprunner start-deployment --service-arn ${{ secrets.APP_RUNNER_SERVICE_ARN }}
```

## 📝 Post-Deployment Checklist

- [ ] Service is running and healthy
- [ ] Health check endpoint responds correctly
- [ ] Google Sheets integration works
- [ ] Custom domain is configured (if applicable)
- [ ] Monitoring and alerts are set up
- [ ] Backup strategy is in place
- [ ] Security review completed
- [ ] Performance testing done
- [ ] Documentation updated

## 🆘 Support

For issues related to:
- **AWS App Runner**: [AWS Support](https://aws.amazon.com/support/)
- **Google Sheets API**: [Google Cloud Support](https://cloud.google.com/support)
- **Application Issues**: Check application logs and this documentation

---

**Note**: This setup assumes a single-instance deployment. For high availability, consider using multiple App Runner services across different regions or implementing a load balancer.
