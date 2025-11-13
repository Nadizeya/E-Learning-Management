# Deployment Guide for Google Cloud

This guide will help you deploy the E-Learning Management System to Google Cloud Platform.

## Prerequisites

1. Google Cloud Platform account
2. Google Cloud SDK (gcloud) installed
3. Docker installed (for containerization)
4. MySQL database (Cloud SQL or managed MySQL)

## Environment Variables Setup

### Frontend Environment Variables

1. **Development** (`frontend/.env.development`):
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

2. **Production** (`frontend/.env.production`):
   ```env
   VITE_API_BASE_URL=https://your-backend-service-url.run.app/api
   ```

### Backend Environment Variables

Set these in Google Cloud Run or Cloud Functions:

```env
# Database Configuration
SPRING_DATASOURCE_URL=jdbc:mysql://YOUR_CLOUD_SQL_IP:3306/lms_elearn_db?useSSL=true&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=your_db_user
SPRING_DATASOURCE_PASSWORD=your_db_password

# Server Configuration
SERVER_PORT=8080

# File Upload Configuration
FILE_UPLOAD_DIR=/tmp/uploads

# Mail Configuration
SPRING_MAIL_HOST=smtp.gmail.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=your-email@gmail.com
SPRING_MAIL_PASSWORD=your-app-password

# Frontend Base URL (for CORS)
# If using Cloud Run: https://lms-frontend-xxx.run.app
# If using Firebase: https://your-frontend-url.web.app
APP_FRONTEND_BASE_URL=https://your-frontend-url.run.app

# JWT Secret
JWT_SECRET=your-strong-secret-key-here
```

## Deployment Steps

### 1. Backend Deployment (Google Cloud Run)

1. **Build the Docker image:**
   ```bash
   cd backend
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/lms-backend
   ```

2. **Deploy to Cloud Run:**
   ```bash
   gcloud run deploy lms-backend \
     --image gcr.io/YOUR_PROJECT_ID/lms-backend \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars SPRING_DATASOURCE_URL="jdbc:mysql://..." \
     --set-env-vars SPRING_DATASOURCE_USERNAME="..." \
     --set-env-vars SPRING_DATASOURCE_PASSWORD="..." \
     --set-env-vars APP_FRONTEND_BASE_URL="https://your-frontend-url.web.app"
   ```

3. **Note the service URL** from the deployment output (e.g., `https://lms-backend-xxx.run.app`)

### 2. Frontend Deployment (Google Cloud Run)

1. **Build the Docker image:**
   ```bash
   cd frontend
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/lms-frontend \
     --build-arg VITE_API_BASE_URL=https://lms-backend-xxx.run.app/api
   ```
   
   **Note:** Replace `lms-backend-xxx.run.app` with your actual backend URL from step 1.

2. **Deploy to Cloud Run:**
   ```bash
   gcloud run deploy lms-frontend \
     --image gcr.io/YOUR_PROJECT_ID/lms-frontend \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --port 8080
   ```

3. **Note the service URL** from the deployment output (e.g., `https://lms-frontend-xxx.run.app`)

#### Alternative: Firebase Hosting (Static Hosting)

If you prefer static hosting instead of Cloud Run:

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialize Firebase:**
   ```bash
   cd frontend
   firebase init hosting
   ```

3. **Build the frontend:**
   ```bash
   npm run build
   ```

4. **Update `.env.production`** with your backend URL:
   ```env
   VITE_API_BASE_URL=https://lms-backend-xxx.run.app/api
   ```

5. **Deploy:**
   ```bash
   firebase deploy --only hosting
   ```

#### Alternative: Google Cloud Storage + Cloud CDN

1. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Create a bucket:**
   ```bash
   gsutil mb gs://your-frontend-bucket
   ```

3. **Upload files:**
   ```bash
   gsutil -m cp -r dist/* gs://your-frontend-bucket/
   ```

4. **Set bucket permissions:**
   ```bash
   gsutil web set -m index.html -e index.html gs://your-frontend-bucket
   gsutil iam ch allUsers:objectViewer gs://your-frontend-bucket
   ```

### 3. Database Setup (Cloud SQL)

1. **Create Cloud SQL instance:**
   ```bash
   gcloud sql instances create lms-db \
     --database-version=MYSQL_8_0 \
     --tier=db-f1-micro \
     --region=us-central1
   ```

2. **Create database:**
   ```bash
   gcloud sql databases create lms_elearn_db --instance=lms-db
   ```

3. **Create user:**
   ```bash
   gcloud sql users create lms_user \
     --instance=lms-db \
     --password=your_secure_password
   ```

4. **Run migrations:**
   - Connect to the database and run `backend/database/lms_schema.sql`

5. **Update backend environment variables** with Cloud SQL connection details

## Environment Variables in Google Cloud

### Setting Environment Variables in Cloud Run

1. Go to Cloud Run console
2. Select your service
3. Click "Edit & Deploy New Revision"
4. Go to "Variables & Secrets" tab
5. Add environment variables:
   - `SPRING_DATASOURCE_URL`
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`
   - `APP_FRONTEND_BASE_URL`
   - `SPRING_MAIL_USERNAME`
   - `SPRING_MAIL_PASSWORD`
   - `FILE_UPLOAD_DIR`

### Using Secret Manager (Recommended for sensitive data)

1. **Create secrets:**
   ```bash
   echo -n "your-db-password" | gcloud secrets create db-password --data-file=-
   echo -n "your-jwt-secret" | gcloud secrets create jwt-secret --data-file=-
   ```

2. **Grant access:**
   ```bash
   gcloud secrets add-iam-policy-binding db-password \
     --member="serviceAccount:YOUR_SERVICE_ACCOUNT" \
     --role="roles/secretmanager.secretAccessor"
   ```

3. **Reference in Cloud Run:**
   - Use the secret name in environment variables

## CORS Configuration

Make sure your backend `CorsConfig` allows your frontend domain:

```java
configuration.setAllowedOriginPatterns(List.of(
    "http://localhost:5173",
    "https://lms-frontend-xxx.run.app",  // Cloud Run frontend
    "https://your-frontend-url.web.app"  // Firebase hosting (if used)
));
```

Or update the `APP_FRONTEND_BASE_URL` environment variable in Cloud Run backend service.

## Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database connected and migrations run
- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] File upload directory configured
- [ ] Email service configured
- [ ] Test authentication flow
- [ ] Test API endpoints
- [ ] Monitor logs for errors

## Troubleshooting

### Backend Issues

- Check Cloud Run logs: `gcloud run services logs read lms-backend`
- Verify environment variables are set correctly
- Check database connection string format
- Ensure Cloud SQL instance allows connections from Cloud Run

### Frontend Issues

- Verify `VITE_API_BASE_URL` is set correctly in production build
- Check browser console for CORS errors
- Verify backend URL is accessible
- Check Firebase hosting configuration

### Database Issues

- Verify Cloud SQL instance is running
- Check connection string format
- Verify user permissions
- Check firewall rules allow Cloud Run access

## Security Notes

1. **Never commit `.env` files** - they are in `.gitignore`
2. **Use Secret Manager** for sensitive data in production
3. **Enable SSL/TLS** for database connections
4. **Use strong JWT secrets** in production
5. **Configure CORS** properly to prevent unauthorized access
6. **Set up Cloud Armor** for DDoS protection
7. **Enable Cloud Logging** for monitoring

## Cost Optimization

- Use Cloud Run (pay per request) instead of always-on VMs
- Use Cloud SQL with appropriate tier
- Enable Cloud CDN for frontend assets
- Set up auto-scaling limits
- Monitor usage with Cloud Billing alerts

