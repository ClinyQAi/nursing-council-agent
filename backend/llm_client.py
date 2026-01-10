
"""LLM API client using unified LLMService."""

import asyncio
from typing import List, Dict, Any, Optional
from .llm import LLMService
from .config import (
    COUNCIL_MEMBERS,
    CHAIRMAN_ID,
    COUNCIL_ROLES,
    CHAIRMAN_SYSTEM_PROMPT,
    NURSING_SYSTEM_PROMPT,
)

async def query_model(
    member_id: str,
    messages: List[Dict[str, str]],
    llm_config: Optional[Dict[str, str]] = None,
    timeout: float = 120.0
) -> Optional[Dict[str, Any]]:
    """
    Query a model for a specific council member using the unified service.

    Args:
        member_id: Council member ID (e.g. 'academic', 'clinical') or 'chairman'
        messages: List of message dicts
        llm_config: Dict containing 'provider', 'model', 'api_key'
        timeout: Request timeout

    Returns:
        Response dict with 'content', or None if failed
    """
    # Default to azure/env vars if no config provided (backward compatibility)
    provider = llm_config.get("provider", "azure") if llm_config else "azure"
    model = llm_config.get("model", "gpt-4o") if llm_config else "gpt-4o"
    api_key = llm_config.get("api_key", "") if llm_config else ""

    # Determine system prompt based on member ID
    if member_id == CHAIRMAN_ID:
        system_prompt = CHAIRMAN_SYSTEM_PROMPT
    elif member_id in COUNCIL_ROLES:
        system_prompt = NURSING_SYSTEM_PROMPT + "\n\n" + COUNCIL_ROLES[member_id]
    else:
        # Fallback or custom role passed as ID? 
        # Actually custom roles are handled separately usually, but if member_id is standard...
        system_prompt = NURSING_SYSTEM_PROMPT

    # Prepend system prompt to messages
    full_messages = [{"role": "system", "content": system_prompt}] + messages

    try:
        content = LLMService.generate_response(
            messages=full_messages,
            provider=provider,
            model=model,
            api_key=api_key
        )
        return {"content": content}
    except Exception as e:
        print(f"Error querying {member_id} ({provider}/{model}): {e}")
        return None


async def query_model_with_custom_prompt(
    messages: List[Dict[str, str]],
    system_prompt: str,
    llm_config: Optional[Dict[str, str]] = None,
    timeout: float = 120.0
) -> Optional[Dict[str, Any]]:
    """
    Query a model using a custom system prompt (for custom roles).
    """
    provider = llm_config.get("provider", "azure") if llm_config else "azure"
    model = llm_config.get("model", "gpt-4o") if llm_config else "gpt-4o"
    api_key = llm_config.get("api_key", "") if llm_config else ""

    full_messages = [{"role": "system", "content": system_prompt}] + messages

    try:
        content = LLMService.generate_response(
            messages=full_messages,
            provider=provider,
            model=model,
            api_key=api_key
        )
        return {"content": content}
    except Exception as e:
        print(f"Error querying custom role ({provider}/{model}): {e}")
        return None


async def query_models_parallel(
    member_ids: List[str],
    messages: List[Dict[str, str]],
    llm_config: Optional[Dict[str, str]] = None
) -> Dict[str, Optional[Dict[str, Any]]]:
    """
    Query multiple council members in parallel.
    """
    tasks = [query_model(m, messages, llm_config) for m in member_ids]
    responses = await asyncio.gather(*tasks)
    return {m: response for m, response in zip(member_ids, responses)}


def get_council_members() -> List[str]:
    """Get list of standard council member IDs."""
    return COUNCIL_MEMBERS

def get_chairman() -> str:
    """Get chairman ID."""
    return CHAIRMAN_ID
