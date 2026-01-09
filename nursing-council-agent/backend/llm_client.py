"""LLM API client supporting both Azure OpenAI and OpenRouter backends."""

import httpx
import asyncio
from typing import List, Dict, Any, Optional
from .config import (
    API_BACKEND,
    # Azure config
    AZURE_OPENAI_ENDPOINT,
    AZURE_OPENAI_API_KEY,
    AZURE_OPENAI_API_VERSION,
    AZURE_DEPLOYMENTS,
    # OpenRouter config
    OPENROUTER_API_KEY,
    OPENROUTER_API_URL,
    OPENROUTER_COUNCIL_MODELS,
    OPENROUTER_CHAIRMAN_MODEL,
    # Council config
    COUNCIL_MEMBERS,
    CHAIRMAN_ID,
    COUNCIL_ROLES,
    CHAIRMAN_SYSTEM_PROMPT,
    NURSING_SYSTEM_PROMPT,
)


async def query_azure_openai(
    deployment_name: str,
    messages: List[Dict[str, str]],
    system_prompt: str = "",
    timeout: float = 120.0
) -> Optional[Dict[str, Any]]:
    """
    Query Azure OpenAI API.

    Args:
        deployment_name: Name of the Azure deployment
        messages: List of message dicts with 'role' and 'content'
        system_prompt: System prompt to prepend
        timeout: Request timeout in seconds

    Returns:
        Response dict with 'content', or None if failed
    """
    if not AZURE_OPENAI_ENDPOINT or not AZURE_OPENAI_API_KEY:
        print("Error: Azure OpenAI credentials not configured")
        return None

    # Ensure no double slash if user provided endpoint with trailing slash
    base_endpoint = AZURE_OPENAI_ENDPOINT.rstrip('/')
    url = f"{base_endpoint}/openai/deployments/{deployment_name}/chat/completions?api-version={AZURE_OPENAI_API_VERSION}"

    headers = {
        "api-key": AZURE_OPENAI_API_KEY,
        "Content-Type": "application/json",
    }

    # Prepend system prompt if provided
    full_messages = []
    if system_prompt:
        full_messages.append({"role": "system", "content": system_prompt})
    full_messages.extend(messages)

    payload = {
        "messages": full_messages,
    }

    print(f"[Azure] Querying deployment: {deployment_name}")
    print(f"[Azure] URL: {url}")
    print(f"[Azure] Messages count: {len(full_messages)}")

    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(url, headers=headers, json=payload)
            
            print(f"[Azure] Response status: {response.status_code}")
            
            if response.status_code != 200:
                print(f"[Azure] Error response: {response.text}")
                return None
                
            response.raise_for_status()

            data = response.json()
            message = data['choices'][0]['message']

            print(f"[Azure] Success! Response length: {len(message.get('content', ''))}")
            return {
                'content': message.get('content'),
            }

    except httpx.TimeoutException as e:
        print(f"[Azure] Timeout error for {deployment_name}: {e}")
        return None
    except httpx.HTTPStatusError as e:
        print(f"[Azure] HTTP error for {deployment_name}: {e.response.status_code} - {e.response.text}")
        return None
    except Exception as e:
        print(f"[Azure] Unexpected error for {deployment_name}: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return None


async def query_openrouter(
    model: str,
    messages: List[Dict[str, str]],
    system_prompt: str = "",
    timeout: float = 120.0
) -> Optional[Dict[str, Any]]:
    """
    Query OpenRouter API.

    Args:
        model: OpenRouter model identifier (e.g., "openai/gpt-4o")
        messages: List of message dicts with 'role' and 'content'
        system_prompt: System prompt to prepend
        timeout: Request timeout in seconds

    Returns:
        Response dict with 'content', or None if failed
    """
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }

    # Prepend system prompt if provided
    full_messages = []
    if system_prompt:
        full_messages.append({"role": "system", "content": system_prompt})
    full_messages.extend(messages)

    payload = {
        "model": model,
        "messages": full_messages,
    }

    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(
                OPENROUTER_API_URL,
                headers=headers,
                json=payload
            )
            response.raise_for_status()

            data = response.json()
            message = data['choices'][0]['message']

            return {
                'content': message.get('content'),
                'reasoning_details': message.get('reasoning_details')
            }

    except Exception as e:
        print(f"Error querying model {model}: {e}")
        return None


async def query_model(
    model_or_member: str,
    messages: List[Dict[str, str]],
    timeout: float = 120.0
) -> Optional[Dict[str, Any]]:
    """
    Query a model using the configured backend.

    Args:
        model_or_member: Either a council member ID (for Azure) or model name (for OpenRouter)
        messages: List of message dicts
        timeout: Request timeout

    Returns:
        Response dict with 'content', or None if failed
    """
    if API_BACKEND == "azure":
        # Determine deployment and system prompt based on member ID
        if model_or_member in AZURE_DEPLOYMENTS:
            deployment = AZURE_DEPLOYMENTS[model_or_member]
            if model_or_member == CHAIRMAN_ID:
                system_prompt = CHAIRMAN_SYSTEM_PROMPT
            elif model_or_member in COUNCIL_ROLES:
                system_prompt = NURSING_SYSTEM_PROMPT + "\n\n" + COUNCIL_ROLES[model_or_member]
            else:
                system_prompt = NURSING_SYSTEM_PROMPT
        else:
            # Fallback: use the string as-is for deployment name
            deployment = model_or_member
            system_prompt = NURSING_SYSTEM_PROMPT

        return await query_azure_openai(deployment, messages, system_prompt, timeout)
    else:
        # OpenRouter mode
        if model_or_member in COUNCIL_ROLES:
            system_prompt = NURSING_SYSTEM_PROMPT + "\n\n" + COUNCIL_ROLES[model_or_member]
        elif model_or_member == CHAIRMAN_ID:
            system_prompt = CHAIRMAN_SYSTEM_PROMPT
        else:
            system_prompt = ""

        return await query_openrouter(model_or_member, messages, system_prompt, timeout)


async def query_model_with_custom_prompt(
    messages: List[Dict[str, str]],
    system_prompt: str,
    timeout: float = 120.0
) -> Optional[Dict[str, Any]]:
    """
    Query a model using a custom system prompt (for custom roles).

    Args:
        messages: List of message dicts
        system_prompt: Custom system prompt for this role
        timeout: Request timeout

    Returns:
        Response dict with 'content', or None if failed
    """
    if API_BACKEND == "azure":
        # Use the default deployment for custom roles
        deployment = AZURE_DEPLOYMENTS.get("academic", "nursing-council")
        return await query_azure_openai(deployment, messages, system_prompt, timeout)
    else:
        # OpenRouter mode - use a default model
        model = OPENROUTER_COUNCIL_MODELS[0] if OPENROUTER_COUNCIL_MODELS else "openai/gpt-4o"
        return await query_openrouter(model, messages, system_prompt, timeout)


async def query_models_parallel(
    models_or_members: List[str],
    messages: List[Dict[str, str]]
) -> Dict[str, Optional[Dict[str, Any]]]:
    """
    Query multiple models/members in parallel.

    Args:
        models_or_members: List of council member IDs or model identifiers
        messages: List of message dicts to send to each

    Returns:
        Dict mapping identifier to response dict (or None if failed)
    """
    tasks = [query_model(m, messages) for m in models_or_members]
    responses = await asyncio.gather(*tasks)
    return {m: response for m, response in zip(models_or_members, responses)}


# ============================================================
# HELPER FUNCTIONS FOR COUNCIL ORCHESTRATION
# ============================================================

def get_council_members() -> List[str]:
    """Get the list of council member identifiers for the current backend."""
    if API_BACKEND == "azure":
        return COUNCIL_MEMBERS
    else:
        return OPENROUTER_COUNCIL_MODELS


def get_chairman() -> str:
    """Get the chairman identifier for the current backend."""
    if API_BACKEND == "azure":
        return CHAIRMAN_ID
    else:
        return OPENROUTER_CHAIRMAN_MODEL
