/**
 * DesignAgent - Parse design inputs and extract UI specifications
 * Handles images, PDFs, and design tokens to generate framework-agnostic UI specs
 */

import { Framework, UISpec, DesignTokens, Typography, DesignInput } from '../base/types';

export interface DesignAnalysis {
  designInput: DesignInput;
  extractedSpecs: UISpec[];
  designTokens: DesignTokens;
  componentHierarchy: ComponentNode[];
  complexity: 'simple' | 'medium' | 'complex';
  estimatedComponentCount: number;
  accessibility: {
    hasAriaLabels: boolean;
    hasSemanticHTML: boolean;
    colorContrast: 'good' | 'fair' | 'poor';
    keyboardNavigation: boolean;
  };
  recommendations: string[];
}

export interface ComponentNode {
  name: string;
  type: string;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  children: ComponentNode[];
  properties: Record<string, unknown>;
}

export interface ExtractedDesignTokens {
  colors?: Record<string, string>;
  spacing?: Record<string, string>;
  typography?: Typography;
  borderRadius?: Record<string, string>;
  shadows?: Record<string, string>;
  breakpoints?: Record<string, string>;
}

export class DesignAgent {
  /**
   * Analyze design input and extract UI specifications
   */
  async analyzeDesign(designInput: DesignInput): Promise<DesignAnalysis> {
    console.log(`[DesignAgent] Analyzing design input: ${designInput.type}`);

    // Validate input
    const validation = this.validateDesignInput(designInput);
    if (!validation.valid) {
      throw new Error(`Invalid design input: ${validation.error}`);
    }

    try {
      // Step 1: Parse design based on type
      const parsedDesign = await this.parseDesignByType(designInput);

      // Step 2: Extract UI specifications
      const specs = this.extractUISpecifications(parsedDesign);

      // Step 3: Extract design tokens
      const tokens = this.extractDesignTokens(parsedDesign);

      // Step 4: Detect component hierarchy
      const hierarchy = this.detectComponentHierarchy(parsedDesign);

      // Step 5: Analyze complexity
      const complexity = this.analyzeComplexity(specs);

      // Step 6: Check accessibility
      const accessibility = this.checkAccessibility(parsedDesign);

      // Step 7: Generate recommendations
      const recommendations = this.generateRecommendations(specs, complexity, accessibility);

      const analysis: DesignAnalysis = {
        designInput,
        extractedSpecs: specs,
        designTokens: tokens,
        componentHierarchy: hierarchy,
        complexity,
        estimatedComponentCount: specs.length,
        accessibility,
        recommendations,
      };

      console.log(`[DesignAgent] Analysis complete: ${specs.length} specs, complexity: ${complexity}`);
      return analysis;
    } catch (error) {
      console.error('[DesignAgent] Error analyzing design:', error);
      throw error;
    }
  }

  /**
   * Validate design input
   */
  private validateDesignInput(input: DesignInput): { valid: boolean; error?: string } {
    if (!input.type) {
      return { valid: false, error: 'Missing design type' };
    }

    if (!input.data) {
      return { valid: false, error: 'Missing design data' };
    }

    const validTypes = ['figma', 'image', 'pdf', 'excel', 'word'];
    if (!validTypes.includes(input.type)) {
      return { valid: false, error: `Invalid design type: ${input.type}` };
    }

    return { valid: true };
  }

  /**
   * Parse design based on input type
   */
  private async parseDesignByType(
    designInput: DesignInput
  ): Promise<{
    type: string;
    components: Array<{
      name: string;
      type: string;
      bbox?: { x: number; y: number; width: number; height: number };
      properties: Record<string, unknown>;
    }>;
    tokens: ExtractedDesignTokens;
    metadata: Record<string, unknown>;
  }> {
    switch (designInput.type) {
      case 'figma':
        return this.parseFigmaDesign(designInput.data);
      case 'image':
        return this.parseImageDesign(designInput.data);
      case 'pdf':
        return this.parsePdfDesign(designInput.data);
      case 'excel':
        return this.parseExcelDesign(designInput.data);
      case 'word':
        return this.parseWordDesign(designInput.data);
      default:
        throw new Error(`Unsupported design type: ${designInput.type}`);
    }
  }

  /**
   * Parse Figma design (wireframe/prototype)
   */
  private async parseFigmaDesign(
    _data: string
  ): Promise<{
    type: string;
    components: Array<{
      name: string;
      type: string;
      bbox?: { x: number; y: number; width: number; height: number };
      properties: Record<string, unknown>;
    }>;
    tokens: ExtractedDesignTokens;
    metadata: Record<string, unknown>;
  }> {
    console.log('[DesignAgent:Figma] Parsing Figma design...');

    // In Phase 2: Implement real Figma API integration
    // For now: Return stub with common Figma components
    return {
      type: 'figma',
      components: [
        {
          name: 'Navbar',
          type: 'container',
          bbox: { x: 0, y: 0, width: 1440, height: 80 },
          properties: {
            backgroundColor: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 20px',
          },
        },
        {
          name: 'HeroSection',
          type: 'section',
          bbox: { x: 0, y: 80, width: 1440, height: 400 },
          properties: {
            backgroundColor: '#f5f5f5',
            padding: '40px 20px',
          },
        },
        {
          name: 'Button',
          type: 'interactive',
          bbox: { x: 600, y: 250, width: 240, height: 48 },
          properties: {
            backgroundColor: '#0066cc',
            color: '#ffffff',
            fontSize: '16px',
            borderRadius: '8px',
          },
        },
        {
          name: 'FormSection',
          type: 'form',
          bbox: { x: 100, y: 500, width: 1240, height: 300 },
          properties: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          },
        },
      ],
      tokens: {
        colors: {
          primary: '#0066cc',
          secondary: '#f5f5f5',
          text: '#333333',
          border: '#cccccc',
        },
        spacing: {
          xs: '4px',
          sm: '8px',
          md: '16px',
          lg: '24px',
          xl: '32px',
        },
        typography: {
          fontFamily: 'Inter, sans-serif',
          fontSize: {
            xs: '12px',
            sm: '14px',
            md: '16px',
            lg: '20px',
            xl: '24px',
          },
          fontWeight: {
            light: 300,
            regular: 400,
            medium: 500,
            bold: 700,
          },
        },
        borderRadius: {
          small: '4px',
          medium: '8px',
          large: '12px',
        },
      },
      metadata: {
        source: 'figma',
        frameCount: 4,
        pageCount: 1,
      },
    };
  }

  /**
   * Parse image design (screenshot/mockup)
   */
  private async parseImageDesign(
    _data: string
  ): Promise<{
    type: string;
    components: Array<{ name: string; type: string; properties: Record<string, unknown> }>;
    tokens: ExtractedDesignTokens;
    metadata: Record<string, unknown>;
  }> {
    console.log('[DesignAgent:Image] Parsing image design...');

    // In Phase 2: Implement vision API using Claude to analyze images
    // For now: Return stub based on common UI patterns
    return {
      type: 'image',
      components: [
        {
          name: 'Card',
          type: 'card',
          properties: { padding: '16px', backgroundColor: '#ffffff', borderRadius: '8px' },
        },
        {
          name: 'Button',
          type: 'button',
          properties: { backgroundColor: '#0066cc', color: '#ffffff' },
        },
        {
          name: 'Text',
          type: 'text',
          properties: { color: '#333333', fontSize: '16px' },
        },
      ],
      tokens: {
        colors: {
          primary: '#0066cc',
          text: '#333333',
          background: '#ffffff',
        },
      },
      metadata: {
        source: 'image',
        extractionMethod: 'vision-api',
      },
    };
  }

  /**
   * Parse PDF design (technical spec/wireframe document)
   */
  private async parsePdfDesign(
    _data: string
  ): Promise<{
    type: string;
    components: Array<{ name: string; type: string; properties: Record<string, unknown> }>;
    tokens: ExtractedDesignTokens;
    metadata: Record<string, unknown>;
  }> {
    console.log('[DesignAgent:PDF] Parsing PDF design...');

    // In Phase 2: Implement PDF parsing with pdfjs-dist
    return {
      type: 'pdf',
      components: [
        {
          name: 'PDFComponent1',
          type: 'container',
          properties: { description: 'Parsed from PDF page 1' },
        },
      ],
      tokens: {},
      metadata: {
        source: 'pdf',
        pagesParsed: 1,
      },
    };
  }

  /**
   * Parse Excel design (data table/spreadsheet spec)
   */
  private async parseExcelDesign(
    _data: string
  ): Promise<{
    type: string;
    components: Array<{ name: string; type: string; properties: Record<string, unknown> }>;
    tokens: ExtractedDesignTokens;
    metadata: Record<string, unknown>;
  }> {
    console.log('[DesignAgent:Excel] Parsing Excel design...');

    return {
      type: 'excel',
      components: [
        {
          name: 'DataTable',
          type: 'table',
          properties: { columns: 5, rows: 10 },
        },
      ],
      tokens: {},
      metadata: {
        source: 'excel',
        sheetsDetected: 1,
      },
    };
  }

  /**
   * Parse Word design (document structure spec)
   */
  private async parseWordDesign(
    _data: string
  ): Promise<{
    type: string;
    components: Array<{ name: string; type: string; properties: Record<string, unknown> }>;
    tokens: ExtractedDesignTokens;
    metadata: Record<string, unknown>;
  }> {
    console.log('[DesignAgent:Word] Parsing Word design...');

    return {
      type: 'word',
      components: [
        {
          name: 'DocumentContent',
          type: 'text-container',
          properties: {},
        },
      ],
      tokens: {},
      metadata: {
        source: 'word',
      },
    };
  }

  /**
   * Extract UI specifications from parsed design
   */
  private extractUISpecifications(parsedDesign: any): UISpec[] {
    console.log('[DesignAgent] Extracting UI specifications...');

    return parsedDesign.components.map((component: any) => ({
      componentName: component.name,
      type: this.mapComponentType(component.type),
      props: component.properties || {},
      requirements: `Component extracted from ${parsedDesign.type} design`,
      designTokens: parsedDesign.tokens,
    }));
  }

  /**
   * Map design component types to standard UI types
   */
  private mapComponentType(
    designType: string
  ): 'button' | 'form' | 'table' | 'card' | 'modal' | 'custom' {
    const typeMap: Record<string, 'button' | 'form' | 'table' | 'card' | 'modal' | 'custom'> = {
      interactive: 'button',
      form: 'form',
      table: 'table',
      card: 'card',
      modal: 'modal',
      section: 'custom',
      container: 'custom',
      text: 'custom',
    };
    return typeMap[designType] || 'custom';
  }

  /**
   * Extract design tokens (colors, spacing, typography, etc.)
   */
  private extractDesignTokens(parsedDesign: any): DesignTokens {
    const tokens = parsedDesign.tokens || {};

    return {
      colors: tokens.colors || {},
      spacing: tokens.spacing || {},
      typography: tokens.typography || {
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: { md: '16px' },
        fontWeight: { regular: 400 },
      },
      borderRadius: tokens.borderRadius || { md: '8px' },
      shadows: tokens.shadows || {},
    };
  }

  /**
   * Detect component hierarchy and nesting
   */
  private detectComponentHierarchy(parsedDesign: any): ComponentNode[] {
    console.log('[DesignAgent] Detecting component hierarchy...');

    return parsedDesign.components.map((component: any, index: number) => ({
      name: component.name,
      type: component.type,
      bbox: component.bbox || { x: 0, y: index * 100, width: 100, height: 100 },
      children: [],
      properties: component.properties || {},
    }));
  }

  /**
   * Analyze design complexity
   */
  private analyzeComplexity(specs: UISpec[]): 'simple' | 'medium' | 'complex' {
    if (specs.length <= 3) return 'simple';
    if (specs.length <= 10) return 'medium';
    return 'complex';
  }

  /**
   * Check accessibility features
   */
  private checkAccessibility(_parsedDesign: any): {
    hasAriaLabels: boolean;
    hasSemanticHTML: boolean;
    colorContrast: 'good' | 'fair' | 'poor';
    keyboardNavigation: boolean;
  } {
    // In Phase 2: Implement real accessibility checking
    return {
      hasAriaLabels: false,
      hasSemanticHTML: false,
      colorContrast: 'fair',
      keyboardNavigation: false,
    };
  }

  /**
   * Generate recommendations for framework selection
   */
  private generateRecommendations(
    specs: UISpec[],
    complexity: string,
    _accessibility: any
  ): string[] {
    const recommendations: string[] = [];

    if (complexity === 'complex') {
      recommendations.push('Use React for complex state management');
      recommendations.push('Consider data grid library for tables');
    }

    if (specs.some(s => s.type === 'form')) {
      recommendations.push('Add form validation library');
    }

    if (specs.some(s => s.type === 'table')) {
      recommendations.push('Consider AG Grid for advanced data tables');
    }

    recommendations.push('Ensure TypeScript strict mode for type safety');

    return recommendations;
  }

  /**
   * Get framework recommendation based on design analysis
   */
  getFrameworkRecommendation(analysis: DesignAnalysis): Framework {
    const { complexity, estimatedComponentCount } = analysis;

    if (complexity === 'complex' || estimatedComponentCount > 10) {
      return Framework.React; // React best for complex UIs
    }

    if (estimatedComponentCount <= 5) {
      return Framework.Vue; // Vue good for simple components
    }

    return Framework.React; // Default to React
  }
}

// Singleton instance
let designAgentInstance: DesignAgent | null = null;

export function getDesignAgent(): DesignAgent {
  if (!designAgentInstance) {
    designAgentInstance = new DesignAgent();
  }
  return designAgentInstance;
}
