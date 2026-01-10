
import os
import litellm
from typing import List, Dict, Any, Optional

class LLMService:
    @staticmethod
    def generate_response(
        messages: List[Dict[str, str]], 
        provider: str, 
        model: str, 
        api_key: str,
        temperature: float = 0.7
    ) -> str:
        """
        Unified generation method supporting OpenAI, Azure, Anthropic, Google, and DeepSeek.
        Uses litellm to handle provider differences.
        """
        
        # Configure litellm environment variables based on provider
        env_updates = {}
        
        if provider == "openai":
            env_updates["OPENAI_API_KEY"] = api_key
            completion_model = model
            
        elif provider == "azure":
            # For Azure, we expect the key to be passed, but the endpoint usually needs
            # to be configured via env var or passed specifically. 
            # ideally, we keep the existing Azure env vars for the hosted version fallback,
            # but if a user selects 'azure' manually (advanced), we'd need more configs.
            # For this 'Bring Your Own Key' implementation, we focus on public providers.
            # If the provider is 'azure' (legacy default), we rely on existing env vars.
            pass

        elif provider == "anthropic":
            env_updates["ANTHROPIC_API_KEY"] = api_key
            completion_model = model 
            
        elif provider == "google":
            env_updates["GEMINI_API_KEY"] = api_key
            # LiteLLM expects 'gemini/gemini-pro' format often, but let's trust the FE sends correct string
            completion_model = model
            
        elif provider == "deepseek":
            env_updates["DEEPSEEK_API_KEY"] = api_key
            completion_model = f"deepseek/{model}" if not model.startswith("deepseek") else model
            
        else:
            raise ValueError(f"Unsupported provider: {provider}")

        # Temporarily set env vars for this request context if creating a new client isn't efficient
        # Litellm is stateless for the most part, checking env vars on call
        # But modifying os.environ is not thread-safe in async apps.
        # Better to pass api_key directly to completion where possible.
        
        try:
            # Prepare arguments for litellm
            kwargs = {
                "model": completion_model if provider != "azure" else f"azure/{model}",
                "messages": messages,
                "temperature": temperature,
            }

            # Map specific API keys
            if provider == "openai":
                kwargs["api_key"] = api_key
            elif provider == "anthropic":
                kwargs["api_key"] = api_key
            elif provider == "google":
                kwargs["api_key"] = api_key
            elif provider == "deepseek":
                kwargs["api_key"] = api_key
                kwargs["base_url"] = "https://api.deepseek.com" # standard DeepSeek endpoint

            # For Azure fallback (if provider is 'azure' or default)
            if provider == "azure":
               # handled by environment variables already set in container
               pass

            response = litellm.completion(**kwargs)
            return response.choices[0].message.content

        except Exception as e:
            print(f"LLM Generation Error ({provider}/{model}): {str(e)}")
            raise e
