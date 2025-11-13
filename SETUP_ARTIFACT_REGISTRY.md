# Artifact Registry Setup Guide

This guide helps you set up Artifact Registry and fix permission issues for Cloud Build.

## Quick Fix Commands

Run these commands to set up Artifact Registry and grant necessary permissions:

### 1. Set your project
```bash
gcloud config set project learnhub-478103
```

### 2. Enable required APIs
```bash
gcloud services enable artifactregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
```

### 3. Create Artifact Registry repository
```bash
gcloud artifacts repositories create webdev-dockers \
  --repository-format=docker \
  --location=us-central1 \
  --description="Docker images for LMS project"
```

### 4. Get your project number
```bash
PROJECT_NUMBER=$(gcloud projects describe learnhub-478103 --format="value(projectNumber)")
echo "Project Number: $PROJECT_NUMBER"
```

### 5. Grant permissions to Cloud Build service account
```bash
# Grant Artifact Registry Writer role
gcloud artifacts repositories add-iam-policy-binding webdev-dockers \
  --location=us-central1 \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"

# Grant Cloud Run Admin role (for deployment)
gcloud projects add-iam-policy-binding learnhub-478103 \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/run.admin"

# Grant Service Account User role (needed to deploy)
gcloud projects add-iam-policy-binding learnhub-478103 \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"
```

## Alternative: Use Container Registry (Simpler, but being phased out)

If you prefer to use the older Container Registry (gcr.io) instead, you can modify the `cloudbuild.yaml`:

1. Change image paths from:
   ```
   us-central1-docker.pkg.dev/${_PROJECT_ID}/webdev-dockers/lms-backend
   ```
   to:
   ```
   gcr.io/${_PROJECT_ID}/lms-backend
   ```

2. Enable Container Registry API:
   ```bash
   gcloud services enable containerregistry.googleapis.com
   ```

3. Grant permissions (usually automatic with Container Registry):
   ```bash
   gcloud projects add-iam-policy-binding learnhub-478103 \
     --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
     --role="roles/storage.admin"
   ```

## Verify Setup

Check if the repository exists:
```bash
gcloud artifacts repositories list --location=us-central1
```

Check Cloud Build service account permissions:
```bash
PROJECT_NUMBER=$(gcloud projects describe learnhub-478103 --format="value(projectNumber)")
gcloud projects get-iam-policy learnhub-478103 \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"
```

## Troubleshooting

### Error: "Permission denied on resource"
- Make sure the repository exists
- Verify the Cloud Build service account has the correct roles
- Check that you're using the correct project ID

### Error: "Repository may not exist"
- Create the repository using the command in step 3
- Verify the repository name matches in `cloudbuild.yaml`

### Error: "Service account not found"
- Make sure Cloud Build API is enabled
- The service account is automatically created when Cloud Build API is enabled

## Using the Setup Script

You can also use the provided setup script:

```bash
chmod +x setup-artifact-registry.sh
./setup-artifact-registry.sh
```

Make sure to update the `PROJECT_ID` in the script if it differs from `learnhub-478103`.

