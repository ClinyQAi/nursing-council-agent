#!/bin/bash
# Azure Container Apps Deployment Script
# This script deploys the Nursing Council Agent to Azure Container Apps

set -e

# Configuration - Update these values
RESOURCE_GROUP="nursing-council-rg"
LOCATION="uksouth"
CONTAINER_APP_ENV="nursing-council-env"
CONTAINER_APP_NAME="nursing-council"
ACR_NAME="nursingcouncilacr"

echo "🚀 Deploying Nursing Council Agent to Azure Container Apps"
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI is not installed. Please install it first:"
    echo "   https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if logged in
if ! az account show &> /dev/null; then
    echo "📝 Please log in to Azure..."
    az login
fi

echo "📦 Step 1: Creating Resource Group..."
az group create --name $RESOURCE_GROUP --location $LOCATION --output none || true

echo "📦 Step 2: Creating Azure Container Registry..."
az acr create \
    --resource-group $RESOURCE_GROUP \
    --name $ACR_NAME \
    --sku Basic \
    --admin-enabled true \
    --output none || true

echo "🔨 Step 3: Building and pushing Docker image..."
az acr build \
    --registry $ACR_NAME \
    --image nursing-council:latest \
    --file Dockerfile \
    .

echo "🌐 Step 4: Creating Container Apps Environment..."
az containerapp env create \
    --name $CONTAINER_APP_ENV \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --output none || true

# Get ACR credentials
ACR_SERVER="${ACR_NAME}.azurecr.io"
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query passwords[0].value -o tsv)

echo "🚀 Step 5: Deploying Container App..."
az containerapp create \
    --name $CONTAINER_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --environment $CONTAINER_APP_ENV \
    --image "${ACR_SERVER}/nursing-council:latest" \
    --registry-server $ACR_SERVER \
    --registry-username $ACR_USERNAME \
    --registry-password $ACR_PASSWORD \
    --target-port 8001 \
    --ingress external \
    --cpu 0.5 \
    --memory 1.0Gi \
    --min-replicas 0 \
    --max-replicas 3 \
    --env-vars \
        "API_BACKEND=azure" \
        "AZURE_OPENAI_ENDPOINT=secretref:azure-endpoint" \
        "AZURE_OPENAI_API_KEY=secretref:azure-key" \
    --secrets \
        "azure-endpoint=https://clinyqai.cognitiveservices.azure.com" \
        "azure-key=<YOUR_API_KEY_HERE>"

echo ""
echo "✅ Deployment complete!"
echo ""

# Get the app URL
APP_URL=$(az containerapp show --name $CONTAINER_APP_NAME --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv)
echo "🌐 Your app is available at: https://${APP_URL}"
echo ""
echo "⚠️  IMPORTANT: Update the Azure OpenAI API key secret:"
echo "   az containerapp secret set --name $CONTAINER_APP_NAME --resource-group $RESOURCE_GROUP --secrets azure-key=YOUR_ACTUAL_KEY"
