"""Azure Blob Storage backend for conversations."""

import json
import os
from datetime import datetime
from typing import List, Dict, Any, Optional
from azure.storage.blob import BlobServiceClient, ContainerClient
from azure.core.exceptions import ResourceNotFoundError

# Get connection string from environment
AZURE_STORAGE_CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONNECTION_STRING", "")
CONTAINER_NAME = "nursing-council-conversations"


def get_container_client() -> Optional[ContainerClient]:
    """Get Azure Blob container client."""
    if not AZURE_STORAGE_CONNECTION_STRING:
        return None
    
    try:
        blob_service = BlobServiceClient.from_connection_string(AZURE_STORAGE_CONNECTION_STRING)
        container_client = blob_service.get_container_client(CONTAINER_NAME)
        
        # Create container if it doesn't exist
        if not container_client.exists():
            container_client.create_container()
        
        return container_client
    except Exception as e:
        print(f"[Azure Storage] Error connecting: {e}")
        return None


def save_conversation_to_blob(conversation: Dict[str, Any]) -> bool:
    """Save conversation to Azure Blob Storage."""
    client = get_container_client()
    if not client:
        return False
    
    try:
        blob_name = f"{conversation['id']}.json"
        blob_client = client.get_blob_client(blob_name)
        blob_client.upload_blob(
            json.dumps(conversation, indent=2),
            overwrite=True
        )
        return True
    except Exception as e:
        print(f"[Azure Storage] Error saving conversation: {e}")
        return False


def load_conversation_from_blob(conversation_id: str) -> Optional[Dict[str, Any]]:
    """Load conversation from Azure Blob Storage."""
    client = get_container_client()
    if not client:
        return None
    
    try:
        blob_name = f"{conversation_id}.json"
        blob_client = client.get_blob_client(blob_name)
        data = blob_client.download_blob().readall()
        return json.loads(data)
    except ResourceNotFoundError:
        return None
    except Exception as e:
        print(f"[Azure Storage] Error loading conversation: {e}")
        return None


def list_conversations_from_blob() -> List[Dict[str, Any]]:
    """List all conversations from Azure Blob Storage."""
    client = get_container_client()
    if not client:
        return []
    
    try:
        conversations = []
        for blob in client.list_blobs():
            if blob.name.endswith('.json'):
                blob_client = client.get_blob_client(blob.name)
                data = json.loads(blob_client.download_blob().readall())
                conversations.append({
                    "id": data["id"],
                    "created_at": data["created_at"],
                    "title": data.get("title", "New Conversation"),
                    "message_count": len(data["messages"])
                })
        
        # Sort by creation time, newest first
        conversations.sort(key=lambda x: x["created_at"], reverse=True)
        return conversations
    except Exception as e:
        print(f"[Azure Storage] Error listing conversations: {e}")
        return []


def delete_conversation_from_blob(conversation_id: str) -> bool:
    """Delete conversation from Azure Blob Storage."""
    client = get_container_client()
    if not client:
        return False
    
    try:
        blob_name = f"{conversation_id}.json"
        blob_client = client.get_blob_client(blob_name)
        blob_client.delete_blob()
        return True
    except Exception as e:
        print(f"[Azure Storage] Error deleting conversation: {e}")
        return False


def is_blob_storage_available() -> bool:
    """Check if Azure Blob Storage is configured and available."""
    return get_container_client() is not None
