/**
 * Core type definitions for framework agents and UI generation
 */

export enum Framework {
  React = 'react',
  Angular = 'angular',
  Vue = 'vue',
}

export enum DesignSystemType {
  Tailwind = 'tailwind',
  MaterialUI = 'material-ui',
  ShadCN = 'shadcn',
  AngularMaterial = 'angular-material',
  AntDesign = 'ant-design',
  AntDesignVue = 'ant-design-vue',
}

export enum StateManagement {
  // React
  Context = 'context',
  Zustand = 'zustand',
  Redux = 'redux',

  // Angular
  NgRx = 'ngrx',
  RxJS = 'rxjs',

  // Vue
  Pinia = 'pinia',
  Composables = 'composables',
}

export interface UISpec {
  componentName: string;
  type: 'button' | 'form' | 'table' | 'card' | 'modal' | 'custom';
  props: Record<string, unknown>;
  events?: Record<string, unknown>;
  requirements: string;
  designTokens?: DesignTokens;
  componentHierarchy?: UISpec[];
}

export interface DesignTokens {
  colors?: Record<string, string>;
  spacing?: Record<string, string>;
  typography?: Typography;
  borderRadius?: Record<string, string>;
  shadows?: Record<string, string>;
}

export interface Typography {
  fontFamily?: string;
  fontSize?: Record<string, string>;
  fontWeight?: Record<string, number>;
  lineHeight?: Record<string, number>;
}

export interface GeneratedComponent {
  filename: string;
  content: string;
  framework: Framework;
  filetype: 'tsx' | 'ts' | 'html' | 'scss' | 'vue' | 'js';
  relatedFiles?: string[];
}

export interface TestFile {
  filename: string;
  content: string;
  framework: Framework;
  testFramework: 'jest' | 'karma' | 'vitest';
}

export interface TypeDefinition {
  filename: string;
  content: string;
  exports: string[];
}

export interface ValidationResult {
  typescript?: {
    errors: string[];
    warnings: string[];
    passed: boolean;
  };
  eslint?: {
    errors: string[];
    warnings: string[];
    passed: boolean;
  };
  framework?: {
    errors: string[];
    warnings: string[];
    passed: boolean;
  };
  tests?: {
    passed: boolean;
    coverage: number;
    results: string;
  };
  accessibility?: {
    score: number;
    issues: string[];
    passed: boolean;
  };
  overallPassed: boolean;
}

export interface FrameworkMetadata {
  framework: Framework;
  version: string;
  packageManager: 'npm' | 'yarn' | 'pnpm';
  buildTool: string;
  testFramework: string;
  componentPattern: string;
  stateManagement: StateManagement[];
  designSystems: DesignSystemType[];
  estimatedBuildTime: number;
  estimatedInstallTime: number;
}

export interface GeneratedFeature {
  component: GeneratedComponent;
  types?: TypeDefinition;
  tests: TestFile;
  docs: string;
  validation: ValidationResult;
  framework: Framework;
}

export interface SessionContext {
  sessionId: string;
  userId: string;
  createdAt: string;
  selectedFramework: Framework;
  frameworkLocked: boolean;
  designSystem: DesignSystemType;
  gridLibrary: string;
  stateManagement: StateManagement;
  conversationHistory: Message[];
  costTracking: {
    total: number;
    byFramework: Record<Framework, number>;
  };
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface RoutingContext {
  userSelectedFramework?: Framework;
  projectId?: string;
  designInput?: DesignInput;
  userId?: string;
}

export interface DesignInput {
  type: 'figma' | 'image' | 'pdf' | 'excel' | 'word';
  data: string;
  requiresDataGrid?: boolean;
  needsRealtimeUpdates?: boolean;
}
