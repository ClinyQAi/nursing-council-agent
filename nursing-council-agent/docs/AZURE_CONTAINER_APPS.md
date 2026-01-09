# Azure Container Apps Deployment

## Prerequisites
1. [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) installed
2. Azure subscription with billing enabled
3. Docker installed (for local testing)

## Quick Deploy

```bash
# 1. Log in to Azure
az login

# 2. Run the deployment script
chmod +x deploy-azure.sh
./deploy-azure.sh
```

## Configuration

Edit `deploy-azure.sh` to customize:
- `RESOURCE_GROUP` - Your resource group name
- `LOCATION` - Azure region (default: uksouth)
- `CONTAINER_APP_NAME` - Your app name

## Setting Up Secrets

After deployment, set your Azure OpenAI API key:

```bash
az containerapp secret set \
    --name nursing-council \
    --resource-group nursing-council-rg \
    --secrets azure-key=YOUR_API_KEY
```

## Updating the App

```bash
# Rebuild and redeploy
az acr build --registry nursingcouncilacr --image nursing-council:latest .
az containerapp update --name nursing-council --resource-group nursing-council-rg --image nursingcouncilacr.azurecr.io/nursing-council:latest
```

## Costs

Azure Container Apps has a generous free tier:
- First 2M requests/month free
- Scale to zero when not in use
- Pay only for what you use

Estimated cost: **$0-5/month** for light usage.
