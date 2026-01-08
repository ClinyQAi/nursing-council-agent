# Azure OpenAI Setup Guide

## Step 1: Create Azure OpenAI Resource

1. Go to [Azure Portal](https://portal.azure.com)
2. Click **"Create a resource"**
3. Search for **"Azure OpenAI"**
4. Click **Create** and fill in:
   - **Subscription**: Your Azure subscription
   - **Resource Group**: Create new or select existing
   - **Region**: `UK South` or your preferred region
   - **Name**: Something memorable (e.g., `nursing-ai-openai`)
   - **Pricing Tier**: `Standard S0`
5. Click **Review + Create** → **Create**
6. Wait for deployment to complete (~2 minutes)

---

## Step 2: Deploy a Model

1. Go to your new Azure OpenAI resource
2. Click **"Go to Azure OpenAI Studio"** (or visit [oai.azure.com](https://oai.azure.com))
3. In the Studio, click **Deployments** → **Create new deployment**
4. Configure:
   - **Model**: `gpt-4o` (or `gpt-4o-mini` for lower cost)
   - **Deployment name**: `gpt-4o` (use this exact name to match the app config)
   - **Deployment type**: Standard
5. Click **Create**

> ⚠️ **Important**: The deployment name `gpt-4o` must match what's in your `.env` file!

---

## Step 3: Get Your Credentials

1. In Azure Portal, go to your Azure OpenAI resource
2. Click **"Keys and Endpoint"** in the left sidebar
3. Copy:
   - **KEY 1** (or KEY 2) → This is your `AZURE_OPENAI_API_KEY`
   - **Endpoint** → This is your `AZURE_OPENAI_ENDPOINT`

The endpoint should look like:
```
https://your-resource-name.openai.azure.com/
```

---

## Step 4: Configure Your Codespace

1. In your Codespace terminal, create the `.env` file:
```bash
cp .env.example .env
```

2. Edit `.env` with your credentials:
```bash
# Open in editor
code .env
```

3. Update these values:
```env
API_BACKEND=azure
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com
AZURE_OPENAI_API_KEY=your_key_here
AZURE_OPENAI_API_VERSION=2024-02-15-preview
AZURE_DEPLOYMENT_ACADEMIC=gpt-4o
AZURE_DEPLOYMENT_CLINICAL=gpt-4o
AZURE_DEPLOYMENT_STUDENT=gpt-4o
AZURE_DEPLOYMENT_CHAIRMAN=gpt-4o
```

4. **Save the file** (Ctrl+S)

---

## Step 5: Test the Application

```bash
# Pull latest code
git pull

# Start the app
./start.sh
```

Check the terminal for:
```
NURSING COUNCIL AGENT - CONFIGURATION
API Backend: azure
Azure Endpoint: https://your-resource-name.openai.azure.com
Azure API Key: SET (xxxxxxxx...)
```

---

## Troubleshooting

| Error | Solution |
|-------|----------|
| `401 Unauthorized` | Check API key is correct |
| `404 Not Found` | Check deployment name matches exactly |
| `Resource not found` | Check endpoint URL format |
| `Azure credentials not configured` | `.env` file missing or not loaded |

---

## Cost Estimate

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|------------------------|
| gpt-4o | ~$2.50 | ~$10.00 |
| gpt-4o-mini | ~$0.15 | ~$0.60 |

For testing, `gpt-4o-mini` is recommended to save costs.
