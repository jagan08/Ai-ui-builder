/**
 * Abstract base class for framework-specific agents
 * Defines the contract that all framework agents (React, Angular, Vue) must implement
 */

import {
  Framework,
  UISpec,
  GeneratedComponent,
  TestFile,
  TypeDefinition,
  ValidationResult,
  FrameworkMetadata,
  DesignSystemType,
  StateManagement,
} from './types';

export abstract class FrameworkAgent {
  protected framework: Framework;
  protected designSystem: DesignSystemType;
  protected gridLibrary: string;
  protected stateManagement: StateManagement;

  constructor(
    framework: Framework,
    designSystem: DesignSystemType,
    gridLibrary: string,
    stateManagement: StateManagement
  ) {
    this.framework = framework;
    this.designSystem = designSystem;
    this.gridLibrary = gridLibrary;
    this.stateManagement = stateManagement;
  }

  /**
   * Generate UI component for the target framework
   * Must be implemented by framework-specific subclasses
   */
  abstract generateComponent(spec: UISpec): Promise<GeneratedComponent>;

  /**
   * Generate unit tests for the component
   * Framework-specific test framework (Jest, Karma, Vitest)
   */
  abstract generateTest(component: GeneratedComponent): Promise<TestFile>;

  /**
   * Generate TypeScript type definitions
   * Must export types that match component interface
   */
  abstract generateTypes(spec: UISpec): Promise<TypeDefinition>;

  /**
   * Validate generated code using framework-specific rules
   * Runs TypeScript, ESLint, testing framework, accessibility checks
   */
  abstract validateCode(code: string): Promise<ValidationResult>;

  /**
   * Return framework metadata (versions, build tools, configs)
   */
  abstract getFrameworkMetadata(): FrameworkMetadata;

  /**
   * Generate documentation for the component
   * Shared across all frameworks, can be overridden
   */
  async generateDocumentation(component: GeneratedComponent): Promise<string> {
    const doc = `# ${component.filename}

## Component

\`\`\`${component.filetype}
${component.content}
\`\`\`

## Framework
- **Target**: ${this.framework}
- **Design System**: ${this.designSystem}
- **State Management**: ${this.stateManagement}

## Files Generated
- ${component.filename}
${component.relatedFiles ? component.relatedFiles.map(f => `- ${f}`).join('\n') : ''}

---

Generated with AI UI Builder - Multi-Framework Edition
`;
    return doc;
  }

  /**
   * Get the framework type
   */
  getFramework(): Framework {
    return this.framework;
  }

  /**
   * Get design system
   */
  getDesignSystem(): DesignSystemType {
    return this.designSystem;
  }

  /**
   * Set design system
   */
  setDesignSystem(designSystem: DesignSystemType): void {
    this.designSystem = designSystem;
  }
}
