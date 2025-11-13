# Frontend Deployment Guide for Google Cloud Run

This guide explains how to deploy the frontend to Google Cloud Run.

## Prerequisites

1. Backend already deployed to Cloud Run (you need the backend URL)
2. Google Cloud SDK (gcloud) installed
3. Docker installed (optional, for local testing)

## Quick Deployment

### Method 1: Using gcloud CLI (Recommended)

1. **Set your backend URL:**
   ```bash
   export BACKEND_URL=https://lms-backend-xxx.run.app
   export PROJECT_ID=your-project-id
   export REGION=us-central1
   ```

2. **Build and deploy:**
   ```bash
   cd frontend
   gcloud builds submit --tag gcr.io/$PROJECT_ID/lms-frontend \
     --build-arg VITE_API_BASE_URL=$BACKEND_URL/api
   
   gcloud run deploy lms-frontend \
     --image gcr.io/$PROJECT_ID/lms-frontend \
     --platform managed \
     --region $REGION \
     --allow-unauthenticated \
     --port 8080
   ```

### Method 2: Using Cloud Build (Automated)

1. **Update `cloudbuild.yaml`** with your backend URL:
   ```yaml
   _VITE_API_BASE_URL: 'https://lms-backend-xxx.run.app/api'
   ```

2. **Submit the build:**
   ```bash
   cd frontend
   gcloud builds submit --config=cloudbuild.yaml
   ```

## Important Notes

### Environment Variables at Build Time

⚠️ **Critical:** The `VITE_API_BASE_URL` must be set at **build time**, not runtime. Vite embeds environment variables into the JavaScript bundle during the build process.

This means:
- ✅ Set `VITE_API_BASE_URL` as a build argument in Dockerfile
- ✅ Pass it via `--build-arg` when building the image
- ❌ Setting it as a Cloud Run environment variable won't work

### Updating the Backend URL

If you need to change the backend URL after deployment:

1. Rebuild the Docker image with the new URL:
   ```bash
   gcloud builds submit --tag gcr.io/$PROJECT_ID/lms-frontend \
     --build-arg VITE_API_BASE_URL=https://new-backend-url.run.app/api
   ```

2. Redeploy to Cloud Run:
   ```bash
   gcloud run deploy lms-frontend \
     --image gcr.io/$PROJECT_ID/lms-frontend \
     --platform managed \
     --region us-central1
   ```

## Local Testing

Before deploying, test the Docker image locally:

1. **Build the image:**
   ```bash
   cd frontend
   docker build --build-arg VITE_API_BASE_URL=http://localhost:8080/api -t lms-frontend .
   ```

2. **Run the container:**
   ```bash
   docker run -p 8080:8080 lms-frontend
   ```

3. **Test in browser:**
   Open `http://localhost:8080` and verify it connects to your backend.

## Troubleshooting

### Frontend shows "Failed to fetch" errors

- **Check backend URL:** Verify `VITE_API_BASE_URL` is correct in the build
- **Check CORS:** Ensure backend allows your frontend domain
- **Check network:** Verify backend is accessible from Cloud Run

### Routes return 404

- **Check nginx config:** The `nginx.conf` should have `try_files $uri $uri/ /index.html;`
- **Verify build:** Ensure React Router is configured correctly

### Environment variables not working

- **Remember:** Vite variables are embedded at build time
- **Rebuild:** You must rebuild the Docker image to change environment variables
- **Check build logs:** Verify `VITE_API_BASE_URL` is being passed correctly

### Port issues

- **Cloud Run sets PORT:** The `start-nginx.sh` script handles this automatically
- **Check logs:** `gcloud run services logs read lms-frontend`

## Cost Optimization

- **Minimal instances:** Set minimum instances to 0 for cost savings
- **CPU allocation:** Use CPU only during request processing
- **Memory:** Start with 512Mi, increase if needed

```bash
gcloud run services update lms-frontend \
  --min-instances 0 \
  --cpu-throttling \
  --memory 512Mi
```

## Security

- **HTTPS:** Cloud Run automatically provides HTTPS
- **Security headers:** Already configured in `nginx.conf`
- **No secrets:** Don't put secrets in frontend code (they're visible in browser)

## Monitoring

- **View logs:**
  ```bash
  gcloud run services logs read lms-frontend --limit 50
  ```

- **View metrics:**
  - Go to Cloud Run console
  - Select `lms-frontend` service
  - View metrics tab

## Updating Frontend

To update the frontend after code changes:

1. **Rebuild and redeploy:**
   ```bash
   cd frontend
   gcloud builds submit --tag gcr.io/$PROJECT_ID/lms-frontend \
     --build-arg VITE_API_BASE_URL=$BACKEND_URL/api
   
   gcloud run deploy lms-frontend \
     --image gcr.io/$PROJECT_ID/lms-frontend \
     --platform managed \
     --region us-central1
   ```

2. **Or use Cloud Build:**
   ```bash
   gcloud builds submit --config=cloudbuild.yaml
   ```

