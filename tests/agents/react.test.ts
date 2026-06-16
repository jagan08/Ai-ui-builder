/**
 * Unit tests for ReactAgent
 */

import { ReactAgent, getReactAgent } from '../../src/agents/react/ReactAgent';
import { Framework, DesignSystemType, StateManagement } from '../../src/agents/base/types';

describe('ReactAgent', () => {
  let reactAgent: ReactAgent;

  beforeEach(() => {
    reactAgent = getReactAgent();
  });

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      expect(reactAgent).toBeDefined();
      expect(reactAgent.framework).toBe(Framework.React);
    });

    it('should have React dependencies configured', () => {
      const meta = reactAgent.getFrameworkMetadata();
      expect(meta.framework).toBe(Framework.React);
      expect(meta.version).toBe('18.2.0');
    });

    it('should use singleton pattern', () => {
      const agent1 = getReactAgent();
      const agent2 = getReactAgent();
      expect(agent1).toBe(agent2);
    });
  });

  describe('Component Generation', () => {
    it('should generate button component', async () => {
      const spec = {
        componentName: 'Button',
        type: 'button' as const,
        props: { label: 'Click me' },
        requirements: 'A reusable button component',
      };

      const component = await reactAgent.generateComponent(spec);

      expect(component.filename).toBe('Button.tsx');
      expect(component.framework).toBe(Framework.React);
      expect(component.filetype).toBe('tsx');
      expect(component.content).toContain('React');
      expect(component.content).toContain('FC<ButtonProps>');
      expect(component.content).toContain('onClick');
    });

    it('should generate form component', async () => {
      const spec = {
        componentName: 'LoginForm',
        type: 'form' as const,
        props: { fields: [] },
        requirements: 'Login form with validation',
      };

      const component = await reactAgent.generateComponent(spec);

      expect(component.filename).toBe('LoginForm.tsx');
      expect(component.content).toContain('onSubmit');
      expect(component.content).toContain('formData');
      expect(component.content).toContain('useState');
    });

    it('should generate table component', async () => {
      const spec = {
        componentName: 'DataTable',
        type: 'table' as const,
        props: { data: [], columns: [] },
        requirements: 'Responsive data table',
      };

      const component = await reactAgent.generateComponent(spec);

      expect(component.filename).toBe('DataTable.tsx');
      expect(component.content).toContain('data');
      expect(component.content).toContain('columns');
    });

    it('should include related files', async () => {
      const spec = {
        componentName: 'Card',
        type: 'custom' as const,
        props: {},
        requirements: 'Card component',
      };

      const component = await reactAgent.generateComponent(spec);

      expect(component.relatedFiles).toContain('Card.test.tsx');
      expect(component.relatedFiles).toContain('Card.stories.tsx');
    });
  });

  describe('Component Code Quality', () => {
    it('should use React.memo for optimization', async () => {
      const spec = {
        componentName: 'OptimizedButton',
        type: 'button' as const,
        props: {},
        requirements: 'Optimized button',
      };

      const component = await reactAgent.generateComponent(spec);

      expect(component.content).toContain('React.memo');
    });

    it('should use useCallback for event handlers', async () => {
      const spec = {
        componentName: 'Button',
        type: 'button' as const,
        props: {},
        requirements: 'Button with memoized handler',
      };

      const component = await reactAgent.generateComponent(spec);

      expect(component.content).toContain('useCallback');
    });

    it('should include TypeScript interface', async () => {
      const spec = {
        componentName: 'MyComponent',
        type: 'custom' as const,
        props: {},
        requirements: 'Component with types',
      };

      const component = await reactAgent.generateComponent(spec);

      expect(component.content).toContain('interface MyComponentProps');
    });

    it('should include JSDoc comments', async () => {
      const spec = {
        componentName: 'Button',
        type: 'button' as const,
        props: {},
        requirements: 'Documented button',
      };

      const component = await reactAgent.generateComponent(spec);

      expect(component.content).toContain('/**');
      expect(component.content).toContain('@example');
    });

    it('should include accessibility attributes', async () => {
      const spec = {
        componentName: 'Button',
        type: 'button' as const,
        props: {},
        requirements: 'Accessible button',
      };

      const component = await reactAgent.generateComponent(spec);

      expect(component.content).toContain('aria-label');
      expect(component.content).toContain('type="button"');
    });
  });

  describe('Test Generation', () => {
    it('should generate Jest test file', async () => {
      const component = {
        filename: 'Button.tsx',
        content: 'const Button = () => <button>Test</button>;',
        framework: Framework.React,
        filetype: 'tsx' as const,
      };

      const testFile = await reactAgent.generateTest(component);

      expect(testFile.filename).toBe('Button.test.tsx');
      expect(testFile.testFramework).toBe('jest');
      expect(testFile.content).toContain('render');
      expect(testFile.content).toContain('describe');
      expect(testFile.content).toContain('should');
    });

    it('should include accessibility tests', async () => {
      const component = {
        filename: 'Button.tsx',
        content: 'const Button = () => <button>Test</button>;',
        framework: Framework.React,
        filetype: 'tsx' as const,
      };

      const testFile = await reactAgent.generateTest(component);

      expect(testFile.content).toContain('accessibility');
      expect(testFile.content).toContain('toBeInTheDocument');
    });

    it('should include keyboard navigation tests', async () => {
      const component = {
        filename: 'Button.tsx',
        content: 'const Button = () => <button>Test</button>;',
        framework: Framework.React,
        filetype: 'tsx' as const,
      };

      const testFile = await reactAgent.generateTest(component);

      expect(testFile.content).toContain('keyboard');
      expect(testFile.content).toContain('focus');
    });

    it('should include snapshot test', async () => {
      const component = {
        filename: 'Card.tsx',
        content: 'const Card = () => <div>Card</div>;',
        framework: Framework.React,
        filetype: 'tsx' as const,
      };

      const testFile = await reactAgent.generateTest(component);

      expect(testFile.content).toContain('toMatchSnapshot');
    });
  });

  describe('Type Generation', () => {
    it('should generate TypeScript type definitions', async () => {
      const spec = {
        componentName: 'Button',
        type: 'button' as const,
        props: {},
        requirements: 'Button types',
      };

      const types = await reactAgent.generateTypes(spec);

      expect(types.filename).toBe('Button.types.ts');
      expect(types.content).toContain('interface ButtonProps');
      expect(types.content).toContain('FC<ButtonProps>');
    });

    it('should export proper types', async () => {
      const spec = {
        componentName: 'Card',
        type: 'custom' as const,
        props: {},
        requirements: 'Card types',
      };

      const types = await reactAgent.generateTypes(spec);

      expect(types.exports).toContain('CardProps');
      expect(types.exports).toContain('CardType');
    });
  });

  describe('Code Validation', () => {
    it('should validate React component code', async () => {
      const code = `
        import React from 'react';
        const Button: FC = () => <button>Click</button>;
      `;

      const validation = await reactAgent.validateCode(code);

      expect(validation.overallPassed).toBeDefined();
      expect(validation.typescript).toBeDefined();
      expect(validation.framework).toBeDefined();
    });

    it('should check for Hook rules', async () => {
      const code = `
        const MyComponent = () => {
          useState();
        };
      `;

      const validation = await reactAgent.validateCode(code);

      expect(validation.framework).toBeDefined();
      expect(validation.framework!.errors).toBeDefined();
    });

    it('should validate accessibility', async () => {
      const code = `
        const Button = () => <button onClick={() => {}}>Click</button>;
      `;

      const validation = await reactAgent.validateCode(code);

      expect(validation.accessibility).toBeDefined();
      expect(validation.accessibility!.score).toBeGreaterThan(0);
    });

    it('should check TypeScript usage', async () => {
      const code = `
        const MyComponent: FC = () => <div>Hello</div>;
      `;

      const validation = await reactAgent.validateCode(code);

      expect(validation.typescript).toBeDefined();
    });
  });

  describe('Framework Metadata', () => {
    it('should provide React framework metadata', () => {
      const meta = reactAgent.getFrameworkMetadata();

      expect(meta.framework).toBe(Framework.React);
      expect(meta.version).toBe('18.2.0');
      expect(meta.buildTool).toBe('vite');
      expect(meta.testFramework).toBe('jest');
    });

    it('should list supported design systems', () => {
      const meta = reactAgent.getFrameworkMetadata();

      expect(meta.designSystems).toContain(DesignSystemType.Tailwind);
      expect(meta.designSystems).toContain(DesignSystemType.MaterialUI);
      expect(meta.designSystems).toContain(DesignSystemType.ShadCN);
    });

    it('should list supported state management options', () => {
      const meta = reactAgent.getFrameworkMetadata();

      expect(meta.stateManagement).toContain(StateManagement.Context);
      expect(meta.stateManagement).toContain(StateManagement.Zustand);
      expect(meta.stateManagement).toContain(StateManagement.Redux);
    });

    it('should estimate build times', () => {
      const meta = reactAgent.getFrameworkMetadata();

      expect(meta.estimatedBuildTime).toBeGreaterThan(0);
      expect(meta.estimatedInstallTime).toBeGreaterThan(0);
    });
  });

  describe('Different Design Systems', () => {
    it('should support Tailwind CSS', () => {
      const agent = getReactAgent(DesignSystemType.Tailwind);
      const meta = agent.getFrameworkMetadata();

      expect(meta.designSystems).toContain(DesignSystemType.Tailwind);
    });

    it('should support Material-UI', () => {
      const agent = getReactAgent(DesignSystemType.MaterialUI);
      const meta = agent.getFrameworkMetadata();

      expect(meta.designSystems).toContain(DesignSystemType.MaterialUI);
    });

    it('should support ShadCN', () => {
      const agent = getReactAgent(DesignSystemType.ShadCN);
      const meta = agent.getFrameworkMetadata();

      expect(meta.designSystems).toContain(DesignSystemType.ShadCN);
    });
  });

  describe('Component Types Coverage', () => {
    const componentTypes = ['button', 'form', 'table', 'card', 'modal', 'custom'];

    componentTypes.forEach(type => {
      it(`should generate ${type} component`, async () => {
        const spec = {
          componentName: type.charAt(0).toUpperCase() + type.slice(1),
          type: type as any,
          props: {},
          requirements: `${type} component`,
        };

        const component = await reactAgent.generateComponent(spec);

        expect(component).toBeDefined();
        expect(component.content).toContain('React');
        expect(component.framework).toBe(Framework.React);
      });
    });
  });
});
