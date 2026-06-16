/**
 * OrchestratorAgent - Main orchestration and routing logic
 * Handles framework selection, approval workflows, cost tracking, and error recovery
 */

import { Framework, RoutingContext, DesignInput, SessionContext } from '../base/types';
import { SessionStorage } from '../../storage/sessionStorage';
import { FrameworkRouter } from './frameworkRouter';
import crypto from 'crypto';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'modified' | 'completed' | 'error';

export interface ApprovalRequest {
  requestId: string;
  sessionId: string;
  framework: Framework;
  componentsCount: number;
  estimatedCost: number;
  generatedCode: string;
  status: ApprovalStatus;
  createdAt: string;
  updatedAt: string;
  userNotes?: string;
}

export interface GenerationRequest {
  sessionId: string;
  designInput: DesignInput;
  customInstructions?: string;
  context: RoutingContext;
}

export interface GenerationResponse {
  requestId: string;
  sessionId: string;
  status: 'processing' | 'pending_approval' | 'approved' | 'rejected' | 'completed' | 'error';
  framework: Framework;
  components: Array<{
    name: string;
    framework: Framework;
    componentType: string;
    preview: string;
  }>;
  estimatedCost: number;
  requiresApproval: boolean;
  approvalData?: {
    componentCount: number;
    estimatedCost: number;
    frameworkCompatibility: Array<{
      framework: Framework;
      compatible: boolean;
      conversionCost?: number;
      reason?: string;
    }>;
  };
  error?: string;
}

export class OrchestratorAgent {
  private pendingApprovals: Map<string, ApprovalRequest> = new Map();
  private generationHistory: Map<string, GenerationResponse> = new Map();

  /**
   * Main orchestration flow:
   * 1. Select framework (intelligent routing)
   * 2. Validate design input
   * 3. Generate components (framework-specific)
   * 4. Run validation
   * 5. Request approval
   */
  async orchestrateGeneration(request: GenerationRequest): Promise<GenerationResponse> {
    const requestId = `req_${crypto.randomBytes(8).toString('hex')}`;
    console.log(`[Orchestrator] Starting generation request: ${requestId}`);

    try {
      // Load session
      const session = SessionStorage.getSession(request.sessionId);
      if (!session) {
        return this.errorResponse(requestId, request.sessionId, 'Session not found', Framework.React);
      }

      // Step 1: Select framework (intelligent routing)
      const selectedFramework = await this.selectFrameworkForRequest(request, session);
      console.log(`[Orchestrator:${requestId}] Framework selected: ${selectedFramework}`);

      // Lock framework if first component
      if (!session.frameworkLocked && session.conversationHistory.length === 0) {
        SessionStorage.setFramework(request.sessionId, selectedFramework, true);
        console.log(`[Orchestrator:${requestId}] Framework locked after first component`);
      }

      // Step 2: Validate design input
      const validation = this.validateDesignInput(request.designInput);
      if (!validation.valid) {
        return this.errorResponse(requestId, request.sessionId, validation.error!, selectedFramework);
      }

      // Step 3: Estimate cost
      const estimatedCost = this.estimateCost(selectedFramework, validation.componentCount || 1);
      SessionStorage.updateCost(request.sessionId, selectedFramework, estimatedCost);

      // Step 4: Check approval threshold
      const requiresApproval = estimatedCost > 2.0 || (validation.componentCount || 1) > 5;

      // Step 5: Create approval request
      const approvalRequest: ApprovalRequest = {
        requestId,
        sessionId: request.sessionId,
        framework: selectedFramework,
        componentsCount: validation.componentCount || 1,
        estimatedCost,
        generatedCode: '', // Will be populated on generation
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userNotes: request.customInstructions,
      };

      this.pendingApprovals.set(requestId, approvalRequest);

      // Build response
      const response: GenerationResponse = {
        requestId,
        sessionId: request.sessionId,
        status: requiresApproval ? 'pending_approval' : 'processing',
        framework: selectedFramework,
        components: this.generateComponentPreviews(selectedFramework, validation.componentCount || 1),
        estimatedCost,
        requiresApproval,
        approvalData: requiresApproval
          ? {
              componentCount: validation.componentCount || 1,
              estimatedCost,
              frameworkCompatibility: await this.analyzeFrameworkCompatibility(
                selectedFramework,
                validation.componentCount || 1
              ),
            }
          : undefined,
      };

      this.generationHistory.set(requestId, response);
      console.log(`[Orchestrator:${requestId}] Generation orchestrated. Status: ${response.status}`);

      return response;
    } catch (error) {
      console.error(`[Orchestrator:${requestId}] Error in orchestration:`, error);
      return this.errorResponse(
        requestId,
        request.sessionId,
        error instanceof Error ? error.message : 'Unknown error',
        Framework.React
      );
    }
  }

  /**
   * Framework selection with intelligent routing
   */
  private async selectFrameworkForRequest(
    request: GenerationRequest,
    session: SessionContext
  ): Promise<Framework> {
    // Priority 1: Session has locked framework
    if (session.frameworkLocked) {
      console.log(
        `[FrameworkSelection:1] Using locked framework: ${session.selectedFramework}`
      );
      return session.selectedFramework;
    }

    // Priority 2: User explicitly selected framework in request
    if (request.context.userSelectedFramework) {
      console.log(
        `[FrameworkSelection:2] Using user-selected framework: ${request.context.userSelectedFramework}`
      );
      return request.context.userSelectedFramework;
    }

    // Priority 3-5: Use FrameworkRouter logic
    const framework = await FrameworkRouter.selectFramework(request.context);
    console.log(`[FrameworkSelection:3+] Router selected: ${framework}`);
    return framework;
  }

  /**
   * Validate design input
   */
  private validateDesignInput(input: DesignInput): {
    valid: boolean;
    error?: string;
    componentCount?: number;
  } {
    if (!input || !input.type) {
      return { valid: false, error: 'Invalid design input: missing type' };
    }

    if (!input.data || input.data.length === 0) {
      return { valid: false, error: 'Invalid design input: missing data' };
    }

    // Size validation (max 50MB for images/PDFs)
    const sizeLimit = 50 * 1024 * 1024;
    if (input.data.length > sizeLimit) {
      return { valid: false, error: `Design input too large (max 50MB, got ${input.data.length} bytes)` };
    }

    // Estimate component count based on type and complexity
    const componentCount = input.type === 'figma' ? 5 : 1;

    return { valid: true, componentCount };
  }

  /**
   * Estimate cost per framework
   */
  private estimateCost(framework: Framework, componentCount: number): number {
    const baseCost: Record<Framework, number> = {
      [Framework.React]: 0.40,
      [Framework.Angular]: 0.55,
      [Framework.Vue]: 0.35,
    };

    // Linear scaling with component count
    return baseCost[framework] * componentCount;
  }

  /**
   * Generate component previews
   */
  private generateComponentPreviews(
    framework: Framework,
    count: number
  ): GenerationResponse['components'] {
    const frameworkLabels: Record<Framework, string> = {
      [Framework.React]: 'tsx',
      [Framework.Angular]: 'ts',
      [Framework.Vue]: 'vue',
    };

    return Array.from({ length: count }, (_, i) => ({
      name: `Component${i + 1}`,
      framework,
      componentType: frameworkLabels[framework],
      preview: `// Generated component (${framework} - ${frameworkLabels[framework]})`,
    }));
  }

  /**
   * Analyze framework compatibility and conversion costs
   */
  private async analyzeFrameworkCompatibility(
    selectedFramework: Framework,
    _componentCount: number
  ): Promise<
    Array<{
      framework: Framework;
      compatible: boolean;
      conversionCost?: number;
      reason?: string;
    }>
  > {
    // Simple cost estimation for framework conversion
    const conversionCosts: Record<string, number> = {
      [`${Framework.React}-${Framework.Angular}`]: 5.0,
      [`${Framework.React}-${Framework.Vue}`]: 3.0,
      [`${Framework.Angular}-${Framework.React}`]: 5.0,
      [`${Framework.Angular}-${Framework.Vue}`]: 4.0,
      [`${Framework.Vue}-${Framework.React}`]: 3.5,
      [`${Framework.Vue}-${Framework.Angular}`]: 4.5,
    };

    return [
      {
        framework: Framework.React,
        compatible: selectedFramework === Framework.React,
        conversionCost:
          selectedFramework === Framework.React
            ? undefined
            : conversionCosts[`${selectedFramework}-${Framework.React}`],
        reason:
          selectedFramework === Framework.React
            ? undefined
            : 'Requires state management and pattern conversion',
      },
      {
        framework: Framework.Angular,
        compatible: selectedFramework === Framework.Angular,
        conversionCost:
          selectedFramework === Framework.Angular
            ? undefined
            : conversionCosts[`${selectedFramework}-${Framework.Angular}`],
        reason:
          selectedFramework === Framework.Angular
            ? undefined
            : 'Requires RxJS and decorator patterns',
      },
      {
        framework: Framework.Vue,
        compatible: selectedFramework === Framework.Vue,
        conversionCost:
          selectedFramework === Framework.Vue
            ? undefined
            : conversionCosts[`${selectedFramework}-${Framework.Vue}`],
        reason:
          selectedFramework === Framework.Vue
            ? undefined
            : 'Requires Composition API adaptation',
      },
    ];
  }

  /**
   * Approval workflow - User approves pending request
   */
  async approveRequest(requestId: string): Promise<{ success: boolean; message: string }> {
    const approval = this.pendingApprovals.get(requestId);
    if (!approval) {
      return { success: false, message: 'Approval request not found' };
    }

    approval.status = 'approved';
    approval.updatedAt = new Date().toISOString();
    this.pendingApprovals.set(requestId, approval);

    const generation = this.generationHistory.get(requestId);
    if (generation) {
      generation.status = 'approved';
    }

    console.log(`[Orchestrator] Request ${requestId} approved by user`);
    return { success: true, message: `Request ${requestId} approved. Generation will proceed.` };
  }

  /**
   * Approval workflow - User rejects pending request
   */
  async rejectRequest(requestId: string, reason?: string): Promise<{ success: boolean; message: string }> {
    const approval = this.pendingApprovals.get(requestId);
    if (!approval) {
      return { success: false, message: 'Approval request not found' };
    }

    approval.status = 'rejected';
    approval.updatedAt = new Date().toISOString();
    this.pendingApprovals.set(requestId, approval);

    const generation = this.generationHistory.get(requestId);
    if (generation) {
      generation.status = 'rejected';
    }

    console.log(`[Orchestrator] Request ${requestId} rejected. Reason: ${reason || 'Not provided'}`);
    return {
      success: true,
      message: `Request ${requestId} rejected. You can modify and resubmit.`,
    };
  }

  /**
   * Approval workflow - User modifies and resubmits
   */
  async modifyRequest(
    requestId: string,
    modifications: Partial<ApprovalRequest>
  ): Promise<{ success: boolean; newRequestId: string; message: string }> {
    const approval = this.pendingApprovals.get(requestId);
    if (!approval) {
      return { success: false, newRequestId: '', message: 'Original request not found' };
    }

    // Create new request with modifications
    const newRequestId = `req_${crypto.randomBytes(8).toString('hex')}`;
    const modifiedRequest: ApprovalRequest = {
      ...approval,
      ...modifications,
      requestId: newRequestId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.pendingApprovals.set(newRequestId, modifiedRequest);

    // Mark original as superseded
    approval.status = 'modified';
    this.pendingApprovals.set(requestId, approval);

    console.log(
      `[Orchestrator] Request ${requestId} modified → ${newRequestId}`
    );
    return {
      success: true,
      newRequestId,
      message: `Original request marked as modified. New request ID: ${newRequestId}`,
    };
  }

  /**
   * Get approval request status
   */
  getApprovalStatus(requestId: string): ApprovalRequest | null {
    return this.pendingApprovals.get(requestId) || null;
  }

  /**
   * Get generation history
   */
  getGenerationHistory(requestId: string): GenerationResponse | null {
    return this.generationHistory.get(requestId) || null;
  }

  /**
   * List pending approvals for session
   */
  listPendingApprovals(sessionId: string): ApprovalRequest[] {
    return Array.from(this.pendingApprovals.values())
      .filter(
        approval =>
          approval.sessionId === sessionId && approval.status === 'pending'
      );
  }

  /**
   * Error response builder
   */
  private errorResponse(
    requestId: string,
    sessionId: string,
    error: string,
    framework: Framework
  ): GenerationResponse {
    return {
      requestId,
      sessionId,
      status: 'error',
      framework,
      components: [],
      estimatedCost: 0,
      requiresApproval: false,
      error,
    };
  }

  /**
   * Health check
   */
  getStatus(): {
    pendingApprovals: number;
    generationHistory: number;
    frameworks: Framework[];
  } {
    return {
      pendingApprovals: this.pendingApprovals.size,
      generationHistory: this.generationHistory.size,
      frameworks: Object.values(Framework),
    };
  }
}

// Singleton instance
let orchestratorInstance: OrchestratorAgent | null = null;

export function getOrchestrator(): OrchestratorAgent {
  if (!orchestratorInstance) {
    orchestratorInstance = new OrchestratorAgent();
  }
  return orchestratorInstance;
}
