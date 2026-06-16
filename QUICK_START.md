# Quick Start Guide

## Start the Server

```bash
npm run dev
```

Server will start on `http://localhost:3000`

## Health Check

```bash
curl http://localhost:3000/health
```

## Example: Initialize Session + Send Design

```bash
# 1. Initialize session
SESSION=$(curl -s -X POST http://localhost:3000/api/v2/chat/init \
  -H "Content-Type: application/json" \
  -d '{"userId": "user_123", "framework": "react"}' | grep -o '"sessionId":"[^"]*' | cut -d'"' -f4)

echo "Session ID: $SESSION"

# 2. Send design input (small, auto-approved)
curl -X POST http://localhost:3000/api/v2/chat/message \
  -H "Content-Type: application/json" \
  -d "{
    \"sessionId\": \"$SESSION\",
    \"input\": {
      \"type\": \"image\",
      \"data\": \"test_data\",
      \"customInstructions\": \"Create a blue button\"
    }
  }" | jq .

# 3. Check framework recommendations
curl "http://localhost:3000/api/v2/frameworks/recommend?designInputType=form&complexity=simple" | jq .
```

## View Documentation

- **Full API Docs**: See `docs/API.md`
- **Implementation Details**: See `IMPLEMENTATION_PLAN.md`
- **Sprint Summary**: See `SPRINT_3_4_SUMMARY.md`
- **Phase Progress**: See `PHASE_1_PROGRESS.md`

## Run Tests

```bash
npm test
```

## Build for Production

```bash
npm run build
npm run start
```

## Troubleshoot

```bash
# Check code quality
npm run lint
npm run type-check

# View all sessions
ls -la .claude/sessions/

# View server status
curl http://localhost:3000/status
```

---

**Next Milestone**: Sprint 5 (Design Agent) coming in Week 5
