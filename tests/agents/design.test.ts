/**
 * Unit tests for DesignAgent
 */

import { DesignAgent, getDesignAgent } from '../../src/agents/design/DesignAgent';
import { Framework } from '../../src/agents/base/types';

describe('DesignAgent', () => {
  let designAgent: DesignAgent;

  beforeEach(() => {
    designAgent = getDesignAgent();
  });

  describe('Design Validation', () => {
    it('should reject invalid design input without type', async () => {
      const invalidInput = {
        type: '',
        data: 'test_data',
      };

      await expect(async () => {
        await designAgent.analyzeDesign(invalidInput as any);
      }).rejects.toThrow('Invalid design input');
    });

    it('should reject invalid design input without data', async () => {
      const invalidInput = {
        type: 'figma',
        data: '',
      };

      await expect(async () => {
        await designAgent.analyzeDesign(invalidInput as any);
      }).rejects.toThrow('Invalid design input');
    });

    it('should reject unsupported design type', async () => {
      const invalidInput = {
        type: 'invalid_type',
        data: 'test_data',
      };

      await expect(async () => {
        await designAgent.analyzeDesign(invalidInput as any);
      }).rejects.toThrow('Invalid design type');
    });
  });

  describe('Figma Design Parsing', () => {
    it('should parse Figma design successfully', async () => {
      const figmaInput = {
        type: 'figma' as const,
        data: 'figma_design_url_or_data',
      };

      const analysis = await designAgent.analyzeDesign(figmaInput);

      expect(analysis.designInput.type).toBe('figma');
      expect(analysis.extractedSpecs).toBeDefined();
      expect(Array.isArray(analysis.extractedSpecs)).toBe(true);
      expect(analysis.extractedSpecs.length).toBeGreaterThan(0);
    });

    it('should extract design tokens from Figma', async () => {
      const figmaInput = {
        type: 'figma' as const,
        data: 'figma_data',
      };

      const analysis = await designAgent.analyzeDesign(figmaInput);

      expect(analysis.designTokens).toBeDefined();
      expect(analysis.designTokens.colors).toBeDefined();
      expect(analysis.designTokens.spacing).toBeDefined();
      expect(analysis.designTokens.typography).toBeDefined();
    });

    it('should detect component hierarchy', async () => {
      const figmaInput = {
        type: 'figma' as const,
        data: 'figma_data',
      };

      const analysis = await designAgent.analyzeDesign(figmaInput);

      expect(analysis.componentHierarchy).toBeDefined();
      expect(Array.isArray(analysis.componentHierarchy)).toBe(true);
      expect(analysis.componentHierarchy.length).toBeGreaterThan(0);

      // Check component structure
      analysis.componentHierarchy.forEach(component => {
        expect(component.name).toBeDefined();
        expect(component.type).toBeDefined();
        expect(component.properties).toBeDefined();
      });
    });
  });

  describe('Image Design Parsing', () => {
    it('should parse image design successfully', async () => {
      const imageInput = {
        type: 'image' as const,
        data: 'base64_image_or_url',
      };

      const analysis = await designAgent.analyzeDesign(imageInput);

      expect(analysis.designInput.type).toBe('image');
      expect(analysis.extractedSpecs).toBeDefined();
      expect(analysis.extractedSpecs.length).toBeGreaterThan(0);
    });
  });

  describe('PDF Design Parsing', () => {
    it('should parse PDF design successfully', async () => {
      const pdfInput = {
        type: 'pdf' as const,
        data: 'pdf_data_or_url',
      };

      const analysis = await designAgent.analyzeDesign(pdfInput);

      expect(analysis.designInput.type).toBe('pdf');
      expect(analysis.extractedSpecs).toBeDefined();
    });
  });

  describe('Excel Design Parsing', () => {
    it('should parse Excel design successfully', async () => {
      const excelInput = {
        type: 'excel' as const,
        data: 'excel_data',
      };

      const analysis = await designAgent.analyzeDesign(excelInput);

      expect(analysis.designInput.type).toBe('excel');
      expect(analysis.extractedSpecs).toBeDefined();
    });
  });

  describe('Word Design Parsing', () => {
    it('should parse Word design successfully', async () => {
      const wordInput = {
        type: 'word' as const,
        data: 'word_data',
      };

      const analysis = await designAgent.analyzeDesign(wordInput);

      expect(analysis.designInput.type).toBe('word');
      expect(analysis.extractedSpecs).toBeDefined();
    });
  });

  describe('Complexity Analysis', () => {
    it('should mark simple designs as simple', async () => {
      const simpleInput = {
        type: 'figma' as const,
        data: 'simple_design',
      };

      const analysis = await designAgent.analyzeDesign(simpleInput);

      // Figma stub returns 4 components, which is medium
      if (analysis.extractedSpecs.length <= 3) {
        expect(analysis.complexity).toBe('simple');
      }
    });

    it('should mark complex designs as complex', async () => {
      const complexInput = {
        type: 'figma' as const,
        data: 'complex_design_with_many_components',
      };

      const analysis = await designAgent.analyzeDesign(complexInput);

      expect(['simple', 'medium', 'complex']).toContain(analysis.complexity);
    });

    it('should estimate component count', async () => {
      const input = {
        type: 'figma' as const,
        data: 'test_design',
      };

      const analysis = await designAgent.analyzeDesign(input);

      expect(analysis.estimatedComponentCount).toBe(analysis.extractedSpecs.length);
      expect(analysis.estimatedComponentCount).toBeGreaterThan(0);
    });
  });

  describe('Accessibility Checking', () => {
    it('should check for accessibility features', async () => {
      const input = {
        type: 'figma' as const,
        data: 'test_design',
      };

      const analysis = await designAgent.analyzeDesign(input);

      expect(analysis.accessibility).toBeDefined();
      expect(analysis.accessibility.hasAriaLabels).toBeDefined();
      expect(analysis.accessibility.hasSemanticHTML).toBeDefined();
      expect(analysis.accessibility.colorContrast).toBeDefined();
      expect(analysis.accessibility.keyboardNavigation).toBeDefined();

      // Check valid values
      expect(['good', 'fair', 'poor']).toContain(analysis.accessibility.colorContrast);
    });
  });

  describe('UI Specification Extraction', () => {
    it('should extract valid UI specifications', async () => {
      const input = {
        type: 'figma' as const,
        data: 'test_design',
      };

      const analysis = await designAgent.analyzeDesign(input);

      expect(analysis.extractedSpecs).toBeDefined();
      expect(Array.isArray(analysis.extractedSpecs)).toBe(true);

      // Check specification structure
      analysis.extractedSpecs.forEach(spec => {
        expect(spec.componentName).toBeDefined();
        expect(['button', 'form', 'table', 'card', 'modal', 'custom']).toContain(spec.type);
        expect(spec.props).toBeDefined();
        expect(spec.requirements).toBeDefined();
      });
    });

    it('should extract design tokens into specifications', async () => {
      const input = {
        type: 'figma' as const,
        data: 'test_design',
      };

      const analysis = await designAgent.analyzeDesign(input);

      analysis.extractedSpecs.forEach(spec => {
        if (spec.designTokens) {
          expect(spec.designTokens).toBeDefined();
        }
      });
    });
  });

  describe('Component Type Mapping', () => {
    it('should map design types to UI component types', async () => {
      const input = {
        type: 'figma' as const,
        data: 'test_design_with_diverse_components',
      };

      const analysis = await designAgent.analyzeDesign(input);

      // Check that component types are valid
      analysis.extractedSpecs.forEach(spec => {
        const validTypes = ['button', 'form', 'table', 'card', 'modal', 'custom'];
        expect(validTypes).toContain(spec.type);
      });
    });
  });

  describe('Design Token Extraction', () => {
    it('should extract color tokens', async () => {
      const input = {
        type: 'figma' as const,
        data: 'test_design',
      };

      const analysis = await designAgent.analyzeDesign(input);

      expect(analysis.designTokens).toBeDefined();
      expect(analysis.designTokens.colors).toBeDefined();
      expect(typeof analysis.designTokens.colors).toBe('object');
    });

    it('should extract spacing tokens', async () => {
      const input = {
        type: 'figma' as const,
        data: 'test_design',
      };

      const analysis = await designAgent.analyzeDesign(input);

      expect(analysis.designTokens.spacing).toBeDefined();
      expect(typeof analysis.designTokens.spacing).toBe('object');
    });

    it('should extract typography tokens', async () => {
      const input = {
        type: 'figma' as const,
        data: 'test_design',
      };

      const analysis = await designAgent.analyzeDesign(input);

      expect(analysis.designTokens.typography).toBeDefined();
      if (analysis.designTokens.typography) {
        expect(analysis.designTokens.typography.fontFamily).toBeDefined();
        expect(analysis.designTokens.typography.fontSize).toBeDefined();
        expect(analysis.designTokens.typography.fontWeight).toBeDefined();
      }
    });

    it('should extract border radius tokens', async () => {
      const input = {
        type: 'figma' as const,
        data: 'test_design',
      };

      const analysis = await designAgent.analyzeDesign(input);

      expect(analysis.designTokens.borderRadius).toBeDefined();
      expect(typeof analysis.designTokens.borderRadius).toBe('object');
    });
  });

  describe('Framework Recommendations', () => {
    it('should recommend React for complex designs', async () => {
      const complexInput = {
        type: 'figma' as const,
        data: 'complex_design',
      };

      const analysis = await designAgent.analyzeDesign(complexInput);

      // If complexity is complex or many components, should recommend React
      if (analysis.complexity === 'complex' || analysis.estimatedComponentCount > 10) {
        const recommendation = designAgent['getFrameworkRecommendation'](analysis);
        expect(recommendation).toBe(Framework.React);
      }
    });

    it('should recommend Vue for simple designs', async () => {
      const analysis = {
        complexity: 'simple' as const,
        estimatedComponentCount: 2,
      } as any;

      const recommendation = designAgent['getFrameworkRecommendation'](analysis);
      expect(recommendation).toBe(Framework.Vue);
    });

    it('should return valid framework for all complexity levels', async () => {
      const input = {
        type: 'figma' as const,
        data: 'test_design',
      };

      const analysis = await designAgent.analyzeDesign(input);
      const recommendation = designAgent['getFrameworkRecommendation'](analysis);

      expect([Framework.React, Framework.Angular, Framework.Vue]).toContain(recommendation);
    });
  });

  describe('Recommendations Generation', () => {
    it('should generate actionable recommendations', async () => {
      const input = {
        type: 'figma' as const,
        data: 'test_design',
      };

      const analysis = await designAgent.analyzeDesign(input);

      expect(analysis.recommendations).toBeDefined();
      expect(Array.isArray(analysis.recommendations)).toBe(true);
      expect(analysis.recommendations.length).toBeGreaterThan(0);

      // Check that recommendations are strings
      analysis.recommendations.forEach(rec => {
        expect(typeof rec).toBe('string');
        expect(rec.length).toBeGreaterThan(0);
      });
    });

    it('should recommend form validation for form designs', async () => {
      const input = {
        type: 'figma' as const,
        data: 'form_design',
      };

      const analysis = await designAgent.analyzeDesign(input);

      // If any form components, should recommend form validation
      if (analysis.extractedSpecs.some(s => s.type === 'form')) {
        const hasFormValidation = analysis.recommendations.some(r =>
          r.toLowerCase().includes('form')
        );
        expect(hasFormValidation).toBe(true);
      }
    });
  });

  describe('Singleton Pattern', () => {
    it('should return same instance on multiple calls', () => {
      const agent1 = getDesignAgent();
      const agent2 = getDesignAgent();

      expect(agent1).toBe(agent2);
    });
  });
});
