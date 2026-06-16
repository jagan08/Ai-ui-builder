# Sprint 7 Plan: 4-Layer Validation Engine + Forensic Tracing

**Sprint**: 7 (Week 7)  
**Status**: 📋 Planning  
**Date**: 2026-06-16  
**Effort**: 40-50 hours estimated  
**Dependencies**: Sprint 6 complete (ReactAgent working) ✅

---

## 🎯 Objectives

Build comprehensive quality guardrails with 4-layer validation + forensic tracing to catch errors early and enable debugging across the multi-agent system.

**Deliverables**:
1. ✅ 4-layer guardrails system (validation orchestration)
2. ✅ TypeScript strict type checking
3. ✅ ESLint framework-specific rules
4. ✅ Jest test execution + coverage checks
5. ✅ Accessibility audit
6. ✅ Forensic tracing agent (AGENT_TRACE.md generation)
7. ✅ Integration with OrchestratorAgent
8. ✅ 30+ comprehensive tests

---

## 📊 Architecture

```
Generated Code
    ↓
┌─ Validation Engine (Orchestrator) ───────────┐
│                                              │
├─ Layer 1: TypeScript Strict ─────────────────┤
│  • tsc --noEmit --strict                     │
│  • Catch type errors, missing imports       │
│  • Enforce interfaces, generics             │
│                                              │
├─ Layer 2: ESLint (Framework-Specific) ────────┤
│  • React: Hooks rules, JSX rules            │
│  • Angular: Template syntax, pipes          │
│  • Vue: Composition API, reactivity         │
│  • TypeScript: Rule set union               │
│                                              │
├─ Layer 3: Jest Test Execution ────────────────┤
│  • Run generated tests                      │
│  • Check coverage >= 80%                    │
│  • Verify snapshot matches                  │
│  • Report failures                          │
│                                              │
├─ Layer 4: Accessibility Audit ────────────────┤
│  • ARIA label validation                    │
│  • Semantic HTML checks                     │
│  • Color contrast scoring                   │
│  • Keyboard navigation patterns             │
│  • WCAG 2.1 AA compliance                   │
│                                              │
└──────────────────────────────────────────────┘
    ↓
ValidationResult {
  typescript: { errors[], warnings[], passed }
  eslint: { errors[], warnings[], passed }
  tests: { passed, coverage, failures }
  accessibility: { score, issues, passed }
  overallPassed: boolean
  forensicsPath: "AGENT_TRACE.md"
}
    ↓
Forensic Tracing (AGENT_TRACE.md)
  - Full decision tree
  - All validation steps
  - Error logs
  - Performance metrics
```

---

## 🛠️ Implementation Plan

### Task 1: Validation Orchestrator ✅
**File**: `src/validation/guardrails.ts`  
**LOC**: ~150  
**Time**: 4 hours

**Features**:
- `ValidationEngine` class that orchestrates 4 layers
- `validate(code: string, framework: Framework): Promise<ValidationResult>`
- Sequential execution (stop on critical errors in Layer 1/2)
- Parallel execution for Layer 3-4 (tests + accessibility)
- Result aggregation and scoring
- Error message formatting

**Key Methods**:
```typescript
class ValidationEngine {
  async validate(code, framework): ValidationResult
  async validateTypescript(code): TypeScriptValidation
  async validateESLint(code, framework): ESLintValidation
  async validateTests(componentPath): TestValidation
  async validateAccessibility(code): AccessibilityValidation
  
  private aggregateResults(r1, r2, r3, r4): ValidationResult
  private scoreOverall(results): { score: number, passed: boolean }
}
```

**Tests** (5 tests):
- ✅ Orchestrator initialization
- ✅ All layers executed
- ✅ Passes when all layers pass
- ✅ Fails on TypeScript error
- ✅ Aggregates warnings from all layers

---

### Task 2: TypeScript Strict Validation ✅
**File**: `src/validation/typescript.ts`  
**LOC**: ~120  
**Time**: 4 hours

**Features**:
- `TypeScriptValidator` class
- Spawn `tsc` subprocess with strict flags
- Parse error output
- Categorize errors (missing types, unused vars, etc.)
- Return structured validation

**Key Methods**:
```typescript
class TypeScriptValidator {
  async validate(code, filename): TypeScriptValidation
  
  private parseErrors(output): Error[]
  private categorizeError(error): ErrorCategory
}
```

**Tests** (6 tests):
- ✅ Valid TypeScript passes
- ✅ Missing type annotation caught
- ✅ Unused variables warning
- ✅ Type mismatch error
- ✅ Missing import error
- ✅ Error message parsing

---

### Task 3: ESLint Framework-Specific Validation ✅
**File**: `src/validation/eslint.ts`  
**LOC**: ~150  
**Time**: 5 hours

**Features**:
- `ESLintValidator` class with framework-specific configs
- React config: Hooks rules, JSX rules, React best practices
- Angular config: Template syntax, pipe usage
- Vue config: Template directives, lifecycle hooks
- Spawn `eslint` subprocess with framework config
- Parse output (JSON format)
- Return structured validation

**Key Methods**:
```typescript
class ESLintValidator {
  async validate(code, framework): ESLintValidation
  
  private getConfigForFramework(framework): ESLintConfig
  private parseErrors(output): Error[]
  private categorizeError(error, framework): ErrorCategory
}
```

**Configs**:
- **React**: `eslint:recommended`, `plugin:react/recommended`, `plugin:react-hooks/recommended`
- **Angular**: `plugin:@angular-eslint/recommended`
- **Vue**: `plugin:vue/vue3-recommended`
- **All**: `plugin:@typescript-eslint/recommended`

**Tests** (6 tests):
- ✅ Valid code passes
- ✅ React Hook rule violation caught
- ✅ JSX prop validation
- ✅ Unused variable warning
- ✅ TypeScript rule violation
- ✅ Custom error reporting

---

### Task 4: Jest Test Execution Validation ✅
**File**: `src/validation/jest.ts`  
**LOC**: ~130  
**Time**: 4 hours

**Features**:
- `JestValidator` class
- Create temp Jest config
- Write component + test to temp directory
- Run `jest` subprocess
- Parse coverage report
- Check if coverage >= 80%
- Return test results + coverage

**Key Methods**:
```typescript
class JestValidator {
  async validate(component, testFile): TestValidation
  
  private createTempDir(): string
  private writeFiles(dir, component, test): void
  private runJest(dir): Promise<JestResult>
  private parseCoverage(report): CoverageMetrics
  private cleanup(dir): void
}
```

**Tests** (5 tests):
- ✅ Tests execution succeeds
- ✅ Coverage >= 80%
- ✅ Test failure caught
- ✅ Snapshot mismatch detected
- ✅ Temp directory cleanup

---

### Task 5: Accessibility Audit Validation ✅
**File**: `src/validation/accessibility.ts`  
**LOC**: ~140  
**Time**: 4 hours

**Features**:
- `AccessibilityValidator` class
- Parse HTML/JSX for accessibility markers
- Check for aria- attributes on interactive elements
- Validate semantic HTML (proper heading hierarchy, etc.)
- Color contrast heuristics (warn if not sufficient contrast)
- Keyboard navigation patterns
- WCAG 2.1 AA compliance checks
- Generate accessibility report

**Key Methods**:
```typescript
class AccessibilityValidator {
  async validate(code): AccessibilityValidation
  
  private checkAriaLabels(ast): Issue[]
  private checkSemanticHTML(ast): Issue[]
  private checkColorContrast(code): Issue[]
  private checkKeyboardNav(code): Issue[]
  private scoreAccessibility(issues): number (0-100)
}
```

**Checks**:
- Buttons have `aria-label` or text content
- Forms have `htmlFor` on labels
- Interactive elements focusable
- Headings in proper order
- Images have `alt` text
- WCAG 2.1 AA color contrast (heuristic)

**Tests** (4 tests):
- ✅ Passes with proper ARIA labels
- ✅ Warns on missing aria-label
- ✅ Detects semantic HTML issues
- ✅ Reports color contrast concerns

---

### Task 6: Forensic Tracer ✅
**File**: `src/tracing/forensicTracer.ts`  
**LOC**: ~180  
**Time**: 6 hours

**Features**:
- `ForensicTracer` class that records all decisions
- Singleton instance (one per session)
- Records:
  - Design input
  - Framework selection rationale
  - UISpec extraction
  - Component generation steps
  - Validation layer results
  - Errors and warnings
  - Performance metrics
  - Agent messages
  - Timestamps
- Generate `AGENT_TRACE.md` markdown file
- Include decision tree visualization
- Performance summary
- Error log

**Key Methods**:
```typescript
class ForensicTracer {
  recordDesignInput(input): void
  recordFrameworkDecision(decision, rationale): void
  recordUISpec(specs): void
  recordComponentGeneration(component, metadata): void
  recordValidation(result, layer): void
  recordError(error, context): void
  recordMessage(agent, message): void
  recordPerformance(step, duration): void
  
  async generateTrace(outputPath): Promise<string>
  private formatMarkdown(): string
}
```

**AGENT_TRACE.md Format**:
```markdown
# Agent Trace - 2026-06-16T14:30:00Z

## Session: sess_abc123

## Design Input
- Type: image/png
- Size: 512x256 pixels
- URL: https://example.com/design.png

## Framework Selection
1. Explicit choice? No
2. Project context? No context
3. Design analysis? COMPLEXITY: medium, RECOMMENDATION: react
4. Historical? No history
5. **Selected**: React 18.2.0

## Phase 1: Design Analysis
- Components detected: 3 (Button, Form, Card)
- Design tokens extracted: 8 colors, 4 spacing sizes
- Complexity: medium
- Estimated time: 24s

## Phase 2: Component Generation (Button)
- Spec extraction: ✅ (5ms)
- TSX generation: ✅ (8ms)
- Test generation: ✅ (6ms)
- Type generation: ✅ (3ms)
- Total: 22ms

## Phase 3: Validation
### Layer 1: TypeScript
- Status: ✅ PASS
- Errors: 0
- Warnings: 0

### Layer 2: ESLint
- Status: ✅ PASS
- Errors: 0
- Warnings: 1 (unused var)

### Layer 3: Jest
- Status: ✅ PASS
- Tests: 5 passed
- Coverage: 92%

### Layer 4: Accessibility
- Status: ✅ PASS
- Issues: 0
- Score: 95/100

## Overall Status: ✅ PASSED
- Total time: 35s
- Cost: $0.42
- All validations: PASSED

## Errors
(none)

## Performance Summary
- Design analysis: 5s
- Component generation: 3 components × 22ms = 66ms
- Validation: 4 layers × 2s avg = 8s
- Total: 13s
```

**Tests** (5 tests):
- ✅ Trace initialization
- ✅ Records all events
- ✅ Generates markdown
- ✅ Format validation
- ✅ Performance metrics accurate

---

### Task 7: Integration with OrchestratorAgent ✅
**File**: `src/agents/orchestrator/OrchestratorAgent.ts` (modify)  
**LOC**: +50 modifications  
**Time**: 3 hours

**Changes**:
- Import `ValidationEngine`, `ForensicTracer`
- After code generation, run `ValidationEngine.validate()`
- Record all validation steps in `ForensicTracer`
- Return validation result to user
- Update session context with validation status
- Handle validation failures (suggest fixes or allow override)

**Flow**:
```typescript
async orchestrateGeneration(spec, framework) {
  // 1. Generate code
  const component = await agent.generateComponent(spec);
  
  // 2. Run validation
  const validation = await validationEngine.validate(component.content, framework);
  
  // 3. Trace results
  tracer.recordValidation(validation, 'Layer 1+2+3+4');
  
  // 4. Return to user
  return {
    component,
    validation,
    status: validation.overallPassed ? 'approved' : 'needs-review'
  };
}
```

**Tests** (3 tests):
- ✅ Validation integrated
- ✅ Tracer records validation
- ✅ Status reflects validation result

---

### Task 8: Comprehensive Test Suite ✅
**File**: `tests/validation/guardrails.test.ts` (new)  
**File**: `tests/validation/typescript.test.ts` (new)  
**File**: `tests/validation/eslint.test.ts` (new)  
**File**: `tests/validation/jest.test.ts` (new)  
**File**: `tests/validation/accessibility.test.ts` (new)  
**File**: `tests/tracing/forensic.test.ts` (new)  
**LOC**: ~400 total  
**Time**: 8 hours

**Coverage**:
- 5 tests guardrails orchestration
- 6 tests TypeScript validator
- 6 tests ESLint validator
- 5 tests Jest validator
- 4 tests Accessibility validator
- 5 tests Forensic tracer
- **Total**: 31 tests

**Target**: All tests passing, 100% code coverage for validators

---

## 📈 Success Criteria

### Functional
- ✅ Generated React code passes all 4 layers
- ✅ Invalid code caught in Layer 1 or 2
- ✅ Test coverage >= 80% required to pass Layer 3
- ✅ Accessibility score >= 80 to pass Layer 4
- ✅ AGENT_TRACE.md generates with all decisions visible
- ✅ Validation can be bypassed for advanced users (with warning)

### Quality
- ✅ 31 new tests, all passing
- ✅ 100% TypeScript strict mode coverage
- ✅ 0 ESLint violations
- ✅ ~600 LOC new code
- ✅ All validators independently testable

### Performance
- ✅ TypeScript validation < 5s
- ✅ ESLint validation < 3s
- ✅ Test execution < 10s
- ✅ Accessibility check < 2s
- ✅ Total validation < 20s per component

### Documentation
- ✅ AGENT_TRACE.md human-readable
- ✅ Validation error messages actionable
- ✅ All validator methods documented

---

## 📋 Implementation Sequence

1. **Day 1 (4 hours)**: Validation Orchestrator + TypeScript Validator
   - Set up guardrails structure
   - Implement tsc integration
   - 10 tests

2. **Day 1 (4 hours)**: ESLint Validator
   - Framework-specific configs
   - Error parsing
   - 6 tests

3. **Day 2 (4 hours)**: Jest Validator + Accessibility Validator
   - Temp directory handling
   - Jest subprocess spawning
   - Accessibility checks
   - 9 tests

4. **Day 2 (6 hours)**: Forensic Tracer + Integration
   - Tracer singleton
   - Markdown generation
   - OrchestratorAgent integration
   - 6 tests

5. **Day 3 (12+ hours)**: Comprehensive Testing
   - Full integration tests
   - Error scenarios
   - Edge cases
   - 31 tests total

---

## 🔗 Files to Create/Modify

### New Files
| File | LOC | Purpose |
|------|-----|---------|
| `src/validation/guardrails.ts` | 150 | Orchestration |
| `src/validation/typescript.ts` | 120 | TypeScript checking |
| `src/validation/eslint.ts` | 150 | ESLint per-framework |
| `src/validation/jest.ts` | 130 | Test execution |
| `src/validation/accessibility.ts` | 140 | A11y audit |
| `src/tracing/forensicTracer.ts` | 180 | Decision tree tracing |
| `tests/validation/*.test.ts` | 400 | Test suite (6 files) |

### Modified Files
| File | Changes |
|------|---------|
| `src/agents/orchestrator/OrchestratorAgent.ts` | +50 LOC integration |
| `src/index.ts` | +API endpoints for validation |

---

## 🎯 Expected Outcomes

- ✅ Comprehensive quality gates
- ✅ Early error detection (layers 1-2)
- ✅ Test coverage enforcement
- ✅ Accessibility compliance checking
- ✅ Full forensic traces for debugging
- ✅ User-friendly validation reports
- ✅ ~600 LOC production code
- ✅ ~400 LOC test code
- ✅ 31 tests (100% passing)

---

## 📝 Success Metrics

After Sprint 7:
- React component generation + full validation < 45s end-to-end
- 0 generated components with failing validation
- 100% code coverage for validators
- Forensic traces help debug 95% of user issues
- All 4 layers working independently and together

---

## Next: Sprint 8 (Week 8)
- Project file writer (create folder structure)
- Approval workflow (user review)
- End-to-end testing
- Phase 1 MVP validation

**Gateway**: All Sprint 7 tests passing required before Sprint 8

---

**Status**: Ready for Sprint 7 implementation  
**Est. Start**: Immediately  
**Est. Completion**: Week 7  
**Gate to Phase 2**: Sprint 7 + Sprint 8 complete

