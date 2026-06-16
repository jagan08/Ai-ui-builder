/**
 * File-based session storage
 * Stores session context in JSON format for framework-agnostic persistence
 */

import * as fs from 'fs';
import * as path from 'path';
import { SessionContext, Framework, DesignSystemType, StateManagement, Message } from '../agents/base/types';
import crypto from 'crypto';

const SESSIONS_DIR = path.join(process.cwd(), '.claude', 'sessions');

export class SessionStorage {
  /**
   * Initialize storage directory
   */
  static initialize(): void {
    if (!fs.existsSync(SESSIONS_DIR)) {
      fs.mkdirSync(SESSIONS_DIR, { recursive: true });
    }
  }

  /**
   * Create a new session with default values
   */
  static createSession(userId: string, framework: Framework = Framework.React): SessionContext {
    const sessionId = `sess_${crypto.randomBytes(12).toString('hex')}`;

    const session: SessionContext = {
      sessionId,
      userId,
      createdAt: new Date().toISOString(),
      selectedFramework: framework,
      frameworkLocked: false,
      designSystem: DesignSystemType.Tailwind,
      gridLibrary: 'ag-grid',
      stateManagement:
        framework === Framework.React
          ? StateManagement.Context
          : framework === Framework.Angular
            ? StateManagement.NgRx
            : StateManagement.Pinia,
      conversationHistory: [],
      costTracking: {
        total: 0,
        byFramework: {
          [Framework.React]: 0,
          [Framework.Angular]: 0,
          [Framework.Vue]: 0,
        },
      },
    };

    this.saveSession(session);
    return session;
  }

  /**
   * Save session to disk
   */
  static saveSession(session: SessionContext): void {
    this.initialize();
    const filePath = path.join(SESSIONS_DIR, `${session.sessionId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(session, null, 2), 'utf-8');
  }

  /**
   * Load session from disk
   */
  static getSession(sessionId: string): SessionContext | null {
    const filePath = path.join(SESSIONS_DIR, `${sessionId}.json`);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data) as SessionContext;
    } catch (error) {
      console.error(`Failed to load session ${sessionId}:`, error);
      return null;
    }
  }

  /**
   * Update framework for session
   */
  static setFramework(sessionId: string, framework: Framework, lock: boolean = false): void {
    const session = this.getSession(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    session.selectedFramework = framework;
    session.frameworkLocked = lock;
    this.saveSession(session);
  }

  /**
   * Add message to conversation history
   */
  static addMessage(sessionId: string, role: 'user' | 'assistant', content: string): void {
    const session = this.getSession(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    const message: Message = {
      role,
      content,
      timestamp: new Date().toISOString(),
    };

    session.conversationHistory.push(message);
    this.saveSession(session);
  }

  /**
   * Update cost tracking
   */
  static updateCost(sessionId: string, framework: Framework, cost: number): void {
    const session = this.getSession(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    session.costTracking.total += cost;
    session.costTracking.byFramework[framework] += cost;
    this.saveSession(session);
  }

  /**
   * Delete session
   */
  static deleteSession(sessionId: string): void {
    const filePath = path.join(SESSIONS_DIR, `${sessionId}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  /**
   * List all sessions for user
   */
  static listUserSessions(userId: string): SessionContext[] {
    this.initialize();
    const files = fs.readdirSync(SESSIONS_DIR);

    return files
      .map(file => {
        try {
          const data = fs.readFileSync(path.join(SESSIONS_DIR, file), 'utf-8');
          return JSON.parse(data) as SessionContext;
        } catch {
          return null;
        }
      })
      .filter((session): session is SessionContext => session !== null && session.userId === userId);
  }
}
