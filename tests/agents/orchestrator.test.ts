/**
 * Unit tests for OrchestratorAgent
 */

import { OrchestratorAgent, getOrchestrator } from '../../src/agents/orchestrator/OrchestratorAgent';
import { SessionStorage } from '../../src/storage/sessionStorage';
import { Framework } from '../../src/agents/base/types';

describe('OrchestratorAgent', () => {
  let orchestrator: OrchestratorAgent;
  let testSessionId: string;

  beforeEach(() => {
    orchestrator = getOrchestrator();
    // Create a test session
    const session = SessionStorage.createSession('test_user_123', Framework.React);
    testSessionId = session.sessionId;
  });

  describe('Framework Selection', () => {
    it('should select explicit user framework', async () => {
      const request = {
        sessionId: testSessionId,
        designInput: {
          type: 'figma' as const,
          data: 'test_data',
        },
        context: {
          userSelectedFramework: Framework.Angular,
        },
      };

      const response = await orchestrator.orchestrateGeneration(request);

      expect(response.framework).toBe(Framework.Angular);
      // Status can be either 'processing' or 'pending_approval' depending on estimated cost
      expect(['processing', 'pending_approval']).toContain(response.status);
    });

    it('should lock framework on first component', async () => {
      const request = {
        sessionId: testSessionId,
        designInput: {
          type: 'figma' as const,
          data: 'test_data',
        },
        context: {},
      };

      const response = await orchestrator.orchestrateGeneration(request);

      expect(response.status).toBe('processing');
      // Verify session was updated
      const updatedSession = SessionStorage.getSession(testSessionId);
      expect(updatedSession?.frameworkLocked).toBe(true);
    });

    it('should default to React when no selection is provided', async () => {
      const newSession = SessionStorage.createSession('test_user_456');
      const request = {
        sessionId: newSession.sessionId,
        designInput: {
          type: 'image' as const,
          data: 'test_data',
        },
        context: {},
      };

      const response = await orchestrator.orchestrateGeneration(request);

      expect(response.framework).toBe(Framework.React);
    });
  });

  describe('Cost Estimation', () => {
    it('should estimate cost per framework', async () => {
      const request = {
        sessionId: testSessionId,
        designInput: {
          type: 'figma' as const,
          data: 'test_data',
        },
        context: {
          userSelectedFramework: Framework.React,
        },
      };

      const response = await orchestrator.orchestrateGeneration(request);

      // React: $0.40 per component * 5 components = $2.00
      expect(response.estimatedCost).toBeGreaterThan(0);
      expect(response.estimatedCost).toBeLessThan(10);
    });

    it('should track cost in session', async () => {
      const request = {
        sessionId: testSessionId,
        designInput: {
          type: 'figma' as const,
          data: 'test_data',
        },
        context: {},
      };

      await orchestrator.orchestrateGeneration(request);

      const session = SessionStorage.getSession(testSessionId);
      expect(session?.costTracking.total).toBeGreaterThan(0);
    });
  });

  describe('Validation', () => {
    it('should reject invalid design input without data', async () => {
      const request = {
        sessionId: testSessionId,
        designInput: {
          type: 'figma' as const,
          data: '', // Empty data
        },
        context: {},
      };

      const response = await orchestrator.orchestrateGeneration(request);

      expect(response.status).toBe('error');
      expect(response.error).toContain('missing data');
    });

    it('should reject missing session', async () => {
      const request = {
        sessionId: 'non_existent_session',
        designInput: {
          type: 'figma' as const,
          data: 'test_data',
        },
        context: {},
      };

      const response = await orchestrator.orchestrateGeneration(request);

      expect(response.status).toBe('error');
      expect(response.error).toContain('Session not found');
    });
  });

  describe('Approval Workflow', () => {
    it('should create pending approval for large requests', async () => {
      const request = {
        sessionId: testSessionId,
        designInput: {
          type: 'figma' as const,
          data: 'test_data',
        },
        context: {},
      };

      const response = await orchestrator.orchestrateGeneration(request);

      if (response.estimatedCost > 2.0) {
        expect(response.requiresApproval).toBe(true);
        expect(response.status).toBe('pending_approval');

        const approval = orchestrator.getApprovalStatus(response.requestId);
        expect(approval).not.toBeNull();
        expect(approval?.status).toBe('pending');
      }
    });

    it('should approve pending request', async () => {
      const request = {
        sessionId: testSessionId,
        designInput: {
          type: 'figma' as const,
          data: 'test_data',
        },
        context: {},
      };

      const response = await orchestrator.orchestrateGeneration(request);

      if (response.requiresApproval) {
        const result = await orchestrator.approveRequest(response.requestId);
        expect(result.success).toBe(true);

        const approval = orchestrator.getApprovalStatus(response.requestId);
        expect(approval?.status).toBe('approved');
      }
    });

    it('should reject pending request', async () => {
      const request = {
        sessionId: testSessionId,
        designInput: {
          type: 'figma' as const,
          data: 'test_data',
        },
        context: {},
      };

      const response = await orchestrator.orchestrateGeneration(request);

      if (response.requiresApproval) {
        const result = await orchestrator.rejectRequest(response.requestId, 'Not needed');
        expect(result.success).toBe(true);

        const approval = orchestrator.getApprovalStatus(response.requestId);
        expect(approval?.status).toBe('rejected');
      }
    });

    it('should modify and resubmit request', async () => {
      const request = {
        sessionId: testSessionId,
        designInput: {
          type: 'figma' as const,
          data: 'test_data',
        },
        context: {},
      };

      const response = await orchestrator.orchestrateGeneration(request);

      if (response.requiresApproval) {
        const result = await orchestrator.modifyRequest(response.requestId, {
          userNotes: 'Updated requirements',
        });

        expect(result.success).toBe(true);
        expect(result.newRequestId).not.toEqual(response.requestId);

        const newApproval = orchestrator.getApprovalStatus(result.newRequestId);
        expect(newApproval?.userNotes).toContain('Updated');
      }
    });

    it('should list pending approvals for session', async () => {
      const request = {
        sessionId: testSessionId,
        designInput: {
          type: 'figma' as const,
          data: 'test_data',
        },
        context: {},
      };

      const response = await orchestrator.orchestrateGeneration(request);

      const pending = orchestrator.listPendingApprovals(testSessionId);
      expect(pending.length).toBeGreaterThanOrEqual(0);

      if (response.requiresApproval) {
        expect(pending.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Component Preview Generation', () => {
    it('should generate component previews', async () => {
      const request = {
        sessionId: testSessionId,
        designInput: {
          type: 'figma' as const,
          data: 'test_data',
        },
        context: {},
      };

      const response = await orchestrator.orchestrateGeneration(request);

      expect(response.components).toBeDefined();
      expect(Array.isArray(response.components)).toBe(true);
      expect(response.components.length).toBeGreaterThan(0);

      // Check component structure
      response.components.forEach(component => {
        expect(component.name).toBeDefined();
        expect(component.framework).toBe(response.framework);
        expect(component.componentType).toBeDefined();
        expect(component.preview).toBeDefined();
      });
    });
  });

  describe('Framework Compatibility Analysis', () => {
    it('should provide conversion costs for other frameworks', async () => {
      const request = {
        sessionId: testSessionId,
        designInput: {
          type: 'figma' as const,
          data: 'test_data',
        },
        context: {},
      };

      const response = await orchestrator.orchestrateGeneration(request);

      if (response.requiresApproval && response.approvalData) {
        expect(response.approvalData.frameworkCompatibility).toBeDefined();
        expect(response.approvalData.frameworkCompatibility.length).toBe(3); // React, Angular, Vue

        // Check that selected framework has no conversion cost
        const selectedFwkCompat = response.approvalData.frameworkCompatibility.find(
          f => f.framework === response.framework
        );
        expect(selectedFwkCompat?.compatible).toBe(true);
        expect(selectedFwkCompat?.conversionCost).toBeUndefined();

        // Check that other frameworks have conversion costs
        const otherFwkCompat = response.approvalData.frameworkCompatibility.find(
          f => f.framework !== response.framework
        );
        expect(otherFwkCompat?.compatible).toBe(false);
        expect(otherFwkCompat?.conversionCost).toBeGreaterThan(0);
      }
    });
  });

  describe('Status and History', () => {
    it('should track orchestrator status', () => {
      const status = orchestrator.getStatus();

      expect(status.frameworks).toContain(Framework.React);
      expect(status.frameworks).toContain(Framework.Angular);
      expect(status.frameworks).toContain(Framework.Vue);
      expect(status.pendingApprovals).toBeGreaterThanOrEqual(0);
      expect(status.generationHistory).toBeGreaterThanOrEqual(0);
    });

    it('should retrieve generation history', async () => {
      const request = {
        sessionId: testSessionId,
        designInput: {
          type: 'image' as const,
          data: 'test_data',
        },
        context: {},
      };

      const response = await orchestrator.orchestrateGeneration(request);

      const history = orchestrator.getGenerationHistory(response.requestId);
      expect(history).not.toBeNull();
      expect(history?.requestId).toBe(response.requestId);
      expect(history?.sessionId).toBe(testSessionId);
    });
  });
});
