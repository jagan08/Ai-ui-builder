/**
 * AngularAgent - Generate Angular standalone components
 * STUB for Phase 2 - Complete implementation coming in Sprint 9-10
 */

import { FrameworkAgent } from '../base/FrameworkAgent';
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
} from '../base/types';

export class AngularAgent extends FrameworkAgent {
  framework = Framework.Angular;

  defaultDependencies = {
    '@angular/core': '^17.0.0',
    '@angular/common': '^17.0.0',
    '@angular/platform-browser': '^17.0.0',
    '@angular/platform-browser-dynamic': '^17.0.0',
    '@angular/forms': '^17.0.0',
    'rxjs': '^7.8.0',
    'typescript': '^5.3.0',
  };

  constructor(
    designSystem: DesignSystemType = DesignSystemType.MaterialUI,
    gridLibrary: string = 'ag-grid',
    stateManagement: StateManagement = StateManagement.NgRx
  ) {
    super(Framework.Angular, designSystem, gridLibrary, stateManagement);
  }

  async generateComponent(_spec: UISpec): Promise<GeneratedComponent> {
    throw new Error(
      'AngularAgent is not yet implemented. Coming in Sprint 9-10 (Phase 2).'
    );
  }

  async generateTest(_component: GeneratedComponent): Promise<TestFile> {
    throw new Error(
      'AngularAgent is not yet implemented. Coming in Sprint 9-10 (Phase 2).'
    );
  }

  async generateTypes(_spec: UISpec): Promise<TypeDefinition> {
    throw new Error(
      'AngularAgent is not yet implemented. Coming in Sprint 9-10 (Phase 2).'
    );
  }

  async validateCode(_code: string): Promise<ValidationResult> {
    throw new Error(
      'AngularAgent is not yet implemented. Coming in Sprint 9-10 (Phase 2).'
    );
  }

  getFrameworkMetadata(): FrameworkMetadata {
    return {
      framework: Framework.Angular,
      version: '17.0.0',
      packageManager: 'npm',
      buildTool: 'angular-cli',
      testFramework: 'karma',
      componentPattern: 'standalone',
      stateManagement: [StateManagement.NgRx],
      designSystems: [DesignSystemType.MaterialUI],
      estimatedBuildTime: 45000,
      estimatedInstallTime: 60000,
    };
  }
}

let angularAgentInstance: AngularAgent | null = null;

export function getAngularAgent(
  designSystem: DesignSystemType = DesignSystemType.MaterialUI,
  gridLibrary: string = 'ag-grid',
  stateManagement: StateManagement = StateManagement.NgRx
): AngularAgent {
  if (!angularAgentInstance) {
    angularAgentInstance = new AngularAgent(designSystem, gridLibrary, stateManagement);
  }
  return angularAgentInstance;
}
