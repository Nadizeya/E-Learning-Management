# Environment Variables Setup Guide

## Quick Start

### Frontend Environment Files

1. **Create `frontend/.env.development`:**
   ```bash
   cd frontend
   cp env.development.example .env.development
   ```
   
   Content:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

2. **Create `frontend/.env.production`:**
   ```bash
   cp env.production.example .env.production
   ```
   
   Then update with your production backend URL:
   ```env
   VITE_API_BASE_URL=https://your-backend-service-url.run.app/api
   ```

### Backend Environment File

1. **Create `backend/.env`:**
   ```bash
   cd backend
   cp env.example .env
   ```
   
   Then update the values for your environment.

## How It Works

### Frontend (Vite)

Vite automatically loads environment variables from `.env` files:
- `.env.development` - loaded in development mode (`npm run dev`)
- `.env.production` - loaded in production build (`npm run build`)
- Variables must be prefixed with `VITE_` to be exposed to the client

The `apiClient.js` already reads from `import.meta.env.VITE_API_BASE_URL`:
```javascript
const rawBaseURL = import.meta.env?.VITE_API_BASE_URL || defaultBaseURL
```

### Backend (Spring Boot)

Spring Boot reads environment variables and uses them in `application.properties`:
- Environment variables override default values
- Format: `${ENV_VAR_NAME:default_value}`

Example:
```properties
server.port=${SERVER_PORT:8080}
```

This means:
- If `SERVER_PORT` environment variable is set, use it
- Otherwise, use default value `8080`

## Google Cloud Deployment

### Setting Environment Variables in Cloud Run

1. **Via Console:**
   - Go to Cloud Run → Your Service → Edit & Deploy New Revision
   - Variables & Secrets tab → Add environment variables

2. **Via gcloud CLI:**
   ```bash
   gcloud run services update lms-backend \
     --set-env-vars SPRING_DATASOURCE_URL="jdbc:mysql://..." \
     --set-env-vars SPRING_DATASOURCE_USERNAME="..." \
     --set-env-vars SPRING_DATASOURCE_PASSWORD="..."
   ```

3. **Via Secret Manager (Recommended for sensitive data):**
   ```bash
   # Create secret
   echo -n "your-password" | gcloud secrets create db-password --data-file=-
   
   # Reference in Cloud Run
   gcloud run services update lms-backend \
     --set-secrets SPRING_DATASOURCE_PASSWORD=db-password:latest
   ```

### Frontend Build with Environment Variables

When building for production:
```bash
cd frontend
npm run build
```

The build process will:
1. Read `.env.production`
2. Replace `VITE_API_BASE_URL` in the built code
3. Create optimized production build in `dist/` folder

**Important:** The environment variables are embedded at build time, not runtime. You need to rebuild if you change them.

## Required Environment Variables

### Frontend
- `VITE_API_BASE_URL` - Backend API URL

### Backend
- `SPRING_DATASOURCE_URL` - Database connection string
- `SPRING_DATASOURCE_USERNAME` - Database username
- `SPRING_DATASOURCE_PASSWORD` - Database password
- `SERVER_PORT` - Server port (default: 8080)
- `FILE_UPLOAD_DIR` - File upload directory
- `SPRING_MAIL_USERNAME` - Email username
- `SPRING_MAIL_PASSWORD` - Email password
- `APP_FRONTEND_BASE_URL` - Frontend URL for CORS

## Security Notes

1. **Never commit `.env` files** - They are in `.gitignore`
2. **Use `.env.example` files** as templates (these are safe to commit)
3. **Use Secret Manager** in production for sensitive data
4. **Rotate secrets regularly** in production
5. **Don't hardcode secrets** in code or configuration files

## Troubleshooting

### Frontend API calls failing

1. Check `VITE_API_BASE_URL` is set correctly
2. Verify the backend URL is accessible
3. Check browser console for CORS errors
4. Rebuild the frontend after changing env vars

### Backend not reading environment variables

1. Verify variable names match exactly (case-sensitive)
2. Check Spring Boot logs for configuration errors
3. Ensure variables are set before application starts
4. For Cloud Run, verify variables are set in service configuration

### Build issues

1. Clear build cache: `rm -rf frontend/dist`
2. Reinstall dependencies: `npm install`
3. Check for syntax errors in `.env` files
4. Verify Vite is reading the correct env file

