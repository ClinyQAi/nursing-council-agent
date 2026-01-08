# Nursing Council Agent

> **Adapted from [karpathy/llm-council](https://github.com/karpathy/llm-council) for UK Nursing Education**

An LLM Council for nursing educators to get comprehensive feedback on lesson plans, assessments, and educational content from multiple AI perspectives.

![Demo](header.jpg)

## The Concept

Instead of asking one AI for feedback, the **Nursing Council** convenes three AI "experts" who each bring a different perspective:

| Role | Focus |
|------|-------|
| 🎓 **The Academic** | NMC Standards alignment, evidence-based practice, scholarly rigor |
| 🏥 **The Clinical Mentor** | Ward realism, clinical applicability, compassionate care |
| 👩‍🎓 **The Student Advocate** | Accessibility, clarity, diverse learning needs |

The **Head of Nursing Education** (Chairman) then synthesizes their feedback into actionable recommendations.

## Quick Start (GitHub Codespaces)

1. **Fork this repository** to your GitHub account
2. Click the green **"Code"** button → **"Open with Codespaces"** → **"New codespace"**
3. Wait for the environment to build (takes ~2 minutes first time)
4. Add your OpenRouter API key:
   ```bash
   echo "OPENROUTER_API_KEY=your_key_here" > .env
   ```
5. Run the app:
   ```bash
   ./start.sh
   ```

## Local Development

### Prerequisites
- Python 3.11+
- Node.js 18+
- [uv](https://github.com/astral-sh/uv) (Python package manager)
- [OpenRouter API Key](https://openrouter.ai/keys)

### Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/nursing-council-agent.git
cd nursing-council-agent

# Install Python dependencies
pip install uv
uv sync

# Install frontend dependencies
cd frontend && npm install && cd ..

# Set your API key
echo "OPENROUTER_API_KEY=your_key_here" > .env

# Start the app
./start.sh
```

The app will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000

## How It Works

```
┌─────────────────────────────────────────────────────────────────────┐
│ INPUT: "Review my lesson plan on medication administration"        │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
    ┌───────────────────────────────────────────────────────────┐
    │                STAGE 1: Individual Reviews                 │
    │  ┌──────────┐   ┌──────────────┐   ┌──────────────────┐   │
    │  │ Academic │   │ Clin. Mentor │   │ Student Advocate │   │
    │  └──────────┘   └──────────────┘   └──────────────────┘   │
    └───────────────────────────────────────────────────────────┘
                                    │
                                    ▼
    ┌───────────────────────────────────────────────────────────┐
    │               STAGE 2: Peer Ranking (Anonymized)           │
    │   Each council member ranks the others' responses          │
    └───────────────────────────────────────────────────────────┘
                                    │
                                    ▼
    ┌───────────────────────────────────────────────────────────┐
    │                   STAGE 3: Synthesis                       │
    │         Head of Nursing Education (Chairman)               │
    │         Combines all perspectives + rankings               │
    └───────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│ OUTPUT: Comprehensive, balanced feedback with specific suggestions  │
└─────────────────────────────────────────────────────────────────────┘
```

## Configuration

Edit `backend/config.py` to customize:
- Council member models
- Role-specific system prompts
- Chairman synthesis behavior

## Azure Integration (Coming Soon)

For enterprise deployments requiring Azure OpenAI instead of OpenRouter, see [docs/azure-integration.md](docs/azure-integration.md).

## License

MIT License - See [LICENSE](LICENSE) for details.

---

**Part of the [AI Educator Toolkit](https://practicedev.cloud)**
