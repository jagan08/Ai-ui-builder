# AI UI Builder - API Documentation

**Version**: 2.0 (Sprint 3-4 Complete)  
**Phase**: 1 (MVP - React Focus)  
**Status**: ✅ Fully Functional

---

## Overview

The AI UI Builder API provides a complete interface for:
1. **Session Management** - Persistent user sessions with framework selection
2. **Design Input Processing** - Upload and analyze designs
3. **Multi-Framework Orchestration** - Intelligent routing to React/Angular/Vue agents
4. **Approval Workflows** - Review and approve generated components
5. **Generation History** - Track all component generations per session

All endpoints return JSON. Timestamps are ISO 8601 format.

---

## Authentication

**Current Phase (1)**: No authentication required  
**Future (Phase 3)**: OAuth 2.0 with JWT tokens

---

## Endpoint Reference

### Health & Status

#### 1. Health Check
```http
GET /health
```

Returns server health status.

**Response** (200 OK):
```json
{
  "status": "ok",
  "message": "AI UI Builder is running",
  "timestamp": "2026-06-16T15:30:00.000Z"
}
```

---

#### 2. Server Status
```http
GET /status
```

Returns detailed system status including orchestrator state.

**Response** (200 OK):
```json
{
  "status": "operational",
  "version": "1.0.0",
  "phase": "1-mvp-react-focus",
  "frameworks": ["react", "angular", "vue"],
  "orchestrator": {
    "pendingApprovals": 2,
    "generationHistory": 15
  },
  "timestamp": "2026-06-16T15:30:00.000Z"
}
```

---

### Session Management

#### 3. Initialize Chat Session
```http
POST /api/v2/chat/init
Content-Type: application/json

{
  "userId": "user_123",
  "framework": "react" (optional)
}
```

Creates a new session for a user. Framework defaults to React if not specified.

**Parameters**:
- `userId` *(string, required)* - Unique user identifier
- `framework` *(string, optional)* - One of: `react`, `angular`, `vue`

**Response** (200 OK):
```json
{
  "sessionId": "sess_abc123xyz",
  "framework": "react",
  "frameworkLocked": false,
  "context": {
    "designSystem": "tailwind",
    "gridLibrary": "ag-grid",
    "stateManagement": "context"
  }
}
```

**Errors**:
- 400 - `userId` is required
- 500 - Server error

---

### Design Input & Generation

#### 4. Send Chat Message with Design Input
```http
POST /api/v2/chat/message
Content-Type: application/json

{
  "sessionId": "sess_abc123xyz",
  "input": {
    "type": "figma",
    "data": "base64_or_url",
    "selectedFramework": "react" (optional),
    "customInstructions": "Add dark mode support",
    "requiresDataGrid": false,
    "needsRealtimeUpdates": false
  }
}
```

Processes design input and orchestrates component generation.

**Parameters**:
- `sessionId` *(string, required)* - From `/api/v2/chat/init`
- `input` *(object, required)*
  - `type` *(string)* - One of: `figma`, `image`, `pdf`, `excel`, `word`
  - `data` *(string)* - Base64 encoded or URL
  - `selectedFramework` *(string, optional)* - Override session framework
  - `customInstructions` *(string, optional)* - Additional requirements
  - `requiresDataGrid` *(boolean, optional)* - Hint for framework selection
  - `needsRealtimeUpdates` *(boolean, optional)* - Hint for framework selection

**Response** (200 OK):
```json
{
  "requestId": "req_def456",
  "sessionId": "sess_abc123xyz",
  "status": "pending_approval",
  "framework": "react",
  "components": [
    {
      "name": "Component1",
      "framework": "react",
      "componentType": "tsx",
      "preview": "// Generated component (react - tsx)"
    }
  ],
  "estimatedCost": 2.00,
  "requiresApproval": true,
  "approvalData": {
    "componentCount": 5,
    "estimatedCost": 2.00,
    "frameworkCompatibility": [
      {
        "framework": "react",
        "compatible": true
      },
      {
        "framework": "angular",
        "compatible": false,
        "conversionCost": 5.0,
        "reason": "Requires state management and pattern conversion"
      },
      {
        "framework": "vue",
        "compatible": false,
        "conversionCost": 3.0,
        "reason": "Requires Composition API adaptation"
      }
    ]
  }
}
```

**Status Codes**:
- `processing` - Small request, generating immediately
- `pending_approval` - Large request (cost > $2.00 or components > 5) awaiting user approval
- `error` - Generation failed

**Errors**:
- 400 - Missing `sessionId` or `input`
- 404 - Session not found
- 500 - Generation error

---

### Approval Workflow

#### 5. Approve Generation Request
```http
POST /api/v2/approval/approve
Content-Type: application/json

{
  "requestId": "req_def456"
}
```

Approves a pending generation request.

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Request req_def456 approved. Generation will proceed."
}
```

**Errors**:
- 400 - Missing `requestId`
- 404 - Request not found
- 500 - Approval error

---

#### 6. Reject Generation Request
```http
POST /api/v2/approval/reject
Content-Type: application/json

{
  "requestId": "req_def456",
  "reason": "Need to adjust requirements"
}
```

Rejects a pending generation request.

**Parameters**:
- `requestId` *(string, required)* - Request ID from generation response
- `reason` *(string, optional)* - Rejection reason for audit trail

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Request req_def456 rejected. You can modify and resubmit."
}
```

---

#### 7. Modify and Resubmit Request
```http
POST /api/v2/approval/modify
Content-Type: application/json

{
  "requestId": "req_def456",
  "modifications": {
    "userNotes": "Updated requirements: add accessibility features"
  }
}
```

Modifies a rejected/pending request and creates a new request ID.

**Response** (200 OK):
```json
{
  "success": true,
  "newRequestId": "req_ghi789",
  "message": "Original request marked as modified. New request ID: req_ghi789"
}
```

**Errors**:
- 400 - Missing `requestId` or `modifications`
- 404 - Original request not found

---

#### 8. Get Approval Status
```http
GET /api/v2/approval/req_def456
```

Retrieves the status of a specific approval request.

**Response** (200 OK):
```json
{
  "requestId": "req_def456",
  "sessionId": "sess_abc123xyz",
  "framework": "react",
  "componentsCount": 5,
  "estimatedCost": 2.00,
  "status": "approved",
  "createdAt": "2026-06-16T15:20:00.000Z",
  "updatedAt": "2026-06-16T15:25:00.000Z",
  "userNotes": "Add dark mode support"
}
```

**Errors**:
- 404 - Approval request not found

---

#### 9. Get Generation History
```http
GET /api/v2/generation/req_def456
```

Retrieves the full generation history for a request.

**Response** (200 OK):
```json
{
  "requestId": "req_def456",
  "sessionId": "sess_abc123xyz",
  "status": "approved",
  "framework": "react",
  "components": [
    {
      "name": "Button",
      "framework": "react",
      "componentType": "tsx",
      "preview": "// Generated button component"
    }
  ],
  "estimatedCost": 0.40,
  "requiresApproval": false
}
```

---

#### 10. List Pending Approvals for Session
```http
GET /api/v2/session/sess_abc123xyz/approvals
```

Lists all pending approvals for a session.

**Response** (200 OK):
```json
{
  "sessionId": "sess_abc123xyz",
  "pendingCount": 2,
  "approvals": [
    {
      "requestId": "req_def456",
      "framework": "react",
      "componentsCount": 5,
      "estimatedCost": 2.00,
      "status": "pending",
      "createdAt": "2026-06-16T15:20:00.000Z",
      "updatedAt": "2026-06-16T15:20:00.000Z"
    },
    {
      "requestId": "req_jkl012",
      "framework": "angular",
      "componentsCount": 3,
      "estimatedCost": 1.65,
      "status": "pending",
      "createdAt": "2026-06-16T15:25:00.000Z",
      "updatedAt": "2026-06-16T15:25:00.000Z"
    }
  ]
}
```

---

### Framework Recommendations

#### 11. Get Framework Recommendations
```http
GET /api/v2/frameworks/recommend?designInputType=form&complexity=simple&teamSize=solo
```

Get intelligent framework recommendations based on design characteristics.

**Query Parameters** (all optional):
- `designInputType` - One of: `form`, `table`, `dashboard`, `landing`, `admin`
- `complexity` - One of: `simple`, `medium`, `complex`
- `teamSize` - One of: `solo`, `small`, `medium`, `large`, `enterprise`
- `maintenancePreference` - One of: `fast-dev`, `long-term-maintainability`

**Response** (200 OK):
```json
{
  "recommendations": [
    {
      "framework": "react",
      "score": 8.5,
      "reasoning": "Recommended for medium to large teams with interactive dashboards",
      "pros": ["Largest ecosystem", "Fast development", "Medium learning curve"],
      "cons": ["Many choice decisions", "Bundle size considerations"],
      "bestFor": ["product teams", "startup velocity", "complex state"]
    },
    {
      "framework": "angular",
      "score": 7.0,
      "reasoning": "Recommended for enterprise applications",
      "pros": ["Google-backed", "Complete framework"],
      "cons": ["Steep learning curve"],
      "bestFor": ["enterprise", "large teams"]
    },
    {
      "framework": "vue",
      "score": 7.5,
      "reasoning": "Recommended for small teams and rapid development",
      "pros": ["Gentle learning curve", "Small bundle"],
      "cons": ["Smaller ecosystem"],
      "bestFor": ["solo developers", "MVPs"]
    }
  ],
  "primaryRecommendation": "react",
  "secondaryRecommendation": "angular"
}
```

---

## Framework Costs

Per-component generation costs (Phase 1):

| Framework | Cost | Advantages | Build Time |
|-----------|------|------------|-----------|
| React | $0.40 | Fastest dev, largest ecosystem | ~30s |
| Angular | $0.55 | Enterprise-grade, complete framework | ~45s |
| Vue | $0.35 | Smallest bundle, learning curve | ~25s |

**Approval Thresholds**:
- Requests > $2.00 or > 5 components require user approval
- Users can approve, reject, or modify before proceeding

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Short error description",
  "details": "Optional detailed explanation",
  "requestId": "req_xyz (if applicable)"
}
```

**Common HTTP Status Codes**:
- `200 OK` - Request successful
- `400 Bad Request` - Validation error (missing fields, invalid format)
- `404 Not Found` - Session, request, or approval not found
- `500 Internal Server Error` - Server error during processing

---

## Rate Limiting

**Current Phase**: None  
**Future (Phase 3)**: 100 requests/minute per user

---

## Workflow Examples

### Example 1: Simple Button Component (Auto-Approved)

```bash
# 1. Initialize session
curl -X POST http://localhost:3000/api/v2/chat/init \
  -H "Content-Type: application/json" \
  -d '{"userId": "user_123", "framework": "react"}'

# Response: {"sessionId": "sess_abc123xyz", ...}

# 2. Send design input (small, auto-approved)
curl -X POST http://localhost:3000/api/v2/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "sess_abc123xyz",
    "input": {
      "type": "image",
      "data": "base64_image_data",
      "customInstructions": "Create a blue primary button"
    }
  }'

# Response: {"requestId": "req_def456", "status": "processing", "framework": "react", ...}
# Generation proceeds without approval
```

### Example 2: Complex Dashboard (Requires Approval)

```bash
# 1. Initialize session
curl -X POST http://localhost:3000/api/v2/chat/init \
  -H "Content-Type: application/json" \
  -d '{"userId": "user_456"}'

# 2. Send complex design (triggers approval)
curl -X POST http://localhost:3000/api/v2/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "sess_def456uvw",
    "input": {
      "type": "figma",
      "data": "figma_url_or_data",
      "customInstructions": "Dashboard with 10 components"
    }
  }'

# Response: {"requestId": "req_ghi789", "status": "pending_approval", "requiresApproval": true, ...}

# 3. Review approval details
curl http://localhost:3000/api/v2/approval/req_ghi789

# 4. Approve generation
curl -X POST http://localhost:3000/api/v2/approval/approve \
  -H "Content-Type: application/json" \
  -d '{"requestId": "req_ghi789"}'

# Generation proceeds with approved framework
```

### Example 3: Framework Compatibility Analysis

```bash
# Get recommendations for dashboard
curl "http://localhost:3000/api/v2/frameworks/recommend?designInputType=dashboard&complexity=complex&teamSize=medium"

# Response shows React (8.5), Angular (7.0), Vue (7.5) with conversion costs
```

---

## Session Context Structure

Each session maintains framework-aware context:

```json
{
  "sessionId": "sess_abc123xyz",
  "userId": "user_123",
  "selectedFramework": "react",
  "frameworkLocked": true,
  "designSystem": "tailwind",
  "gridLibrary": "ag-grid",
  "stateManagement": "context",
  "conversationHistory": [
    {
      "role": "user",
      "content": "...",
      "timestamp": "2026-06-16T15:20:00.000Z"
    }
  ],
  "costTracking": {
    "total": 1.20,
    "byFramework": {
      "react": 1.20,
      "angular": 0.00,
      "vue": 0.00
    }
  }
}
```

---

## Next Phase APIs (Phase 2)

Coming in Weeks 9-16:

- **Multi-LLM Routing** - Fallback to GPT-4o
- **Project Conversion** - `POST /api/v2/projects/{id}/convert`
- **RAG Integration** - Design pattern retrieval
- **Advanced Analytics** - Usage dashboards per framework
- **Team Collaboration** - `POST /api/v2/team/invite`

---

## Debugging

### Get Forensic Trace
```http
GET /api/v2/generation/req_def456/trace
```

Returns `AGENT_TRACE.md` with full decision tree, cost breakdown, and framework selection reasoning (Coming in Sprint 7).

---

## Support & Troubleshooting

**Check Server Health**:
```bash
curl http://localhost:3000/health
```

**View System Status**:
```bash
curl http://localhost:3000/status
```

**Enable Debug Logging** (development):
```bash
DEBUG=* npm run dev
```

---

**Last Updated**: 2026-06-16  
**Maintained By**: Engineering Team  
**Reference**: See [IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md) for roadmap

