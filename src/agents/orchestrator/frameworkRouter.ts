/**
 * Framework routing engine
 * Selects the best framework based on intelligent routing logic
 */

import { Framework, RoutingContext } from '../base/types';
import { SessionStorage } from '../../storage/sessionStorage';

export class FrameworkRouter {
  /**
   * Intelligent framework selection with 4-priority logic:
   * 1. Explicit user choice (if provided)
   * 2. Project context (add to existing project framework)
   * 3. Design input analysis (Claude scores each framework's fit)
   * 4. User historical preference (remembers what they used before)
   * 5. Default to React (most popular)
   */
  static async selectFramework(context: RoutingContext): Promise<Framework> {
    // Priority 1: Explicit user choice
    if (context.userSelectedFramework) {
      console.log(`[Router] Priority 1: Using explicit user choice: ${context.userSelectedFramework}`);
      return context.userSelectedFramework;
    }

    // Priority 2: Existing project framework
    if (context.projectId) {
      const projectFramework = this.getProjectFramework(context.projectId);
      if (projectFramework) {
        console.log(`[Router] Priority 2: Using existing project framework: ${projectFramework}`);
        return projectFramework;
      }
    }

    // Priority 3: Design input analysis
    if (context.designInput) {
      const suggestedFramework = await this.analyzeDesignForBestFramework(context.designInput);
      console.log(`[Router] Priority 3: Using design analysis result: ${suggestedFramework}`);
      return suggestedFramework;
    }

    // Priority 4: User historical preference
    if (context.userId) {
      const preferredFramework = this.getUserPreferredFramework(context.userId);
      if (preferredFramework) {
        console.log(`[Router] Priority 4: Using user preference: ${preferredFramework}`);
        return preferredFramework;
      }
    }

    // Default to React (most popular)
    console.log('[Router] Priority 5: Defaulting to React');
    return Framework.React;
  }

  /**
   * Get framework from existing project
   * In Phase 2, will parse project structure to detect framework
   */
  private static getProjectFramework(projectId: string): Framework | null {
    // TODO: Implement project analyzer in Phase 3
    // For now, return null to fall through to next priority
    console.log(`[Router] Checking project ${projectId} for existing framework...`);
    return null;
  }

  /**
   * Analyze design to recommend best framework
   * Uses DesignAgent to extract specs, then Claude scores each framework
   */
  private static async analyzeDesignForBestFramework(designInput: any): Promise<Framework> {
    // In Sprint 5: Use DesignAgent to analyze design
    // For now: Implement heuristic analysis

    const score: Record<Framework, number> = {
      [Framework.React]: 7,
      [Framework.Angular]: 5,
      [Framework.Vue]: 6,
    };

    // Heuristic boosts based on design characteristics
    if (designInput.type === 'table' || designInput.type === 'grid') {
      score[Framework.React] += 2;
      score[Framework.Angular] += 2;
    }

    if (designInput.type === 'dashboard') {
      score[Framework.React] += 2;
    }

    if (designInput.requiresDataGrid) {
      score[Framework.React] += 1;
      score[Framework.Angular] += 1;
    }

    if (designInput.needsRealtimeUpdates) {
      score[Framework.Angular] += 2;
      score[Framework.React] += 1;
    }

    // Find best score
    let bestFramework = Framework.React;
    let bestScore = score[Framework.React];

    for (const framework of Object.values(Framework)) {
      if (score[framework] > bestScore) {
        bestScore = score[framework];
        bestFramework = framework;
      }
    }

    console.log(`[Router] Design analysis scores:`, score);
    console.log(`[Router] Best match: ${bestFramework} (score: ${bestScore})`);

    return bestFramework;
  }

  /**
   * Get user's most frequently used framework
   * Looks at session history to determine preference
   */
  private static getUserPreferredFramework(userId: string): Framework | null {
    const sessions = SessionStorage.listUserSessions(userId);

    if (sessions.length === 0) {
      return null;
    }

    const frameworkCounts: Record<Framework, number> = {
      [Framework.React]: 0,
      [Framework.Angular]: 0,
      [Framework.Vue]: 0,
    };

    for (const session of sessions) {
      frameworkCounts[session.selectedFramework]++;
    }

    // Find most used framework
    let mostUsed = Framework.React;
    let maxCount = frameworkCounts[Framework.React];

    for (const framework of Object.values(Framework)) {
      if (frameworkCounts[framework] > maxCount) {
        maxCount = frameworkCounts[framework];
        mostUsed = framework;
      }
    }

    if (maxCount > 0) {
      console.log(`[Router] User historical preference:`, frameworkCounts, `→ ${mostUsed}`);
      return mostUsed;
    }

    return null;
  }

  /**
   * Validate framework choice
   */
  static isValidFramework(framework: Framework): boolean {
    return Object.values(Framework).includes(framework);
  }

  /**
   * Get all available frameworks
   */
  static getAvailableFrameworks(): Framework[] {
    return Object.values(Framework);
  }
}
