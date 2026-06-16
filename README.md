# AI UI Builder - Multi-Framework Edition

## Overview

A sophisticated multi-agent orchestration system that generates production-ready UI components for **React**, **Angular**, and **Vue 3** from design inputs (Figma, images, PDFs).

**Status**: Phase 1 (Weeks 1-8) - MVP with React focus  
**Framework Support**: React ✅ Complete, Angular & Vue 🔄 Stubs Ready

---

## Architecture

```
Design Input (Figma/Image/PDF)
         ↓
   Design Agent (extract UI specs)
         ↓
  Orchestrator Agent (route to framework)
         ↓
    Framework Agents
    ├─ ReactAgent (complete)
    ├─ AngularAgent (stub - Phase 2)
    └─ VueAgent (stub - Phase 2)
         ↓
  Validation Engine (4-layer guardrails)
         ↓
  Approval Workflow
         ↓
  Project Writer (files to disk)
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
npm run build
npm run dev
```

Server starts on `http://localhost:3000`

### Available Commands

```bash
npm run dev           # Start dev server with ts-node
npm run build         # Compile TypeScript
npm start             # Run compiled project
npm test              # Run tests with Jest
npm run lint          # Run ESLint
npm run type-check    # TypeScript type checking
```

---

## Phase 1: MVP Foundation (Weeks 1-8)

### Sprint 1-2: Infrastructure ✅ COMPLETE
- [x] Node.js + Express + TypeScript setup
- [x] Abstract `FrameworkAgent` base class
- [x] File-based session storage
- [x] Framework routing engine
- [x] Package.json with all dependencies

**Files Created**:
- `src/agents/base/FrameworkAgent.ts` - Abstract base class
- `src/agents/base/types.ts` - Type definitions
- `src/storage/sessionStorage.ts` - File-based persistence
- `src/agents/orchestrator/frameworkRouter.ts` - Routing logic
- `src/index.ts` - Express app entry

### Sprint 3-4: Orchestrator & Routing 🔄 IN PROGRESS
- [ ] `OrchestratorAgent` with state machine
- [ ] `POST /api/v2/chat/init` endpoint
- [ ] `POST /api/v2/chat/message` endpoint
- [ ] Approval workflow state machine
- [ ] Cost tracking per framework

### Sprint 5: Design Agent 📋 PENDING
- [ ] Design parsing (image, PDF)
- [ ] UI specification extraction
- [ ] Design token detection

### Sprint 6: React Code Generation 📋 PENDING
- [ ] `ReactAgent` completion
- [ ] Component generation (TSX)
- [ ] Test generation (Jest + RTL)
- [ ] Type generation
- [ ] Angular/Vue stubs

### Sprint 7: Validation 📋 PENDING
- [ ] 4-layer validation system
- [ ] TypeScript strict mode
- [ ] ESLint framework-specific
- [ ] Testing framework integration
- [ ] Forensic tracing

### Sprint 8: E2E & Deployment 📋 PENDING
- [ ] End-to-end workflow
- [ ] Project file writer
- [ ] Documentation generation
- [ ] E2E testing

---

## API Endpoints

### Chat Initialization
```bash
POST /api/v2/chat/init
{
  "userId": "user_123",
  "framework": "react" (optional)
}
```

Response:
```json
{
  "sessionId": "sess_abc123",
  "framework": "react",
  "frameworkLocked": false,
  "context": {
    "designSystem": "tailwind",
    "gridLibrary": "ag-grid",
    "stateManagement": "context"
  }
}
```

### Send Chat Message
```bash
POST /api/v2/chat/message
{
  "sessionId": "sess_abc123",
  "message": "Generate a button component"
}
```

### Framework Recommendations
```bash
GET /api/v2/frameworks/recommend?designInputType=form&complexity=simple
```

### Health Check
```bash
GET /health
```

---

## Project Structure

```
agent-tool/
├── src/
│   ├── agents/
│   │   ├── base/
│   │   │   ├── FrameworkAgent.ts
│   │   │   └── types.ts
│   │   ├── react/
│   │   │   └── (Sprint 6)
│   │   ├── angular/
│   │   │   └── (Sprint 6 - stub)
│   │   ├── vue/
│   │   │   └── (Sprint 6 - stub)
│   │   ├── design/
│   │   │   └── (Sprint 5)
│   │   └── orchestrator/
│   │       ├── OrchestratorAgent.ts (Sprint 3-4)
│   │       └── frameworkRouter.ts
│   ├── api/
│   │   ├── chat/
│   │   ├── frameworks/
│   │   ├── approval/
│   │   └── projects/
│   ├── storage/
│   │   └── sessionStorage.ts
│   ├── validation/
│   │   └── (Sprint 7)
│   ├── tracing/
│   │   └── (Sprint 7)
│   └── index.ts
├── templates/
│   ├── react/
│   ├── angular/
│   └── vue/
├── tests/
│   ├── agents/
│   ├── api/
│   └── e2e/
└── docs/
    ├── API.md
    └── ARCHITECTURE.md
```

---

## Testing

### Run All Tests
```bash
npm test
```

### Run Specific Test
```bash
npm test -- sessionStorage.test.ts
```

### Watch Mode
```bash
npm test -- --watch
```

---

## Storage

Sessions are stored as JSON files in `.claude/sessions/`:

```
.claude/sessions/
├── sess_abc123.json
├── sess_def456.json
└── ...
```

Example session:
```json
{
  "sessionId": "sess_abc123",
  "userId": "user_123",
  "selectedFramework": "react",
  "frameworkLocked": false,
  "designSystem": "tailwind",
  "conversationHistory": [],
  "costTracking": {
    "total": 0.50,
    "byFramework": {
      "react": 0.50,
      "angular": 0.00,
      "vue": 0.00
    }
  }
}
```

---

## Framework Routing (Priority Order)

1. **Explicit user choice** - User selects framework
2. **Project context** - Add to existing project framework
3. **Design analysis** - Claude analyzes design, scores frameworks
4. **User preference** - Historical framework usage
5. **Default** - React (most popular)

---

## Phase 2: Advanced Features (Weeks 9-16)

- [ ] Complete Angular support (sprint 9-10)
- [ ] Complete Vue 3 support (sprint 11-12)
- [ ] Multi-LLM intelligent routing (Sprint 13)
- [ ] RAG system for design patterns (Sprint 14-15)
- [ ] Framework migration tools (Sprint 16)

---

## Phase 3: Enterprise & Scale (Weeks 17-24)

- [ ] Existing project import
- [ ] Team collaboration & RBAC
- [ ] Analytics & reporting
- [ ] Cloud deployment (AWS)
- [ ] Production hardening

---

## Key Design Decisions

✅ **Specialized Agents**: Each framework gets dedicated agent with idiomatic code generation  
✅ **Single Orchestrator**: Centralized routing and workflow orchestration  
✅ **File-based Storage**: No database dependency, framework-agnostic format  
✅ **4-Layer Validation**: Input → TypeScript → ESLint → Testing  
✅ **React MVP First**: Deliver value in 8 weeks, unblock Phase 2  

---

## Success Criteria (Phase 1)

### React (Week 8)
- ✅ Generation time < 45 seconds
- ✅ Code quality: 0 ESLint errors, 100% TypeScript strict
- ✅ Test coverage > 90%
- ✅ Bundle size < 50KB gzip
- ✅ Idiomatically correct React code (senior dev review)

### Angular & Vue (Stubs Ready)
- ✅ Routing functional
- ✅ API contracts defined
- ✅ Ready for Phase 2 implementation

---

## Contributing

See [IMPLEMENTATION_PLAN.md](./docs/IMPLEMENTATION_PLAN.md) for detailed sprint breakdown.

---

## Support

For questions or issues:
1. Check [API.md](./docs/API.md)
2. Review [AGENT_TRACE.md](./docs/AGENT_TRACE.md) for debugging
3. File an issue on GitHub

---

**Version**: 1.0.0 - Phase 1 MVP  
**Last Updated**: 2026-06-16  
**Status**: 🟢 Infrastructure Complete, Orchestration in Progress

