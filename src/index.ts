/**
 * Multi-Framework AI UI Builder - Express Server
 * Entry point for the agent orchestration system
 */

import express, { Express, Request, Response } from 'express';
import { SessionStorage } from './storage/sessionStorage';
import { Framework } from './agents/base/types';
import { getOrchestrator } from './agents/orchestrator/OrchestratorAgent';
import { getDesignAgent } from './agents/design/DesignAgent';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Initialize storage
SessionStorage.initialize();

/**
 * Health check endpoint
 */
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'AI UI Builder is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Initialize chatbot session
 * POST /api/v2/chat/init
 */
app.post('/api/v2/chat/init', (req: Request, res: Response) => {
  try {
    const { userId, framework } = req.body;

    if (!userId) {
      res.status(400).json({ error: 'userId is required' });
      return;
    }

    // Create new session
    const selectedFramework = framework && (Object.values(Framework) as string[]).includes(framework)
      ? (framework as Framework)
      : Framework.React;

    const session = SessionStorage.createSession(userId, selectedFramework);

    res.json({
      sessionId: session.sessionId,
      framework: session.selectedFramework,
      frameworkLocked: session.frameworkLocked,
      context: {
        designSystem: session.designSystem,
        gridLibrary: session.gridLibrary,
        stateManagement: session.stateManagement,
      },
    });
  } catch (error) {
    console.error('Error initializing session:', error);
    res.status(500).json({ error: 'Failed to initialize session' });
  }
});

/**
 * Send chat message with design input
 * POST /api/v2/chat/message
 * Routes to appropriate framework agent via OrchestratorAgent
 */
app.post('/api/v2/chat/message', async (req: Request, res: Response) => {
  try {
    const { sessionId, input } = req.body;

    if (!sessionId || !input) {
      res.status(400).json({ error: 'sessionId and input are required' });
      return;
    }

    const session = SessionStorage.getSession(sessionId);
    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    // Get orchestrator instance
    const orchestrator = getOrchestrator();

    // Build generation request
    const generationRequest = {
      sessionId,
      designInput: {
        type: input.type || 'figma',
        data: input.data || '',
        requiresDataGrid: input.requiresDataGrid || false,
        needsRealtimeUpdates: input.needsRealtimeUpdates || false,
      },
      customInstructions: input.customInstructions || '',
      context: {
        userSelectedFramework: input.selectedFramework,
        projectId: input.projectId,
        userId: session.userId,
      },
    };

    // Orchestrate generation
    const generationResponse = await orchestrator.orchestrateGeneration(generationRequest);

    // Add assistant response to history
    SessionStorage.addMessage(
      sessionId,
      'assistant',
      JSON.stringify({
        requestId: generationResponse.requestId,
        status: generationResponse.status,
        framework: generationResponse.framework,
        componentsCount: generationResponse.components.length,
        estimatedCost: generationResponse.estimatedCost,
      })
    );

    res.json(generationResponse);
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Failed to process message', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

/**
 * Analyze design input
 * POST /api/v2/design/analyze
 */
app.post('/api/v2/design/analyze', async (req: Request, res: Response) => {
  try {
    const { designInput } = req.body;

    if (!designInput || !designInput.type) {
      res.status(400).json({ error: 'designInput with type is required' });
      return;
    }

    const designAgent = getDesignAgent();
    const analysis = await designAgent.analyzeDesign(designInput);

    res.json({
      status: 'success',
      analysis: {
        designInput: analysis.designInput,
        componentCount: analysis.estimatedComponentCount,
        complexity: analysis.complexity,
        designTokens: analysis.designTokens,
        accessibility: analysis.accessibility,
        recommendations: analysis.recommendations,
        frameworkRecommendation: designAgent['getFrameworkRecommendation'](analysis),
        components: analysis.extractedSpecs.map(spec => ({
          name: spec.componentName,
          type: spec.type,
          requirements: spec.requirements,
        })),
      },
    });
  } catch (error) {
    console.error('Error analyzing design:', error);
    res.status(500).json({
      error: 'Failed to analyze design',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Get framework recommendations
 * GET /api/v2/frameworks/recommend
 */
app.get('/api/v2/frameworks/recommend', (_req: Request, res: Response) => {
  res.json({
    recommendations: [
      {
        framework: 'react',
        score: 8.5,
        reasoning: 'Recommended for medium to large teams with interactive dashboards',
        pros: ['Largest ecosystem', 'Fast development', 'Medium learning curve'],
        cons: ['Many choice decisions', 'Bundle size considerations'],
        bestFor: ['product teams', 'startup velocity', 'complex state'],
      },
      {
        framework: 'angular',
        score: 7.0,
        reasoning: 'Recommended for enterprise applications with long-term maintenance requirements',
        pros: ['Google-backed', 'Complete framework', 'Excellent for large teams'],
        cons: ['Steep learning curve', 'Heavier bundle', 'More verbose'],
        bestFor: ['enterprise', 'long-term projects', 'large teams'],
      },
      {
        framework: 'vue',
        score: 7.5,
        reasoning: 'Recommended for small teams and rapid development',
        pros: ['Gentle learning curve', 'Small bundle', 'Excellent docs'],
        cons: ['Smaller ecosystem', 'Fewer job opportunities'],
        bestFor: ['solo developers', 'rapid prototyping', 'MVPs'],
      },
    ],
    primaryRecommendation: 'react',
    secondaryRecommendation: 'angular',
  });
});

/**
 * Approve generation request
 * POST /api/v2/approval/approve
 */
app.post('/api/v2/approval/approve', async (req: Request, res: Response) => {
  try {
    const { requestId } = req.body;

    if (!requestId) {
      res.status(400).json({ error: 'requestId is required' });
      return;
    }

    const orchestrator = getOrchestrator();
    const result = await orchestrator.approveRequest(requestId);

    res.json(result);
  } catch (error) {
    console.error('Error approving request:', error);
    res.status(500).json({ error: 'Failed to approve request' });
  }
});

/**
 * Reject generation request
 * POST /api/v2/approval/reject
 */
app.post('/api/v2/approval/reject', async (req: Request, res: Response) => {
  try {
    const { requestId, reason } = req.body;

    if (!requestId) {
      res.status(400).json({ error: 'requestId is required' });
      return;
    }

    const orchestrator = getOrchestrator();
    const result = await orchestrator.rejectRequest(requestId, reason);

    res.json(result);
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ error: 'Failed to reject request' });
  }
});

/**
 * Modify and resubmit generation request
 * POST /api/v2/approval/modify
 */
app.post('/api/v2/approval/modify', async (req: Request, res: Response) => {
  try {
    const { requestId, modifications } = req.body;

    if (!requestId || !modifications) {
      res.status(400).json({ error: 'requestId and modifications are required' });
      return;
    }

    const orchestrator = getOrchestrator();
    const result = await orchestrator.modifyRequest(requestId, modifications);

    res.json(result);
  } catch (error) {
    console.error('Error modifying request:', error);
    res.status(500).json({ error: 'Failed to modify request' });
  }
});

/**
 * Get approval status
 * GET /api/v2/approval/:requestId
 */
app.get('/api/v2/approval/:requestId', (req: Request, res: Response) => {
  try {
    const requestId = Array.isArray(req.params.requestId)
      ? req.params.requestId[0]
      : req.params.requestId;
    const orchestrator = getOrchestrator();

    const approval = orchestrator.getApprovalStatus(requestId);
    if (!approval) {
      res.status(404).json({ error: 'Approval request not found' });
      return;
    }

    res.json(approval);
  } catch (error) {
    console.error('Error getting approval status:', error);
    res.status(500).json({ error: 'Failed to get approval status' });
  }
});

/**
 * Get generation history
 * GET /api/v2/generation/:requestId
 */
app.get('/api/v2/generation/:requestId', (req: Request, res: Response) => {
  try {
    const requestId = Array.isArray(req.params.requestId)
      ? req.params.requestId[0]
      : req.params.requestId;
    const orchestrator = getOrchestrator();

    const generation = orchestrator.getGenerationHistory(requestId);
    if (!generation) {
      res.status(404).json({ error: 'Generation request not found' });
      return;
    }

    res.json(generation);
  } catch (error) {
    console.error('Error getting generation history:', error);
    res.status(500).json({ error: 'Failed to get generation history' });
  }
});

/**
 * List pending approvals for session
 * GET /api/v2/session/:sessionId/approvals
 */
app.get('/api/v2/session/:sessionId/approvals', (req: Request, res: Response) => {
  try {
    const sessionId = Array.isArray(req.params.sessionId)
      ? req.params.sessionId[0]
      : req.params.sessionId;
    const orchestrator = getOrchestrator();

    const approvals = orchestrator.listPendingApprovals(sessionId);

    res.json({
      sessionId,
      pendingCount: approvals.length,
      approvals,
    });
  } catch (error) {
    console.error('Error listing approvals:', error);
    res.status(500).json({ error: 'Failed to list approvals' });
  }
});

/**
 * Status endpoint for monitoring
 */
app.get('/status', (_req: Request, res: Response) => {
  const orchestrator = getOrchestrator();
  const orchestratorStatus = orchestrator.getStatus();

  res.json({
    status: 'operational',
    version: '1.0.0',
    phase: '1-mvp-react-focus',
    frameworks: orchestratorStatus.frameworks,
    orchestrator: {
      pendingApprovals: orchestratorStatus.pendingApprovals,
      generationHistory: orchestratorStatus.generationHistory,
    },
    timestamp: new Date().toISOString(),
  });
});

/**
 * Error handling middleware
 */
app.use((err: Error, _req: Request, res: Response) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

/**
 * 404 handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║  🚀 AI UI Builder - Multi-Framework Edition                 ║
║  ✅ Server running on http://localhost:${PORT}               ║
║  🔧 Phase: 1 (MVP - React Focus)                            ║
║  📦 Frameworks: React, Angular (stub), Vue (stub)           ║
╚══════════════════════════════════════════════════════════════╝
  `);
});

export default app;
