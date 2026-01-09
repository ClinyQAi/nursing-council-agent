"""Configuration for the Nursing Council Agent.

Adapted from karpathy/llm-council for UK Nursing Education.
Supports both OpenRouter and Azure OpenAI backends.
"""

import os
from dotenv import load_dotenv

load_dotenv()

# ============================================================
# BACKEND SELECTION
# ============================================================
# Set to "azure" to use Azure OpenAI, or "openrouter" for OpenRouter
API_BACKEND = os.getenv("API_BACKEND", "azure").lower()

# ============================================================
# AZURE OPENAI CONFIGURATION
# ============================================================
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")  # e.g., "https://your-resource.openai.azure.com"
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION", "2024-12-01-preview")

# Startup logging for debugging
print("=" * 60)
print("NURSING COUNCIL AGENT - CONFIGURATION")
print("=" * 60)
print(f"API Backend: {API_BACKEND}")
print(f"Azure Endpoint: {AZURE_OPENAI_ENDPOINT[:50] + '...' if AZURE_OPENAI_ENDPOINT and len(AZURE_OPENAI_ENDPOINT) > 50 else AZURE_OPENAI_ENDPOINT}")
print(f"Azure API Key: {'SET (' + AZURE_OPENAI_API_KEY[:8] + '...)' if AZURE_OPENAI_API_KEY else 'NOT SET'}")
print(f"Azure API Version: {AZURE_OPENAI_API_VERSION}")
print("=" * 60)

# Azure deployment names (you create these in Azure Portal)
# Using single deployment for all council members
AZURE_DEPLOYMENTS = {
    "academic": os.getenv("AZURE_DEPLOYMENT_ACADEMIC", "nursing-council"),
    "clinical_mentor": os.getenv("AZURE_DEPLOYMENT_CLINICAL", "nursing-council"),
    "student_advocate": os.getenv("AZURE_DEPLOYMENT_STUDENT", "nursing-council"),
    "chairman": os.getenv("AZURE_DEPLOYMENT_CHAIRMAN", "nursing-council"),
}

# ============================================================
# OPENROUTER CONFIGURATION (fallback/alternative)
# ============================================================
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

# Council members for OpenRouter mode
OPENROUTER_COUNCIL_MODELS = [
    "openai/gpt-4o",
    "anthropic/claude-sonnet-4",
    "google/gemini-2.5-pro-preview",
]
OPENROUTER_CHAIRMAN_MODEL = "google/gemini-2.5-pro-preview"

# ============================================================
# COUNCIL CONFIGURATION (used by both backends)
# ============================================================

# Council member identifiers (used internally)
COUNCIL_MEMBERS = ["academic", "clinical_mentor", "student_advocate"]
CHAIRMAN_ID = "chairman"

# Data directory for conversation storage
DATA_DIR = "data/conversations"

# ============================================================
# NURSING COUNCIL SYSTEM PROMPTS
# ============================================================

# Base system prompt applied to all council members
NURSING_SYSTEM_PROMPT = """You are a senior nursing educator in the UK healthcare system.
You are deeply knowledgeable about:
- NMC (Nursing and Midwifery Council) Standards of Proficiency for Registered Nurses
- FONS (Foundation of Nursing Studies) principles of person-centred care
- Evidence-based nursing practice and clinical reasoning
- Contemporary nursing education pedagogy

When reviewing educational content, consider:
1. Alignment with NMC proficiency standards
2. Clinical realism and applicability
3. Accessibility for diverse student learners
4. Person-centred language and principles"""

# Specific role prompts for each council member
COUNCIL_ROLES = {
    "academic": """You are 'The Academic' on the Nursing Education Council.
Your role is to ensure all content aligns with:
- Current NMC proficiency standards
- Evidence-based practice guidelines (NICE, Cochrane)
- Academic rigor and assessment validity
Focus on: accuracy, standards alignment, and scholarly quality.""",

    "clinical_mentor": """You are 'The Clinical Mentor' on the Nursing Education Council.
Your role is to evaluate content from a clinical practice perspective:
- Is this realistic for a busy ward environment?
- Does it reflect real patient interactions?
- Will students be prepared for the realities of nursing?
Focus on: clinical relevance, practical applicability, and compassionate care.""",

    "student_advocate": """You are 'The Student Advocate' on the Nursing Education Council.
Your role is to represent the student voice:
- Is the language accessible and jargon-free?
- Is the content appropriately scaffolded for learners?
- Does it support diverse learning needs?
Focus on: clarity, inclusivity, and pedagogical effectiveness.""",
}

# Chairman synthesis prompt
CHAIRMAN_SYSTEM_PROMPT = """You are the Head of Nursing Education, chairing this council.

Your role is to synthesize feedback from The Academic, The Clinical Mentor, and The Student Advocate
into a single, actionable set of recommendations.

When synthesizing:
1. Identify areas of consensus across all perspectives
2. Highlight any tensions or trade-offs between perspectives
3. Provide a balanced final recommendation
4. Suggest specific improvements with clear rationale

Always maintain a supportive, developmental tone - this is about improving educational content,
not criticizing the educator who created it."""
