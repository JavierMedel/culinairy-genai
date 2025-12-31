# CulinAIry 🍽️

**CulinAIry** is a backend-first, production-oriented **GenAI system for personalized meal planning**, built to demonstrate how large language models can be combined with structured data, retrieval, and validation to solve a real-world constrained planning problem.

This project is intentionally designed as a **portfolio-grade GenAI engineering system**, not a prompt-only demo or a simple recipe website.

---

## Problem Statement

Meal planning is a constrained optimization problem:
- Users have **dietary preferences, allergies, calorie targets, and time constraints**
- Recipes come from **heterogeneous and imperfect data sources**
- Prompt-only LLM approaches tend to **hallucinate ingredients, violate constraints, and produce inconsistent results**

CulinAIry addresses these challenges by treating meal planning as a **retrieval-augmented, constraint-aware generation problem**, grounded in a structured recipe knowledge base.

---

## Design Principles

- **Backend-first**: All business logic lives in APIs and services
- **Structured over free-form**: Strong schemas and validation
- **Composable architecture**: Retrieval, generation, and validation are decoupled
- **Inspectable data**: Recipes are stored as explicit domain entities
- **Production mindset**: Clear trade-offs, scope control, and extensibility

---

## Current Scope (MVP)

### What CulinAIry Does Today

- Stores recipes as **first-class domain objects** (one JSON file per recipe)
- Exposes a **FastAPI-based Recipe Service**
- Serves structured recipe data including:
  - Ingredients
  - Cooking steps
  - Nutrition (when available)
  - Images
- Supports deterministic recipe retrieval and filtering
- Acts as a **source of truth** for future GenAI components

### Explicit Non-Goals (for now)

- No mobile app
- No social or recommendation features
- No fine-tuning
- No heavy database or distributed infrastructure

These decisions are intentional to keep the system focused and explainable.

---

## Architecture (Current)

```
Client (Web UI)
     ↓
FastAPI
     ↓
Recipe Service Layer
     ↓
JSON Recipe Store (File-based)
```

This layer will later serve as the **retrieval foundation** for RAG-based meal planning and agent workflows.

---

## Recipe Storage Strategy

Recipes are stored as **one JSON file per recipe**, for example:

```
data/
└── recipes/
    ├── r_001.json
    ├── r_002.json
    └── ...
```

### Why this approach?
- Mirrors object storage patterns used in production
- Enables partial loading and easy debugging
- Maps cleanly to future RAG ingestion (one recipe = one document)
- Avoids premature database complexity

A repository abstraction ensures storage can be swapped later without changing API contracts.

---

## Core Data Model (Simplified)

```json
{
  "id": "r_001",
  "title": "Grilled Chicken Bowl",
  "cuisine": "American",
  "diet_tags": ["high-protein"],
  "prep_time_minutes": 20,
  "cook_time_minutes": 15,
  "ingredients": [
    {"name": "chicken breast", "quantity": 200, "unit": "g"}
  ],
  "steps": [
    "Season the chicken",
    "Grill until fully cooked"
  ],
  "nutrition": {
    "calories": 520,
    "protein_g": 42
  },
  "image_url": "/images/r_001.jpg"
}
```

Schemas are enforced using **Pydantic** to ensure data quality and validation.

---

## API Endpoints (Initial)

- `GET /recipes` – List recipes (paginated)
- `GET /recipes/{id}` – Retrieve a single recipe
- `GET /recipes/search` – Filter recipes by metadata (diet, prep time, etc.)

These deterministic endpoints provide a baseline system that complements future LLM-based flows.

---

## Technology Stack

- **Backend**: FastAPI
- **Data Modeling & Validation**: Pydantic
- **Storage**: File-based JSON (one file per recipe)
- **Frontend**: Lightweight web UI (consumer of the API)

Planned additions:
- Embeddings + Vector Store (FAISS / Pinecone)
- LLM-based meal planner (Azure OpenAI / OpenAI)
- Validation & evaluation layers

---

## Roadmap

### Phase 1 – Recipe Service ✅
- Structured recipe storage
- API-based access
- Filtering & pagination

### Phase 2 – Retrieval Layer (RAG)
- Recipe chunking & embeddings
- Metadata-aware semantic search
- Hybrid retrieval (semantic + rules)

### Phase 3 – Meal Planning with GenAI
- Constraint-aware weekly planning
- Structured generation (JSON schemas)
- Deterministic regeneration strategies

### Phase 4 – Evaluation & Reliability
- Constraint validation
- Output quality checks
- Cost and latency considerations

---

## Why This Project Exists

CulinAIry is designed to answer a common interview question:

> *“How would you build a production-ready GenAI system, end to end?”*

This project emphasizes **engineering decisions, trade-offs, and system design** over UI polish or prompt tricks.

---

## Author

Built as a portfolio project by an AI / GenAI Engineer, with a focus on:
- Retrieval-Augmented Generation (RAG)
- Production system design
- LLM reliability and validation
- ZenML

---

## License

MIT
