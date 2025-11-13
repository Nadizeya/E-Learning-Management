#!/bin/bash
# Setup script for Artifact Registry and Cloud Build permissions
# Usage: ./setup-artifact-registry.sh

PROJECT_ID="learnhub-478103"
REGION="us-central1"
REPOSITORY="webdev-dockers"

echo "Setting up Artifact Registry for project: $PROJECT_ID"

# Set the project
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "Enabling required APIs..."
gcloud services enable artifactregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com

# Create Artifact Registry repository if it doesn't exist
echo "Creating Artifact Registry repository: $REPOSITORY..."
gcloud artifacts repositories create $REPOSITORY \
  --repository-format=docker \
  --location=$REGION \
  --description="Docker images for LMS project" \
  || echo "Repository may already exist"

# Get the Cloud Build service account
CLOUD_BUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")

echo "Project Number: $PROJECT_NUMBER"
echo "Cloud Build Service Account: $CLOUD_BUILD_SA"

# Grant Artifact Registry Writer role to Cloud Build service account
echo "Granting Artifact Registry permissions to Cloud Build service account..."
gcloud artifacts repositories add-iam-policy-binding $REPOSITORY \
  --location=$REGION \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"

# Grant Cloud Run Admin role to Cloud Build service account (for deployment)
echo "Granting Cloud Run permissions to Cloud Build service account..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/run.admin"

# Grant Service Account User role (needed to deploy to Cloud Run)
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

echo "Setup complete!"
echo ""
echo "You can now run:"
echo "  gcloud builds submit --config=backend/cloudbuild.yaml"

