# AI UI BUILDER WITH MULTI-AGENT ORCHESTRATION (REFINED)
## Enhanced Multi-Framework Edition
**Version:** 2.0  
**Date:** June 16, 2026  
**Status:** Refined for Multi-Framework Implementation  
**Prepared for:** Engineering Teams

---

## TABLE OF CONTENTS
1. [Executive Summary](#executive-summary)
2. [Framework Architecture Decision Matrix](#framework-architecture-decision-matrix)
3. [Multi-Framework Agent Specialization](#multi-framework-agent-specialization)
4. [Framework Routing Engine](#framework-routing-engine)
5. [Chatbot Context Preservation (Framework-Aware)](#chatbot-context-preservation-framework-aware)
6. [Framework-Specific Code Generation](#framework-specific-code-generation)
7. [Framework Comparison Table](#framework-comparison-table)
8. [Guardrails & Validation (Framework-Specific)](#guardrails--validation-framework-specific)
9. [API Specifications (Enhanced Multi-Framework)](#api-specifications-enhanced-multi-framework)
10. [Folder Structures (Per Framework)](#folder-structures-per-framework)
11. [Detailed Implementation Roadmap](#detailed-implementation-roadmap)
12. [Framework Migration & Conversion](#framework-migration--conversion)

---

## EXECUTIVE SUMMARY (REFINED)

### Project Evolution
**Original Scope**: Support 3 frameworks (React, Angular, Vue) equally.  
**Refined Scope**: Framework-specialized agent system with intelligent routing, unified UX, and framework-aware guardrails.

### Key Refinements in v2.0
✅ **Framework-Specialized Agents**: Each framework gets dedicated agent (`ReactAgent`, `AngularAgent`, `VueAgent`) with idiom-specific logic  
✅ **Intelligent Routing Engine**: Orchestrator analyzes user request & routes to best framework or suggests framework choice  
✅ **Framework Context Preservation**: Chatbot remembers framework choice across sessions; carries design system compatibility rules  
✅ **Unified Code Quality**: Framework-specific validation (TypeScript strict, Angular linting, Vue composition API best practices)  
✅ **Framework Migration Support**: Convert existing projects between frameworks (React → Angular, etc.)  
✅ **Concrete Dependency Maps**: Every framework has explicit dependencies, versions, and build configuration  

### MVP Phase 1 (Weeks 1-8): React Focus
- React specialist agent fully operational
- Angular & Vue stubs (routing ready, prompts incomplete)
- Generic orchestrator handling both existing & new projects
- File-based storage format agnostic (works for all 3)

### Phase 2 (Weeks 9-16): Full Multi-Framework
- Complete Angular support
- Complete Vue 3 support
- Framework migration/conversion logic
- Cross-framework best practice sharing

---

## FRAMEWORK ARCHITECTURE DECISION MATRIX

| Decision Point | React | Angular | Vue 3 |
|---|---|---|---|
| **Agent Type** | `ReactAgent` (specialized) | `AngularAgent` (specialized) | `VueAgent` (specialized) |
| **Inherits From** | `FrameworkAgent` (base) | `FrameworkAgent` (base) | `FrameworkAgent` (base) |
| **Module System** | ES6 + Bundler | NgModule | Vite/ESM |
| **Component Pattern** | Function (Hooks) | Class + Decorators | Composition API |
| **State Management** | Context/Zustand/Redux | RxJS/NgRx | Pinia |
| **Build Tool** | Vite | Angular CLI | Vite |
| **Package Manager** | npm/yarn (any) | npm/yarn (any) | npm/yarn (any) |
| **Testing Framework** | Jest + RTL | Karma + Jasmine | Vitest + Vue Test Utils |
| **Design System Support** | Tailwind, Material, Shadcn | Material, Ant Design | Tailwind, Ant |
| **Grid Library** | AG Grid, TanStack | AG Grid, PrimeNG | AG Grid |
| **Styling** | CSS-in-JS or Tailwind | SCSS modules or Tailwind | Scoped CSS or Tailwind |
| **Documentation Tool** | Storybook | Storybook | Storybook |
| **Version Control Strategy** | Semantic versioning recommended | Semantic versioning required | Semantic versioning recommended |

---

## MULTI-FRAMEWORK AGENT SPECIALIZATION

### Base Agent Architecture (CUSTOM: Implement this)

```typescript
// Base class for all framework agents (CUSTOM: build this abstract class)
abstract class FrameworkAgent {
  protected framework: 'react' | 'angular' | 'vue';
  protected designSystem: string;
  protected gridLibrary: string;
  
  // Framework-specific implementations
  abstract generateComponent(spec: UISpec): Promise<GeneratedComponent>;
  abstract generateTest(component: GeneratedComponent): Promise<TestFile>;
  abstract generateTypes(spec: UISpec): Promise<TypeDefinition>;
  abstract validateCode(code: string): Promise<ValidationResult>;
  abstract getFrameworkMetadata(): FrameworkMetadata;
  
  // Shared implementations
  async generateDocumentation(component: GeneratedComponent): Promise<string> {
    // Common logic for all frameworks
  }
}
```

### React Agent (ReactAgent)

**Specialization**: Function components with Hooks, TypeScript strict mode, modern React patterns.

```typescript
class ReactAgent extends FrameworkAgent {
  framework = 'react';
  
  // React-specific dependencies
  defaultDependencies = {
    'react': '^18.2.0',
    'react-dom': '^18.2.0',
    '@types/react': '^18.2.0',
    '@types/react-dom': '^18.2.0',
    'typescript': '^5.3.0',
    'vite': '^5.0.0',
    'eslint': '^8.50.0',
    'eslint-plugin-react': '^7.33.0',
    'eslint-plugin-react-hooks': '^4.6.0'
  };
  
  // React-specific prompt for code generation
  getCodeGenerationPrompt(spec: UISpec): string {
    return `
Generate a React component with these requirements:
- Use functional component syntax (NOT class components)
- Use React Hooks (useState, useEffect, useCallback)
- TypeScript with STRICT mode enabled
- Full type coverage (no 'any' types)
- Prop interface with JSDoc comments
- Memoization where appropriate (React.memo, useMemo, useCallback)
- Event handlers properly typed (React.FC<Props> and handler typing)
- Accessibility attributes (aria-*, role)
- No external CSS files; use Tailwind classes or CSS-in-JS

Component Name: ${spec.componentName}
Props: ${JSON.stringify(spec.props)}
Requirements: ${spec.requirements}
Design System: ${this.designSystem}

Return:
1. Complete TypeScript component file with export
2. Prop types interface
3. Storybook story file
    `;
  }
  
  async generateComponent(spec: UISpec): Promise<GeneratedComponent> {
    // Call Claude 3.5 Sonnet with React-specific prompt
    const response = await claude.messages.create({
      model: "claude-3-5-sonnet-20241022",
      messages: [{
        role: "user",
        content: this.getCodeGenerationPrompt(spec)
      }]
    });
    
    // Parse React component from response
    return {
      filename: `${spec.componentName}.tsx`,
      content: response.content[0].type === 'text' ? response.content[0].text : '',
      framework: 'react',
      filetype: 'tsx'
    };
  }
  
  async generateTest(component: GeneratedComponent): Promise<TestFile> {
    // Jest + React Testing Library
    const testPrompt = `
Generate a Jest test file for this React component:
${component.content}

Requirements:
- Use React Testing Library (not Enzyme)
- Test user interactions, not implementation
- Cover accessibility (screen reader, keyboard nav)
- Test async operations with waitFor
- Mock external dependencies

Return complete jest test file (.test.tsx)
    `;
    
    const response = await claude.messages.create({
      model: "claude-3-5-sonnet-20241022",
      messages: [{ role: "user", content: testPrompt }]
    });
    
    return {
      filename: `${component.filename.replace('.tsx', '.test.tsx')}`,
      content: response.content[0].type === 'text' ? response.content[0].text : '',
      framework: 'react',
      testFramework: 'jest'
    };
  }
  
  async validateCode(code: string): Promise<ValidationResult> {
    // CUSTOM: Run tsc and eslint on React code
    return {
      typescript: await runTypeScript(code),
      eslint: await runESLint(code, 'react'),
      coverage: await runJest(code)
    };
  }
  
  getFrameworkMetadata(): FrameworkMetadata {
    return {
      framework: 'react',
      version: '18.2.0',
      packageManager: 'npm',
      buildTool: 'vite',
      testFramework: 'jest',
      componentPattern: 'functional',
      stateManagement: ['context', 'zustand', 'redux'],
      designSystems: ['tailwind', 'material-ui', 'shadcn'],
      estimatedBuildTime: 30000, // ms
      estimatedInstallTime: 45000 // ms
    };
  }
}
```

### Angular Agent (AngularAgent)

**Specialization**: Standalone components, TypeScript strict, RxJS reactive patterns, Angular best practices.

```typescript
class AngularAgent extends FrameworkAgent {
  framework = 'angular';
  
  defaultDependencies = {
    '@angular/core': '^17.0.0',
    '@angular/common': '^17.0.0',
    '@angular/platform-browser': '^17.0.0',
    '@angular/platform-browser-dynamic': '^17.0.0',
    '@angular/forms': '^17.0.0',
    'rxjs': '^7.8.0',
    'typescript': '^5.3.0',
    '@angular/cli': '^17.0.0',
  };
  
  getCodeGenerationPrompt(spec: UISpec): string {
    return `
Generate an Angular standalone component with:
- \`@Component\` decorator with standalone: true
- TypeScript strict mode
- OnInit lifecycle hook if needed
- Reactive forms (Reactive > Template-driven)
- RxJS Observable patterns (not Promises)
- Strong typing (no 'any')
- Change detection: OnPush
- HostListener for accessibility
- Angular Material or Tailwind styling

Component Selector: app-${this.camelToKebab(spec.componentName)}
Props/Inputs: ${JSON.stringify(spec.props)}
Requirements: ${spec.requirements}
Design System: ${this.designSystem}

Return:
1. Complete Angular component (.ts)
2. Component template (.html)
3. Component styles (.scss)
4. Unit test file (.spec.ts)
    `;
  }
  
  async generateComponent(spec: UISpec): Promise<GeneratedComponent> {
    const response = await claude.messages.create({
      model: "claude-3-5-sonnet-20241022",
      messages: [{
        role: "user",
        content: this.getCodeGenerationPrompt(spec)
      }]
    });
    
    // Parse Angular component (may be multi-file)
    return {
      filename: `${this.camelToKebab(spec.componentName)}.component.ts`,
      content: response.content[0].type === 'text' ? response.content[0].text : '',
      framework: 'angular',
      filetype: 'ts',
      relatedFiles: [
        `${this.camelToKebab(spec.componentName)}.component.html`,
        `${this.camelToKebab(spec.componentName)}.component.scss`
      ]
    };
  }
  
  async generateTest(component: GeneratedComponent): Promise<TestFile> {
    // Karma + Jasmine
    const testPrompt = `
Generate a Karma/Jasmine unit test for this Angular component:
${component.content}

Requirements:
- Use TestBed for component initialization
- Test standalone component setup
- Mock dependencies with jasmine.createSpy
- Test Input/Output properties
- Test Observable subscriptions
- Test change detection OnPush strategy

Return: .spec.ts file
    `;
    
    const response = await claude.messages.create({
      model: "claude-3-5-sonnet-20241022",
      messages: [{ role: "user", content: testPrompt }]
    });
    
    return {
      filename: `${component.filename.replace('.ts', '.spec.ts')}`,
      content: response.content[0].type === 'text' ? response.content[0].text : '',
      framework: 'angular',
      testFramework: 'karma'
    };
  }
  
  async validateCode(code: string): Promise<ValidationResult> {
    return {
      typescript: await runTypeScript(code, { strict: true }),
      eslint: await runESLint(code, 'angular'),
      angularLint: await runAngularLint(code)
    };
  }
  
  getFrameworkMetadata(): FrameworkMetadata {
    return {
      framework: 'angular',
      version: '17.0.0',
      packageManager: 'npm',
      buildTool: 'angular-cli',
      testFramework: 'karma',
      componentPattern: 'standalone',
      stateManagement: ['ngrx', 'services', 'rxjs'],
      designSystems: ['angular-material', 'tailwind'],
      estimatedBuildTime: 45000,
      estimatedInstallTime: 60000
    };
  }
  
  private camelToKebab(str: string): string {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase();
  }
}
```

### Vue 3 Agent (VueAgent)

**Specialization**: Composition API, TypeScript strict, modern Vue 3 patterns, reactive system.

```typescript
class VueAgent extends FrameworkAgent {
  framework = 'vue';
  
  defaultDependencies = {
    'vue': '^3.3.0',
    'typescript': '^5.3.0',
    'vite': '^5.0.0',
    '@vue/test-utils': '^2.4.0',
    'vitest': '^0.34.0',
    'pinia': '^2.1.0',
  };
  
  getCodeGenerationPrompt(spec: UISpec): string {
    return `
Generate a Vue 3 component using Composition API with:
- \`<script setup lang="ts">\` syntax (modern)
- TypeScript strict mode
- Reactive primitives (ref, computed, watch)
- defineProps with full typing
- defineEmits with proper typing
- Scoped CSS (SCSS preferred)
- Proper accessibility attributes
- No legacy v-bind syntax

Component Name: ${spec.componentName}
Props: ${JSON.stringify(spec.props)}
Emits: ${JSON.stringify(spec.events)}
Requirements: ${spec.requirements}
Design System: ${this.designSystem}

Return:
1. Complete Vue 3 SFC (.vue file)
2. Composition function if logic is complex
3. Unit test file (.spec.ts)
    `;
  }
  
  async generateComponent(spec: UISpec): Promise<GeneratedComponent> {
    const response = await claude.messages.create({
      model: "claude-3-5-sonnet-20241022",
      messages: [{
        role: "user",
        content: this.getCodeGenerationPrompt(spec)
      }]
    });
    
    return {
      filename: `${spec.componentName}.vue`,
      content: response.content[0].type === 'text' ? response.content[0].text : '',
      framework: 'vue',
      filetype: 'vue'
    };
  }
  
  async generateTest(component: GeneratedComponent): Promise<TestFile> {
    // Vitest + Vue Test Utils
    const testPrompt = `
Generate a Vitest unit test for this Vue 3 component:
${component.content}

Requirements:
- Use Vue Test Utils for mounting
- Test reactive properties (ref, computed)
- Test event emissions
- Test prop validation
- Test watchers if present
- Test async operations with flushPromises

Return: .spec.ts file using Vitest syntax
    `;
    
    const response = await claude.messages.create({
      model: "claude-3-5-sonnet-20241022",
      messages: [{ role: "user", content: testPrompt }]
    });
    
    return {
      filename: `${component.filename.replace('.vue', '.spec.ts')}`,
      content: response.content[0].type === 'text' ? response.content[0].text : '',
      framework: 'vue',
      testFramework: 'vitest'
    };
  }
  
  async validateCode(code: string): Promise<ValidationResult> {
    return {
      typescript: await runTypeScript(code),
      eslint: await runESLint(code, 'vue'),
      vueChecks: await runVueChecker(code)
    };
  }
  
  getFrameworkMetadata(): FrameworkMetadata {
    return {
      framework: 'vue',
      version: '3.3.0',
      packageManager: 'npm',
      buildTool: 'vite',
      testFramework: 'vitest',
      componentPattern: 'composition-api',
      stateManagement: ['pinia', 'composables'],
      designSystems: ['tailwind', 'ant-design-vue'],
      estimatedBuildTime: 25000,
      estimatedInstallTime: 40000
    };
  }
}
```

---

## FRAMEWORK ROUTING ENGINE

### Orchestrator Framework Routing Logic (CUSTOM: Implement this state machine)

```typescript
class OrchestratorAgent {
  private agents: Map<string, FrameworkAgent> = new Map([
    ['react', new ReactAgent()],
    ['angular', new AngularAgent()],
    ['vue', new VueAgent()]
  ]);
  
  /**
   * Intelligent framework selection based on:
   * 1. Explicit user choice (if provided)
   * 2. Project context (existing project framework)
   * 3. Design input analysis (suggest best fit)
   * 4. User historical preference
   */
  async selectFramework(context: RoutingContext): Promise<string> {
    // Priority 1: Explicit user choice
    if (context.userSelectedFramework) {
      return context.userSelectedFramework;
    }
    
    // Priority 2: Existing project
    if (context.projectId) {
      const existingFramework = await this.getProjectFramework(context.projectId);
      if (existingFramework) {
        return existingFramework; // Add to existing project
      }
    }
    
    // Priority 3: Design input analysis
    if (context.designInput) {
      const suggestedFramework = await this.analyzeDesignForBestFramework(context.designInput);
      return suggestedFramework;
    }
    
    // Priority 4: User preference from history
    if (context.userId) {
      const preferredFramework = await this.getUserPreferredFramework(context.userId);
      if (preferredFramework) {
        return preferredFramework;
      }
    }
    
    // Default to React (most popular)
    return 'react';
  }
  
  /**
   * Analyze design to recommend best framework
   * CUSTOM: Use Claude to score frameworks
   */
  async analyzeDesignForBestFramework(designInput: DesignInput): Promise<string> {
    const analysisPrompt = `
Analyze this design and recommend the best UI framework:

Design Type: ${designInput.type}
Design Complexity: simple|medium|complex
Data Grid Needed: ${designInput.requiresDataGrid ? 'yes' : 'no'}
Real-time Updates: ${designInput.needsRealtimeUpdates ? 'yes' : 'no'}

For each framework, score 0-10:
- React (best for: complex state, medium teams, fastest dev)
- Angular (best for: enterprise, long-term maintenance, large teams)
- Vue (best for: simple-medium complexity, solo/small teams, learn quickly)

Return: { react: score, angular: score, vue: score, recommendation: 'react'|'angular'|'vue', reason: string }
    `;
    
    const response = await claude.messages.create({
      model: "claude-3-5-sonnet-20241022",
      messages: [{ role: "user", content: analysisPrompt }]
    });
    
    // Parse recommendation
    const recommendation = JSON.parse(
      response.content[0].type === 'text' ? response.content[0].text : '{}'
    );
    return recommendation.recommendation || 'react';
  }
  
  /**
   * Route request to appropriate framework agent
   */
  async routeToAgent(request: GenerationRequest): Promise<FrameworkAgent> {
    const selectedFramework = await this.selectFramework(request.context);
    const agent = this.agents.get(selectedFramework);
    
    if (!agent) {
      throw new Error(`Framework agent not found: ${selectedFramework}`);
    }
    
    return agent;
  }
  
  /**
   * Handle framework migration (React → Angular, etc.)
   */
  async migrateProject(
    sourceFramework: string,
    targetFramework: string,
    projectPath: string
  ): Promise<MigrationResult> {
    const migrationPrompt = `
Migrate this ${sourceFramework} project to ${targetFramework}:

Current Project Files:
${await this.readProjectStructure(projectPath)}

Requirements:
- Preserve component logic and functionality
- Convert component patterns to ${targetFramework} idioms
- Update build configuration
- Re-generate tests for ${targetFramework}
- Update dependency list
- Update documentation

Return: Complete migration plan and converted files
    `;
    
    const response = await claude.messages.create({
      model: "claude-3-5-sonnet-20241022",
      messages: [{ role: "user", content: migrationPrompt }]
    });
    
    return {
      status: 'success',
      sourceFramework,
      targetFramework,
      convertedFiles: [],
      warnings: []
    };
  }
}
```

---

## CHATBOT CONTEXT PRESERVATION (FRAMEWORK-AWARE)

### Enhanced Session Context with Framework State

```typescript
interface SessionContext {
  // Session identifiers
  sessionId: string;
  userId: string;
  createdAt: ISO8601;
  
  // Framework persistence
  selectedFramework: 'react' | 'angular' | 'vue';
  frameworkLocked: boolean; // Lock framework after first component
  frameworkChangeHistory: Array<{
    from: string;
    to: string;
    timestamp: ISO8601;
    reason: string;
  }>;
  
  // Design system compatibility per framework
  designSystemCompatibility: {
    react: string[]; // ['tailwind', 'material-ui', 'shadcn']
    angular: string[]; // ['angular-material', 'tailwind']
    vue: string[]; // ['tailwind', 'ant-design-vue']
  };
  selectedDesignSystem: string;
  selectedGridLibrary: string;
  
  // Framework-specific preferences
  frameworkPreferences: {
    react?: {
      stateManagement: 'context' | 'zustand' | 'redux';
      formLibrary: 'react-hook-form' | 'formik';
      testingLibrary: 'testing-library' | 'vitest';
    };
    angular?: {
      stateManagement: 'ngrx' | 'services';
      formStrategy: 'reactive' | 'template-driven';
      componentStyle: 'standalone' | 'module-based';
    };
    vue?: {
      stateManagement: 'pinia' | 'composables';
      styleScoping: 'scoped' | 'modules';
      testFramework: 'vitest' | 'jest';
    };
  };
  
  // Conversation history
  conversationHistory: Message[];
  
  // Cost tracking per framework
  costTracking: {
    total: number;
    byFramework: {
      react: number;
      angular: number;
      vue: number;
    };
    byOperation: Array<{
      operation: string;
      framework: string;
      cost: number;
      timestamp: ISO8601;
    }>;
  };
}
```

### Chatbot UI Update - Framework Selection

```
┌─ Framework Selection (Ask Mode) ──────────────────┐
│                                                     │
│ What framework are you working with today?         │
│                                                     │
│ ◉ React 18 (Functional Components + Hooks)        │
│ ○ Angular 17 (Enterprise, Standalone Components)  │
│ ○ Vue 3 (Composition API, Lightweight)            │
│                                                     │
│ [Your previous choice: React] [Change]            │
│                                                     │
│ Recommended: Vue 3 (for this design type)          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Context Preservation Display (Updated)

```
┌─ Session Context ────────────────────────────────┐
│                                                  │
│ Framework: React 18 (Locked after 1st component)│
│ Design System: Tailwind CSS                      │
│ Grid Library: AG Grid (React-compatible)         │
│ State Management: Context API                    │
│                                                  │
│ Design System Compatibility:                     │
│ ✓ Tailwind (perfect match)                       │
│ • Material UI (good match)                       │
│ • Shadcn UI (good match for Tailwind)           │
│                                                  │
│ Framework-Specific Preferences:                  │
│ • Testing: React Testing Library                 │
│ • Forms: React Hook Form                         │
│ • Styling: Tailwind + CSS Modules               │
│                                                  │
│ Recent Generations (this session):              │
│ ✓ Button.tsx (1 min ago)                         │
│ ✓ DataTable.tsx (3 min ago)                      │
│ ✓ LoginForm.tsx (5 min ago)                      │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## FRAMEWORK-SPECIFIC CODE GENERATION

### Generation Workflow per Framework

```typescript
// Unified generation flow (same for all frameworks)
async generateFeature(request: FeatureRequest): Promise<GeneratedFeature> {
  // 1. Route to framework-specific agent
  const agent = await this.orthogonalRouter.routeToAgent(request);
  
  // 2. Generate component (framework-specific)
  const component = await agent.generateComponent(request.spec);
  
  // 3. Generate types (framework-specific)
  const types = await agent.generateTypes(request.spec);
  
  // 4. Generate tests (framework-specific)
  const tests = await agent.generateTest(component);
  
  // 5. Validate (framework-specific guardrails)
  const validation = await agent.validateCode(component.content);
  
  // 6. Generate docs (unified)
  const docs = await generateDocumentation(component, types);
  
  return {
    component,
    types,
    tests,
    docs,
    validation,
    framework: agent.framework
  };
}
```

### Output Differences by Framework

```
React Generated Output:
  ├── Button.tsx (functional component with hooks)
  ├── Button.test.tsx (Jest + Testing Library)
  ├── Button.stories.tsx (Storybook)
  └── types/Button.ts (exported types)

Angular Generated Output:
  ├── button.component.ts (standalone component)
  ├── button.component.html (template)
  ├── button.component.scss (scoped styles)
  ├── button.component.spec.ts (Karma/Jasmine)
  └── button.component.stories.ts (Storybook)

Vue Generated Output:
  ├── Button.vue (SFC with script setup)
  ├── Button.spec.ts (Vitest)
  ├── Button.stories.ts (Storybook)
  └── composables/useButton.ts (if logic is complex)
```

---

## FRAMEWORK COMPARISON TABLE

| Aspect | React | Angular | Vue 3 |
|--------|-------|---------|-------|
| **Learning Curve** | Medium | Steep | Shallow |
| **Team Size (Ideal)** | Medium-Large | Large Enterprise | Small-Medium |
| **Component Syntax** | JSX function | Class + decorators | SFC + script setup |
| **State Management** | Context/Redux/Zustand | RxJS/NgRx | Pinia/Composables |
| **Bundle Size** (gzip) | ~42KB | ~130KB | ~33KB |
| **Performance** | Fast | Fast | Very Fast |
| **Build Tool** | Vite, Webpack | Angular CLI | Vite |
| **Testing** | Jest + RTL | Karma + Jasmine | Vitest + VTU |
| **Data Grid Options** | AG Grid, TanStack | AG Grid, PrimeNG | AG Grid, Ant Design Vue |
| **Styling** | CSS-in-JS, Tailwind | Scoped SCSS, Tailwind | Scoped CSS, Tailwind |
| **Form Handling** | React Hook Form | Reactive Forms | VeeValidate, Valibot |
| **HTTP Client** | Any (axios, fetch) | HttpClient (RxJS) | Any (axios, fetch) |
| **Routing** | React Router v6+ | @angular/router | Vue Router 4 |
| **Documentation Quality** | Excellent | Excellent | Good |
| **Community Libraries** | Largest | Medium-Large | Growing |
| **Enterprise Support** | Community | Google | Community |
| **Estimated Dev Speed** | Fast | Slower (setup) | Fastest |
| **Long-term Maintainability** | Good | Excellent | Good |

---

## GUARDRAILS & VALIDATION (FRAMEWORK-SPECIFIC)

### Framework-Specific Validation Rules

```typescript
class ValidationEngine {
  async validateFrameworkCode(
    code: string,
    framework: 'react' | 'angular' | 'vue'
  ): Promise<ValidationReport> {
    switch (framework) {
      case 'react':
        return this.validateReactCode(code);
      case 'angular':
        return this.validateAngularCode(code);
      case 'vue':
        return this.validateVueCode(code);
    }
  }
  
  // React-specific validation
  async validateReactCode(code: string): Promise<ValidationReport> {
    return {
      typescript: await this.runTypeScript(code, {
        strict: true,
        jsx: 'react-jsx',
        noUnusedLocals: true,
        noUnusedParameters: true
      }),
      eslint: {
        base: await this.runESLint(code, ['eslint:recommended']),
        react: await this.runESLint(code, ['plugin:react/recommended', 'plugin:react-hooks/recommended']),
        typescript: await this.runESLint(code, ['plugin:@typescript-eslint/recommended'])
      },
      hooks: {
        rulesOfHooks: this.checkReactHooksRules(code),
        depArrays: this.validateDependencyArrays(code),
        staleClosures: this.detectStaleClosures(code)
      },
      performance: {
        unnecessaryRerenders: this.detectUnnecessaryRerenders(code),
        memoization: this.checkMemoization(code)
      },
      accessibility: await this.checkA11y(code, 'react'),
      tests: await this.runJest(code, {
        coverage: { statements: 80, branches: 80, functions: 80, lines: 80 }
      })
    };
  }
  
  // Angular-specific validation
  async validateAngularCode(code: string): Promise<ValidationReport> {
    return {
      typescript: await this.runTypeScript(code, {
        strict: true,
        noImplicitAny: true,
        strictNullChecks: true,
        strictFunctionTypes: true
      }),
      eslint: {
        base: await this.runESLint(code, ['eslint:recommended']),
        angular: await this.runESLint(code, ['plugin:@angular-eslint/recommended']),
        typescript: await this.runESLint(code, ['plugin:@typescript-eslint/recommended'])
      },
      angular: {
        decorators: this.validateDecorators(code),
        lifecycle: this.validateLifecycleMethods(code),
        modularStructure: this.validateModularStructure(code),
        rxjs: this.validateRxJSPatterns(code),
        changeDetection: this.validateChangeDetection(code)
      },
      accessibility: await this.checkA11y(code, 'angular'),
      tests: await this.runKarma(code, {
        coverage: { statements: 80, branches: 80, functions: 80, lines: 80 }
      })
    };
  }
  
  // Vue-specific validation
  async validateVueCode(code: string): Promise<ValidationReport> {
    return {
      typescript: await this.runTypeScript(code, {
        strict: true,
        jsx: false,
        noImplicitAny: true
      }),
      eslint: {
        base: await this.runESLint(code, ['eslint:recommended']),
        vue: await this.runESLint(code, ['plugin:vue/vue3-recommended']),
        typescript: await this.runESLint(code, ['plugin:@typescript-eslint/recommended'])
      },
      vue: {
        compositionAPI: this.validateCompositionAPI(code),
        reactivity: this.validateReactivityPatterns(code),
        lifecycle: this.validateLifecycleHooks(code),
        templates: this.validateTemplates(code),
        scopedStyles: this.validateScopedCSS(code)
      },
      accessibility: await this.checkA11y(code, 'vue'),
      tests: await this.runVitest(code, {
        coverage: { statements: 80, branches: 80, functions: 80, lines: 80 }
      })
    };
  }
  
  // Shared validation
  async checkA11y(code: string, framework: string): Promise<A11yReport> {
    return {
      ariaLabels: this.auditAriaLabels(code),
      keyboardNav: this.checkKeyboardNavigation(code),
      colorContrast: this.validateColorContrast(code),
      formLabels: this.validateFormLabeling(code),
      semanticHTML: this.auditSemanticHTML(code),
      screenReaderTesting: this.scoreScreenReaderCompatibility(code)
    };
  }
}
```

---

## API SPECIFICATIONS (ENHANCED MULTI-FRAMEWORK)

### 1. New Multi-Framework Endpoints

#### Initialize Chatbot Session (Enhanced)
```
POST /api/v2/chat/init
Request:
{
  "userId": "user_xyz",
  "mode": "ask|agent",
  "suggestedFramework": "react|angular|vue|null",
  "projectId": "proj_abc123|null",
  "conversationHistoryWindow": 10 // number of messages to load
}
Response:
{
  "sessionId": "sess_abc123",
  "mode": "ask",
  "selectedFramework": "react",
  "frameworkLocked": false,
  "context": {
    "framework": "react",
    "designSystem": "tailwind",
    "gridLibrary": "ag-grid",
    "stateManagement": "context|zustand",
    "compatibleFrameworks": ["react"],
    "frameworkPreferences": {...}
  },
  "suggestedFrameworks": [
    {
      "framework": "react",
      "score": 9.5,
      "reason": "Best for interactive dashboards"
    },
    {
      "framework": "vue",
      "score": 7.2,
      "reason": "Lightweight alternative"
    }
  ]
}
```

#### Send Chat Message (Framework-Aware)
```
POST /api/v2/chat/message
Request (Agent Mode - with framework selection):
{
  "sessionId": "sess_abc123",
  "input": {
    "type": "figma|image|pdf|excel|word",
    "data": "URL or base64",
    "projectId": "proj_abc123|null",
    "newOrExisting": "new|existing",
    "selectedFramework": "react|angular|vue|auto",
    "customInstructions": "Add dark mode, use TypeScript strict..."
  },
  "mode": "agent"
}
Response:
{
  "sessionId": "sess_abc123",
  "status": "processing|pending_approval|completed",
  "selectedFramework": "react",
  "components": [
    {
      "name": "Button",
      "framework": "react",
      "componentType": "tsx",
      "preview": "..."
    }
  ],
  "requiresApproval": true,
  "approvalData": {
    "componentCount": 6,
    "estimatedCost": 3.45,
    "frameworkCompatibility": [
      {
        "framework": "react",
        "compatible": true,
        "conversionCost": 0
      },
      {
        "framework": "angular",
        "compatible": false,
        "conversionCost": 5.0,
        "reason": "Requires state management refactoring"
      },
      {
        "framework": "vue",
        "compatible": false,
        "conversionCost": 4.0,
        "reason": "Different component pattern"
      }
    ]
  }
}
```

#### Get Framework Recommendations
```
GET /api/v2/frameworks/recommend
Query Parameters:
  designInputType: "form|table|dashboard|landing|admin"
  complexity: "simple|medium|complex"
  teamSize: "solo|small|medium|large|enterprise"
  maintenancePreference: "fast-dev|long-term-maintainability"

Response:
{
  "recommendations": [
    {
      "framework": "react",
      "score": 8.5,
      "reasoning": "Perfect for complex interactive dashboards",
      "pros": ["Largest ecosystem", "Fast development", "Medium learning curve"],
      "cons": ["Many choice decisions", "Bundle size considerations"],
      "bestFor": ["product teams", "startup velocity", "complex state"]
    },
    {
      "framework": "angular",
      "score": 7.0,
      "reasoning": "Good for enterprise with long maintenance window"
      // ...
    },
    {
      "framework": "vue",
      "score": 6.5,
      "reasoning": "Best for smallest bundle and fastest learning"
      // ...
    }
  ],
  "primaryRecommendation": "react",
  "secondaryRecommendation": "angular"
}
```

#### Convert Framework (Migration)
```
POST /api/v2/projects/{projectId}/convert
Request:
{
  "sourceFramework": "react",
  "targetFramework": "angular",
  "preserveLogic": true,
  "updateTests": true,
  "updateDocs": true,
  "estimateCostOnly": false
}
Response:
{
  "projectId": "proj_abc123",
  "sourceFramework": "react",
  "targetFramework": "angular",
  "status": "success|error",
  "conversionStats": {
    "componentsConverted": 12,
    "estimatedTime": 3600,
    "estimatedCost": 8.50,
    "warnings": ["State management changed from Context to NgRx"],
    "newDependencies": [
      "@ngrx/store",
      "@ngrx/effects",
      "rxjs"
    ],
    "removedDependencies": [
      "zustand"
    ]
  },
  "outputProjectId": "proj_def456"
}
```

---

## FOLDER STRUCTURES (PER FRAMEWORK)

### React Project (Vite + TypeScript)
```
dashboard-react/
├── src/
│  ├── components/
│  │  ├── common/
│  │  │  ├── Button.tsx (React.FC<ButtonProps>)
│  │  │  ├── Button.test.tsx (Testing Library)
│  │  │  ├── Button.styles.ts (Tailwind classes)
│  │  │  └── Button.stories.tsx (Storybook)
│  │  ├── features/
│  │  │  ├── Dashboard/
│  │  │  │  ├── Dashboard.tsx
│  │  │  │  ├── Dashboard.test.tsx
│  │  │  │  ├── Dashboard.styles.ts
│  │  │  │  └── hooks/
│  │  │  │     └── useDashboardData.ts
│  │  │  └── DataTable/
│  │  └── layout/
│  ├── hooks/
│  │  ├── useQuery.ts
│  │  └── useFetch.ts
│  ├── services/
│  │  ├── api.ts
│  │  └── auth.ts
│  ├── types/
│  │  ├── index.ts
│  │  └── api.ts
│  ├── styles/
│  │  └── tailwind.config.ts
│  ├── App.tsx
│  └── main.tsx (Vite entry)
├── docs/
│  ├── COMPONENTS.md (auto-gen)
│  ├── ARCHITECTURE.md (auto-gen)
│  ├── AGENT_TRACE.md (forensic logs)
│  └── html/
├── .vscode/
│  ├── settings.json (ESLint + Prettier)
│  ├── launch.json (Debug config)
│  └── extensions.json
├── .execution_logs/
├── vite.config.ts
├── tsconfig.json ({ "compilerOptions": { "strict": true, "jsx": "react-jsx" } })
├── jest.config.js
├── .eslintrc.json (react-recommended + react-hooks)
└── project.json ({ "framework": "react", "version": "18.2.0", ... })
```

### Angular Project (Angular CLI)
```
dashboard-angular/
├── src/app/
│  ├── shared/
│  │  ├── components/
│  │  │  ├── button/
│  │  │  │  ├── button.component.ts (standalone)
│  │  │  │  ├── button.component.html
│  │  │  │  ├── button.component.scss
│  │  │  │  ├── button.component.spec.ts (Karma)
│  │  │  │  └── button.stories.ts (Storybook)
│  │  ├── services/
│  │  │  └── api.service.ts (HttpClient)
│  │  ├── models/
│  │  │  └── index.ts (interfaces)
│  │  └── shared.module.ts (if applicable)
│  ├── modules/
│  │  ├── dashboard/
│  │  │  ├── dashboard.component.ts
│  │  │  ├── dashboard.component.html
│  │  │  ├── dashboard.component.scss
│  │  │  ├── dashboard.component.spec.ts
│  │  │  └── services/
│  │  ├── data-table/
│  │  └── ...
│  ├── guards/
│  │  └── auth.guard.ts
│  ├── app.routes.ts (standalone routing)
│  ├── app.config.ts
│  └── app.component.ts
├── docs/
│  ├── COMPONENTS.md
│  ├── API.md
│  ├── AGENT_TRACE.md
│  └── html/
├── .vscode/
│  └── (similar to React)
├── .execution_logs/
├── angular.json (build config)
├── tsconfig.json ({ "strict": true, "noImplicitAny": true, ... })
├── karma.conf.js
├── .eslintrc.json (@angular-eslint)
└── project.json ({ "framework": "angular", "version": "17.0.0", ... })
```

### Vue 3 Project (Vite + TypeScript)
```
dashboard-vue/
├── src/
│  ├── components/
│  │  ├── Button.vue (SFC with script setup)
│  │  ├── Button.spec.ts (Vitest)
│  │  ├── Button.stories.ts (Storybook)
│  │  ├── features/
│  │  │  ├── Dashboard.vue
│  │  │  ├── Dashboard.spec.ts
│  │  │  └── composables/
│  │  │     └── useDashboard.ts
│  │  └── layout/
│  ├── stores/
│  │  └── dashboard.ts (Pinia)
│  ├── composables/
│  │  ├── useQuery.ts
│  │  └── useFetch.ts
│  ├── types/
│  │  └── index.ts
│  ├── App.vue
│  └── main.ts (Vite entry)
├── docs/
│  ├── COMPONENTS.md
│  ├── ARCHITECTURE.md
│  ├── AGENT_TRACE.md
│  └── html/
├── .vscode/
│  └── (similar to React)
├── .execution_logs/
├── vite.config.ts (Vue plugin)
├── tsconfig.json ({ "strict": true, "moduleResolution": "bundler", ... })
├── vitest.config.ts
├── .eslintrc.json (vue/vue3-recommended)
└── project.json ({ "framework": "vue", "version": "3.3.0", ... })
```

---

## DETAILED IMPLEMENTATION ROADMAP

### Phase 1: MVP - Core Foundation (Weeks 1-8) - REFINED

#### Sprint 1-2: Project Infrastructure & Multi-Framework Setup
**Goal**: Base system that can route between frameworks
- [ ] Initialize Node.js + Express API with TypeScript
- [ ] Install & configure Claude SDK (`anthropic`)
- [ ] Install & configure OpenAI SDK (`openai`)
- [ ] Create abstract `FrameworkAgent` base class
- [ ] Create `FrameworkRouter` for intelligent routing (CUSTOM)
- [ ] Initialize framework-specific project templates
- [ ] Create `project.json` schema with framework field
- [ ] Set up environment variables (.env per framework)
- [ ] Create basic logging infrastructure
**Tech**: Node.js 18+, TypeScript, Express, anthropic SDK, openai SDK

#### Sprint 3-4: Orchestrator & Multi-Framework Routing
**Goal**: Requests route to correct framework agent; sessions preserve framework choice
- [ ] Build `OrchestratorAgent` state machine
- [ ] Implement framework selection logic (explicit → context → historical → analyze)
- [ ] Build `FrameworkRouter` (CUSTOM: dispatch logic)
- [ ] Implement persistent session storage with framework context
- [ ] Build conversation context manager (CUSTOM: file-based)
- [ ] Create approval workflow state machine (CUSTOM)
- [ ] Implement cost tracking per framework per session (CUSTOM)
- [ ] Build error recovery patterns (fallback between models)
**Deliverable**: Requests can be routed; framework choice persists

#### Sprint 5: Design Agent (Framework-Agnostic)
**Goal**: Parse design → extract UI specifications
- [ ] Build `DesignAgent` base prompt engineering
- [ ] Implement image upload/parsing (CUSTOM: pdfjs-dist, sharp, tesseract)
- [ ] Add Figma API integration (CUSTOM: figma-js)
- [ ] Design token extraction prompt (colors, spacing, typography)
- [ ] Component hierarchy detection prompt
- [ ] Generate UI specifications JSON (framework-agnostic)
**Claude SDK Usage**: Claude 3.5 Sonnet for design analysis (vision capability)

#### Sprint 6: Code Generation Agents (All 3 Frameworks)
**Goal**: Complete code generation for React, Angular, Vue (MVP level)
- [ ] **ReactAgent**:
  - [ ] Functional component generation (React.FC + Hooks)
  - [ ] TypeScript strict mode templates
  - [ ] Tailwind/Material UI styling injection
  - [ ] Jest test scaffolds
  - [ ] Storybook story generation
- [ ] **AngularAgent**:
  - [ ] Standalone component generation
  - [ ] Template + component + spec generation
  - [ ] Lazy loading recommendations
  - [ ] Karma/Jasmine test scaffolds
- [ ] **VueAgent**:
  - [ ] SFC (script setup) generation
  - [ ] Composition API patterns
  - [ ] TypeScript types for props/emits
  - [ ] Vitest scaffolds
**Deliverable**: All 3 frameworks can generate components

#### Sprint 7: Validation Agents (Framework-Specific)
**Goal**: Quality gates per framework
- [ ] Implement 4-layer guardrail system (CUSTOM)
- [ ] Add framework-specific ESLint configs
- [ ] TypeScript strict mode validation
- [ ] Groundedness verification (CUSTOM: Claude scoring)
- [ ] Security scanning (npm audit)
- [ ] Test execution (Jest, Karma, Vitest)
- [ ] Accessibility checks (A11y scoring)
**Deliverable**: Generated code meets quality standards

#### Sprint 8: End-to-End MVP
**Goal**: Full workflow working for one framework (React) + roadmap for others
- [ ] Implement forensic tracing (CUSTOM: AGENT_TRACE.md)
- [ ] Auto-generate component documentation
- [ ] Create project.json with framework metadata
- [ ] Build CHANGELOG.md generator
- [ ] Implement history tracking (file-based versioning)
- [ ] Deploy to staging
- [ ] E2E test: Figma → React project
**Deliverable**: React MVP complete; Angular/Vue ready for Phase 2

**MVP Output**:
- ✅ React fully supported (Weeks 1-8)
- ⚠️ Angular routing ready, prompts incomplete (ready for Phase 2)
- ⚠️ Vue routing ready, prompts incomplete (ready for Phase 2)
- ✅ Single framework choice persists across session
- ✅ File-based storage format works for all 3
- ✅ Forensic tracing for all agents
- Cost: ~$100K engineer-hours

---

### Phase 2: Advanced Features (Weeks 9-16) - REFINED FOR FRAMEWORKS

#### Sprint 9-10: Complete Angular Support
**Goal**: Full-featured Angular code generation
- [ ] Finish `AngularAgent` implementation
- [ ] Standalone component patterns (latest Angular 17)
- [ ] RxJS Observable generation
- [ ] NgRx state management (optional)
- [ ] Module-based vs standalone decision logic
- [ ] Angular Material integration
- [ ] Lazy loading recommendations
- [ ] Route guard generation
- [ ] Complete Karma/Jasmine tests
**Deliverable**: Angular projects fully generated

#### Sprint 11-12: Complete Vue 3 Support
**Goal**: Full-featured Vue 3 code generation
- [ ] Finish `VueAgent` implementation
- [ ] Composition API patterns (modern Vue 3)
- [ ] Pinia store generation
- [ ] TypeScript strict types for components
- [ ] Scoped styling with SCSS modules
- [ ] Lifecycle hooks generation
- [ ] Composable extraction for complex logic
- [ ] Complete Vitest tests
- [ ] Vue Router integration (if needed)
**Deliverable**: Vue 3 projects fully generated

#### Sprint 13: Multi-LLM Intelligent Routing
**Goal**: Automatic fallback between Claude + OpenAI with optimization
- [ ] Build `LLMRouter` (CUSTOM: not in Claude SDK)
- [ ] Route design analysis → Claude (complex reasoning)
- [ ] Route code generation → Claude primary, GPT-4o fallback
- [ ] Route validation → GPT-4o primary, Claude fallback
- [ ] Cost comparison per task
- [ ] Budget enforcement (session-level)
- [ ] Provider health checks (retry logic, CUSTOM)
**Deliverable**: Intelligent routing working across frameworks

#### Sprint 14-15: RAG System for Design Patterns
**Goal**: Contextual library retrieval per framework
- [ ] Set up vector database (Pinecone or Weaviate, CUSTOM)
- [ ] Build embeddings pipeline (use Claude embeddings API, CUSTOM)
- [ ] Index design pattern library (React, Angular, Vue specific)
- [ ] Implement conversational RAG (context-aware queries)
- [ ] Build feedback loop (learn from approvals)
- [ ] Create skill library (reusable patterns per framework)
**Deliverable**: Design patterns intelligently retrieved per framework

#### Sprint 16: Framework-Aware Approval Workflows
**Goal**: Granular approval gates with framework migration options
- [ ] Implement breaking change detection (CUSTOM)
- [ ] Add diff visualization (before/after components)
- [ ] Framework migration feasibility scoring
- [ ] Rollback mechanism (version restoration)
- [ ] Team collaboration (review comments, CUSTOM)
- [ ] Approval history audit trail
- [ ] Slack/Email notifications (CUSTOM: webhooks)
**Deliverable**: Advanced approval workflows working; can suggest framework migrations

**Phase 2 Output**:
- ✅ React, Angular, Vue all fully featured
- ✅ Multi-LLM routing optimizing cost/quality
- ✅ RAG system providing intelligent suggestions
- ✅ Advanced approval workflows with migration support
- Status: All 3 frameworks production-ready
- Cost: ~$150K engineer-hours

---

### Phase 3: Enterprise & Scale (Weeks 17-24) - FRAMEWORK-AWARE

#### Sprint 17-18: Existing Project Import (All Frameworks)
**Goal**: Upload existing projects → AI-enhanced
- [ ] Build project analyzer (parse multiple tsconfigs)
- [ ] Existing component detection (AST parsing for 3 frameworks, CUSTOM)
- [ ] Enhancement recommender (suggest improvements per framework)
- [ ] Incremental feature generation (add to existing)
- [ ] Design consistency checker (per framework standards)
- [ ] Auto-refactoring suggestions (framework idioms)
- [ ] Multi-framework project parser (detect React/Angular/Vue)
**Deliverable**: Can import and enhance existing projects

#### Sprint 19-20: Team Collaboration & Multi-Framework Projects
**Goal**: Multi-user projects with permission management
- [ ] User authentication (OAuth 2.0, CUSTOM)
- [ ] Role-based access control (CUSTOM)
- [ ] Multi-framework project sharing
- [ ] Framework-mixed workspaces (React + Angular modules)
- [ ] Activity feed per framework (CUSTOM)
- [ ] Framework-specific permissions (who can regenerate React vs Angular)
**Deliverable**: Teams can collaborate on multi-framework projects

#### Sprint 21-22: Analytics & Framework-Specific Reporting
**Goal**: Executive dashboards with framework insights
- [ ] Metrics aggregation (query execution logs, CUSTOM)
- [ ] Generation success rate per framework
- [ ] Cost dashboards (cost per framework, user, feature)
- [ ] Quality metrics per framework (test coverage, code complexity)
- [ ] Time saved calculation per framework
- [ ] Framework migration ROI calculations
- [ ] Framework adoption metrics (which framework teams choose)
**Deliverable**: comprehensive analytics with framework breakdowns

#### Sprint 23-24: Production Hardening & Multi-Framework Deployment
**Goal**: Cloud deployment with multi-framework orchestration
- [ ] Deploy to AWS (multi-framework support)
- [ ] CloudWatch monitoring (framework-specific metrics)
- [ ] Disaster recovery (backup/restore per framework)
- [ ] Performance optimization (caching per framework)
- [ ] Load testing framework-by-framework
- [ ] Security hardening (framework-specific vulnerabilities)
**Deliverable**: Production-ready system supporting all 3 frameworks at scale

**Phase 3 Output**:
- ✅ Multi-user system with team collaboration
- ✅ Project imports working for all frameworks
- ✅ Framework-specific analytics & reporting
- ✅ Production-ready cloud deployment
- Status: Enterprise-ready for multi-framework organizations
- Cost: ~$200K engineer-hours

---

## FRAMEWORK MIGRATION & CONVERSION

### Migration Strategy (React → Angular Example)

**Input**: Existing React project structure
```
react-dashboard/
├── src/
│  ├── components/Button.tsx (React.FC)
│  ├── hooks/useButton.ts (useState, useEffect)
│  ├── services/api.ts (fetch)
│  └── App.tsx (Context)
```

**Conversion Process (CUSTOM: Claude-driven)**:

```typescript
async migrateReactToAngular(reactProjectRoot: string): Promise<string> {
  // 1. Analyze existing React project structure
  const reactComponents = await analyzeReactProject(reactProjectRoot);
  
  // 2. Generate migration plan with Claude
  const migrationPlan = await claude.messages.create({
    model: "claude-3-5-sonnet-20241022",
    messages: [{
      role: "user",
      content: `
Analyze this React project and create a detailed migration plan to Angular:

Project Structure:
${JSON.stringify(reactComponents)}

For each React component, provide:
1. Equivalent Angular standalone component pattern
2. State management: React hooks → Angular Signals/RxJS
3. Effect handling: useEffect → Angular effects/OnInit
4. Props passing: React props → Angular @Input/@Output
5. Context API → Angular services + Dependency Injection

Return: Complete migration guide with converted components
      `
    }]
  });
  
  // 3. Generate Angular equivalents
  const angularProject = await convertComponentsToAngular(
    reactComponents,
    migrationPlan
  );
  
  // 4. Update dependencies
  const angularPackageJson = {
    ...reactComponents.packageJson,
    dependencies: {
      '@angular/core': '^17.0.0',
      '@angular/common': '^17.0.0',
      'rxjs': '^7.8.0',
      // Remove React deps
    }
  };
  
  // 5. Generate Angular configuration
  const angularJson = generateAngularConfig();
  const tsConfig = generateAngularTsConfig();
  
  // 6. Create Angular project structure
  return createAngularProjectStructure(angularProject);
}
```

**Output**: Angular project version

```
angular-dashboard/
├── src/app/
│  ├── shared/components/button/
│  │  ├── button.component.ts (standalone)
│  │  ├── button.component.html
│  │  └── button.component.spec.ts
│  ├── services/api.service.ts (HttpClient)
│  ├── models/types.ts (interfaces)
│  └── app.routes.ts
├── angular.json
└── tsconfig.json
```

### Framework Migration Cost Estimation

| Source | Target | Effort | Cost | Breaking Changes |
|--------|--------|--------|------|-------------------|
| React | Angular | High | $5-10K | 60-70% |
| React | Vue | Medium | $3-7K | 40-50% |
| Angular | React | High | $5-10K | 70-80% |
| Angular | Vue | Medium | $3-7K | 40-50% |
| Vue | React | Medium | $3-7K | 50-60% |
| Vue | Angular | Medium | $4-8K | 60-70% |

---

## SUCCESS CRITERIA & KPIS (FRAMEWORK-AWARE)

### Framework-Specific KPIs

| KPI | React | Angular | Vue |
|-----|-------|---------|-----|
| Generation Time | < 45s | < 60s | < 40s |
| Code Quality (ESLint) | 0 errors | 0 errors | 0 errors |
| TypeScript Coverage | > 95% | > 95% | > 95% |
| Test Coverage | > 90% | > 85% | > 85% |
| Success Rate | > 97% | > 94% | > 95% |
| Groundedness Score | > 0.92 | > 0.90 | > 0.91 |
| Bundle Size (gzip) | < 50KB | < 140KB | < 40KB |
| Build Time | < 30s | < 45s | < 25s |

### Business KPIs

| KPI | Target |
|-----|--------|
| Framework Distribution | React 50%, Angular 30%, Vue 20% |
| Multi-Framework Adoption | > 40% of users use 2+ frameworks |
| Migration Success Rate | > 85% |
| User Satisfaction (by framework) | React: 4.5/5, Angular: 4.3/5, Vue: 4.6/5 |
| Cost per Component (by framework) | React: $0.40, Angular: $0.55, Vue: $0.35 |
| Development Time Saved | 80% across all frameworks |

---

## FINAL REFINEMENT CHECKLIST

- ✅ Specialized agents per framework (React, Angular, Vue)
- ✅ Intelligent routing engine with framework selection
- ✅ Framework-aware context preservation in chatbot
- ✅ Framework-specific validation and guardrails
- ✅ Concrete comparison table (React vs Angular vs Vue)
- ✅ Framework migration paths and conversion logic
- ✅ Multi-framework API specifications
- ✅ Detailed folder structures per framework
- ✅ Implementation roadmap broken down by framework
- ✅ Framework-specific KPIs and success metrics
- ✅ Forensic tracing across all frameworks
- ✅ Cost estimation for framework migrations

---

**END OF REFINED HANDOFF DOCUMENT v2.0**

**Next Step**: Present this refined document to your engineering team for architecture review and implementation planning.
